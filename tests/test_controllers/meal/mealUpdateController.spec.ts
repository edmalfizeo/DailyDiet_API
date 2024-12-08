import { describe, it, expect, vi, beforeEach } from "vitest";
import { mealUpdateController } from "../../../src/controllers/meal/mealUpdate.controller";
import { mealUpdateHandler } from "../../../src/handlers/meal/mealUpdate.handler";

vi.mock("../../../src/handlers/meal/mealUpdate.handler", () => ({
    mealUpdateHandler: {
        update: vi.fn(),
    },
}));

describe("mealUpdateController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 200 and the updated meal on success", async () => {
        const mockRequest = {
            params: { mealId: "meal-id" },
            body: { name: "Updated Meal", calories: 700 },
            user: { id: "user-id" },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        vi.mocked(mealUpdateHandler.update).mockResolvedValue({
            id: "meal-id",
            name: "Updated Meal",
            calories: 700,
            userId: "user-id",
            createdAt: new Date(),
        });

        await mealUpdateController(mockRequest as any, mockReply as any);

        expect(mealUpdateHandler.update).toHaveBeenCalledWith(
            "meal-id",
            "user-id",
            { name: "Updated Meal", calories: 700 }
        );
        expect(mockReply.code).toHaveBeenCalledWith(200);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Meal updated successfully",
            meal: {
                id: "meal-id",
                name: "Updated Meal",
                calories: 700,
                userId: "user-id",
                createdAt: expect.any(Date),
            },
        });
    });

    it("should return 404 if meal is not found or user is not authorized", async () => {
        const mockRequest = {
            params: { mealId: "meal-id" },
            body: { name: "Updated Meal", calories: 700 },
            user: { id: "user-id" },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        vi.mocked(mealUpdateHandler.update).mockRejectedValue(
            new Error("Meal not found or not authorized")
        );

        await mealUpdateController(mockRequest as any, mockReply as any);

        expect(mockReply.code).toHaveBeenCalledWith(404);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Meal not found or not authorized",
        });
    });

    it("should return 500 if an unexpected error occurs", async () => {
        const mockRequest = {
            params: { mealId: "meal-id" },
            body: { name: "Updated Meal", calories: 700 },
            user: { id: "user-id" },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        vi.mocked(mealUpdateHandler.update).mockRejectedValue(
            new Error("Unexpected error")
        );

        await mealUpdateController(mockRequest as any, mockReply as any);

        expect(mockReply.code).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Failed to update meal",
        });
    });
});
