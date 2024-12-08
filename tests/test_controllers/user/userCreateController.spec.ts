import { describe, it, expect, vi, beforeEach } from "vitest";
import { userCreateController } from "../../../src/controllers/user/userCreate.controller";
import { userCreateHandler } from "../../../src/handlers/user/userCreate.handler";

vi.mock("../../../src/handlers/user/userCreate.handler", () => ({
    userCreateHandler: vi.fn(),
}));

describe("userCreateController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 201 and 'User created successfully' when user is created", async () => {
        (userCreateHandler as ReturnType<typeof vi.fn>).mockResolvedValue({
            id: "uuid_generated",
            email: "teste@gmail.com",
            password: "hashed_password",
        });

        const mockRequest = {
            body: {
                email: "teste@gmail.com",
                password: "123456",
            },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await userCreateController(mockRequest as any, mockReply as any);

        expect(mockReply.code).toHaveBeenCalledWith(201);
        expect(mockReply.send).toHaveBeenCalledWith({ message: "User created successfully" });
    });

    it("should return 400 if validation fails", async () => {
        const mockRequest = {
            body: {
                email: "invalid-email",
                password: "123", // Password must be at least 6 characters
            },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await userCreateController(mockRequest as any, mockReply as any);

        expect(mockReply.code).toHaveBeenCalledWith(400);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Validation error",
            issues: [
                { path: "email", message: "Invalid email" },
                { path: "password", message: "Password must be at least 6 characters" },
            ],
        });
    });

    it("should return 500 if user creation fails", async () => {
        (userCreateHandler as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Failed to create user"));

        const mockRequest = {
            body: {
                email: "teste@gmail.com",
                password: "123456",
            },
        };

        const mockReply = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await userCreateController(mockRequest as any, mockReply as any);

        expect(mockReply.code).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({ message: "Failed to create user" });
    });
})