import { describe, it, expect, vi, beforeEach } from "vitest";
import { mealCreateController } from "../../../src/controllers/meal/mealCreate.controller";
import { createMealHandler } from "../../../src/handlers/meal/mealCreate.handler";

vi.mock("../../../src/handlers/meal/mealCreate.handler", () => ({
    createMealHandler: vi.fn(),
}));

describe("mealCreateController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 201 and the created meal on success", async () => {
        const mockRequest = {
            body: {
                name: "Lunch",
                calories: 500,
            },
            user: {
                id: "user-id",
            },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        (createMealHandler as ReturnType<typeof vi.fn>).mockResolvedValue({
            id: "meal-id",
            name: "Lunch",
            calories: 500,
            userId: "user-id",
        });

        await mealCreateController(mockRequest as any, mockReply as any);

        expect(createMealHandler).toHaveBeenCalledWith({
            userId: "user-id",
            name: "Lunch",
            calories: 500,
        });
        expect(mockReply.code).toHaveBeenCalledWith(201);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Meal created successfully",
            meal: {
                id: "meal-id",
                name: "Lunch",
                calories: 500,
                userId: "user-id",
            }
        });
    });

    it("should return 400 if validation fails", async () => {
        const mockRequest = {
            body: {
                name: "", // Nome inválido
                calories: -50, // Calorias inválidas
            },
            user: {
                id: "user-id",
            },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await mealCreateController(mockRequest as any, mockReply as any);

        expect(mockReply.code).toHaveBeenCalledWith(400);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Validation error",
            issues: [
                { path: "name", message: "Name is required" },
                { path: "calories", message: "Calories must be non-negative" },
            ],
        });
    });

    it("should return 500 if handler throws an error", async () => {
        const mockRequest = {
            body: {
                name: "Dinner",
                calories: 700,
            },
            user: {
                id: "user-id",
            },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        (createMealHandler as ReturnType<typeof vi.fn>).mockRejectedValue(
            new Error("Failed to create meal")
        );

        await mealCreateController(mockRequest as any, mockReply as any);

        expect(mockReply.code).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({ message: "Failed to create meal" });
    });
});