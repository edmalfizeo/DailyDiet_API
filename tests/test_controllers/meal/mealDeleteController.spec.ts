import { describe, it, expect, vi, beforeEach } from "vitest";
import { mealDeleteController } from "../../../src/controllers/meal/mealDelete.controller";
import { mealDeleteHandler } from "../../../src/handlers/meal/mealDelete.handler";

vi.mock("../../../src/handlers/meal/mealDelete.handler", () => ({
    mealDeleteHandler: {
        delete: vi.fn(),
    },
}));

describe("mealDeleteController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 200 and a success message when meal is deleted", async () => {
        const mockRequest = {
            params: { mealId: "meal-id" },
            user: { id: "user-id" },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        vi.mocked(mealDeleteHandler.delete).mockResolvedValue({ message: "Meal deleted successfully" });

        await mealDeleteController(mockRequest as any, mockReply as any);

        expect(mealDeleteHandler.delete).toHaveBeenCalledWith("meal-id", "user-id");
        expect(mockReply.code).toHaveBeenCalledWith(200);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Meal deleted successfully",
        });
    });

    it("should return 404 if meal is not found or user is not authorized", async () => {
        const mockRequest = {
            params: { mealId: "meal-id" },
            user: { id: "user-id" },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        vi.mocked(mealDeleteHandler.delete).mockRejectedValue(
            new Error("Meal not found or not authorized")
        );

        await mealDeleteController(mockRequest as any, mockReply as any);

        expect(mockReply.code).toHaveBeenCalledWith(404);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Meal not found or not authorized",
        });
    });

    it("should return 500 if an unexpected error occurs", async () => {
        const mockRequest = {
            params: { mealId: "meal-id" },
            user: { id: "user-id" },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        vi.mocked(mealDeleteHandler.delete).mockRejectedValue(
            new Error("Unexpected error")
        );

        await mealDeleteController(mockRequest as any, mockReply as any);

        expect(mockReply.code).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Failed to delete meal",
        });
    });
});
