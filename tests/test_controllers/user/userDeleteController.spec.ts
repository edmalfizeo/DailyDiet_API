import { describe, it, expect, vi, beforeEach } from "vitest";
import { userDeleteController } from "../../../src/controllers/user/userDelete.controller";
import { userDeleteHandler } from "../../../src/handlers/user/userDelete.handler";

vi.mock("../../../src/handlers/user/userDelete.handler", () => ({
    userDeleteHandler: vi.fn(),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("userDeleteController", () => {
    it("should return 200 and delete user successfully", async () => {
        (userDeleteHandler as any).mockResolvedValue({
            id: "user-id",
            email: "user@example.com",
        });

        const mockRequest = {
            user: {
                id: "user-id",
            },
        };

        const mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await userDeleteController(mockRequest as any, mockReply as any);

        expect(mockReply.status).toHaveBeenCalledWith(200);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "User deleted successfully",
            user: { id: "user-id", email: "user@example.com" },
        });
    });

    it("should return 401 if user is not authenticated", async () => {
        const mockRequest = {};

        const mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await userDeleteController(mockRequest as any, mockReply as any);

        expect(mockReply.status).toHaveBeenCalledWith(401);
        expect(mockReply.send).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should return 500 if deletion fails", async () => {
        (userDeleteHandler as any).mockRejectedValue(new Error("Deletion failed"));

        const mockRequest = {
            user: {
                id: "user-id",
            },
        };

        const mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await userDeleteController(mockRequest as any, mockReply as any);

        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({ message: "Failed to delete user" });
    });
});
