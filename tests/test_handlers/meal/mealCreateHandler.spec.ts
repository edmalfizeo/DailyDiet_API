import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMealHandler } from "../../../src/handlers/meal/mealCreate.handler";
import { prisma } from "../../../src/utils/prisma";

vi.mock("../../../src/utils/prisma", () => ({
    prisma: {
        meal: {
            create: vi.fn(),
        },
    },
}));

describe("createMealHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should create a meal successfully", async () => {
        const mealData = {
            name: "Lunch",
            calories: 500,
            userId: "user-id",
        };

        (prisma.meal.create as any).mockResolvedValue({
            id: "meal-id",
            ...mealData,
        });

        const result = await createMealHandler(mealData);

        expect(result).toEqual({
            id: "meal-id",
            ...mealData,
        });

        expect(prisma.meal.create).toHaveBeenCalledWith({
            data: mealData,
        });
    });

    it("should throw an error if meal creation fails", async () => {
        (prisma.meal.create as any).mockRejectedValue(new Error("Creation failed"));

        const mealData = {
            name: "Lunch",
            calories: 500,
            userId: "user-id",
        };

        await expect(createMealHandler(mealData)).rejects.toThrow("Creation failed");

        expect(prisma.meal.create).toHaveBeenCalledWith({
            data: mealData,
        });
    });
});