import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../../src/utils/prisma";
import { mealUpdateHandler } from "../../../src/handlers/meal/mealUpdate.handler";

vi.mock("../../../src/utils/prisma", () => ({
    prisma: {
        meal: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    },
}));

describe("mealUpdateHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should update the meal successfully", async () => {
        vi.mocked(prisma.meal.findUnique).mockResolvedValue({
            id: "meal-id",
            userId: "user-id",
            name: "Old Meal",
            calories: 500,
            createdAt: new Date(),
        });

        vi.mocked(prisma.meal.update).mockResolvedValue({
            id: "meal-id",
            name: "Updated Meal",
            calories: 700,
            userId: "user-id",
            createdAt: new Date(),
        });

        const result = await mealUpdateHandler.update("meal-id", "user-id", {
            name: "Updated Meal",
            calories: 700,
        });

        expect(prisma.meal.findUnique).toHaveBeenCalledWith({
            where: { id: "meal-id" },
        });
        expect(prisma.meal.update).toHaveBeenCalledWith({
            where: { id: "meal-id" },
            data: { name: "Updated Meal", calories: 700 },
        });
        expect(result).toEqual({
            id: "meal-id",
            name: "Updated Meal",
            calories: 700,
            userId: "user-id",
            createdAt: expect.any(Date),
        });
    });

    it("should throw an error if meal is not found", async () => {
        vi.mocked(prisma.meal.findUnique).mockResolvedValue(null);

        await expect(
            mealUpdateHandler.update("meal-id", "user-id", {
                name: "Updated Meal",
                calories: 700,
            })
        ).rejects.toThrowError("Meal not found or not authorized");

        expect(prisma.meal.update).not.toHaveBeenCalled();
    });

    it("should throw an error if user is not authorized", async () => {
        vi.mocked(prisma.meal.findUnique).mockResolvedValue({
            id: "meal-id",
            userId: "another-user-id",
            name: "Some Meal",
            calories: 500,
            createdAt: new Date(),
        });

        await expect(
            mealUpdateHandler.update("meal-id", "user-id", {
                name: "Updated Meal",
                calories: 700,
            })
        ).rejects.toThrowError("Meal not found or not authorized");

        expect(prisma.meal.update).not.toHaveBeenCalled();
    });
});
