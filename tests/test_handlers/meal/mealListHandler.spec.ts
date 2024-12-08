import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../../src/utils/prisma";
import { mealListHandler } from "../../../src/handlers/meal/mealList.handler";

vi.mock("../../../src/utils/prisma", () => ({
    prisma: {
        meal: {
            findMany: vi.fn(),
        },
    },
}));

describe("mealListHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return a list of meals for the user", async () => {
        const mockMeals = [
            {
                id: "meal1",
                name: "Breakfast",
                calories: 300,
                createdAt: new Date(),
            },
            {
                id: "meal2",
                name: "Lunch",
                calories: 500,
                createdAt: new Date(),
            },
        ];

        (prisma.meal.findMany as any).mockResolvedValue(mockMeals);

        const result = await mealListHandler("user123");
        expect(prisma.meal.findMany).toHaveBeenCalledWith({
            where: { userId: "user123" },
            select: {
                id: true,
                name: true,
                calories: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });
        expect(result).toEqual(mockMeals);
    });

    it("should throw an error if fetching meals fails", async () => {
        (prisma.meal.findMany as any).mockRejectedValue(new Error("Database error"));

        await expect(mealListHandler("user123")).rejects.toThrow("Failed to fetch meals");
        expect(prisma.meal.findMany).toHaveBeenCalled();
    });
});