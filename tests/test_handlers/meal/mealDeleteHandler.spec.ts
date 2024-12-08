import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../../src/utils/prisma";
import { mealDeleteHandler } from "../../../src/handlers/meal/mealDelete.handler";

vi.mock("../../../src/utils/prisma", () => ({
    prisma: {
        meal: {
            findUnique: vi.fn(),
            delete: vi.fn(),
        },
    },
}));

describe("mealDeleteHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should delete the meal successfully", async () => {
        vi.mocked(prisma.meal.findUnique).mockResolvedValue({
            id: "meal-id",
            name: "meal-name",
            calories: 500,
            userId: "user-id",
            createdAt: new Date(),
        });

        vi.mocked(prisma.meal.delete).mockResolvedValue({
            id: "meal-id",
            name: "meal-name",
            calories: 500,
            userId: "user-id",
            createdAt: new Date(),
        });

        const result = await mealDeleteHandler.delete("meal-id", "user-id");

        expect(prisma.meal.findUnique).toHaveBeenCalledWith({
            where: { id: "meal-id" },
        });
        expect(prisma.meal.delete).toHaveBeenCalledWith({
            where: { id: "meal-id" },
        });
        expect(result).toEqual({ message: "Meal deleted successfully" });
    });

    it("should throw an error if meal is not found", async () => {
        vi.mocked(prisma.meal.findUnique).mockResolvedValue(null);

        await expect(mealDeleteHandler.delete("meal-id", "user-id")).rejects.toThrow(
            "Meal not found or not authorized"
        );

        expect(prisma.meal.delete).not.toHaveBeenCalled();
    });

    it("should throw an error if user is not authorized", async () => {
        // Simula que a refeição pertence a outro usuário
        vi.mocked(prisma.meal.findUnique).mockResolvedValue({
            id: "meal-id",
            name: "meal-name",
            calories: 500,
            userId: "user-id-2",
            createdAt: new Date(),
        });

        // Não há necessidade de mockar `prisma.meal.delete`, pois não será chamado.

        await expect(mealDeleteHandler.delete("meal-id", "user-id")).rejects.toThrow(
            "Meal not found or not authorized"
        );

        // Verifica que o delete não foi chamado
        expect(prisma.meal.delete).not.toHaveBeenCalled();
    });
});