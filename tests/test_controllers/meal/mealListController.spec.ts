import { describe, it, expect, vi, beforeEach } from "vitest";
import { mealListController } from "../../../src/controllers/meal/mealList.controller";
import { mealListHandler } from "../../../src/handlers/meal/mealList.handler";

vi.mock("../../../src/handlers/meal/mealList.handler", () => ({
    mealListHandler: vi.fn(),
}));

describe("mealListController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 200 and the list of meals on success", async () => {
        const mockRequest = {
            user: {
                id: "user-id",
            },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        const mockMeals = [
            {
                id: "meal-1",
                name: "Breakfast",
                calories: 300,
                createdAt: new Date("2024-12-01T08:00:00Z"),
                userId: "user-id",
            },
            {
                id: "meal-2",
                name: "Lunch",
                calories: 500,
                createdAt: new Date("2024-12-01T12:00:00Z"),
                userId: "user-id",
            },
        ];

        (mealListHandler as ReturnType<typeof vi.fn>).mockResolvedValue(mockMeals);

        await mealListController(mockRequest as any, mockReply as any);

        expect(mealListHandler).toHaveBeenCalledWith("user-id");
        expect(mockReply.code).toHaveBeenCalledWith(200);
        expect(mockReply.send).toHaveBeenCalledWith(mockMeals);
    });

    it("should return 500 if handler throws an error", async () => {
        const mockRequest = {
            user: {
                id: "user-id",
            },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        (mealListHandler as ReturnType<typeof vi.fn>).mockRejectedValue(
            new Error("Failed to list meals")
        );

        await mealListController(mockRequest as any, mockReply as any);

        expect(mealListHandler).toHaveBeenCalledWith("user-id");
        expect(mockReply.code).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({ message: "Failed to list meals" });
    });
});