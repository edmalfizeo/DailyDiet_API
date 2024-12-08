import { describe, it, expect, vi, beforeEach } from "vitest";
import { userLoginController } from "../../../src/controllers/user/userLogin.controller";
import { userLoginHandler } from "../../../src/handlers/user/userLogin.handler";
import { InvalidCredentialsError } from "../../../src/errors/invalidCredentials";

vi.mock("../../../src/handlers/user/userLogin.handler", () => ({
    userLoginHandler: vi.fn(),
}));

describe("userLoginController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 200 and token when login is successful", async () => {
        const mockRequest = {
            body: {
                email: "test@example.com",
                password: "123456",
            },
        };

        const mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        (userLoginHandler as ReturnType<typeof vi.fn>).mockResolvedValue({
            token: "fake_jwt_token",
            user: {
                id: "uuid",
                email: "test@example.com",
            },
            expiresIn: 3600,
        });

        await userLoginController(mockRequest as any, mockReply as any);

        expect(userLoginHandler).toHaveBeenCalledWith(
            "test@example.com",
            "123456"
        );
        expect(mockReply.status).toHaveBeenCalledWith(200);
        expect(mockReply.send).toHaveBeenCalledWith({
            token: "fake_jwt_token",
            user: {
                id: "uuid",
                email: "test@example.com",
            },
            expiresIn: 3600,
        });
    });

    it("should return 400 if validation fails", async () => {
        const mockRequest = {
            body: {
                email: "invalid-email", // Email inválido
                password: "123",
            },
        };

        const mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await userLoginController(mockRequest as any, mockReply as any);

        expect(mockReply.status).toHaveBeenCalledWith(400);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Validation error",
            issues: [
                { path: "email", message: "Invalid email" },
                { path: "password", message: "Password must be at least 6 characters" },
            ],
        });
    });

    it("should return 401 if credentials are invalid", async () => {
        const mockRequest = {
            body: {
                email: "test@example.com",
                password: "wrongpassword",
            },
        };

        const mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        (userLoginHandler as ReturnType<typeof vi.fn>).mockRejectedValue(
            new InvalidCredentialsError()
        );

        await userLoginController(mockRequest as any, mockReply as any);

        expect(userLoginHandler).toHaveBeenCalledWith(
            "test@example.com",
            "wrongpassword"
        );
        expect(mockReply.status).toHaveBeenCalledWith(401);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Invalid credentials",
        });
    });

    it("should return 500 on unexpected error", async () => {
        const mockRequest = {
            body: {
                email: "test@example.com",
                password: "123456",
            },
        };

        const mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        (userLoginHandler as ReturnType<typeof vi.fn>).mockRejectedValue(
            new Error("Unexpected error")
        );

        await userLoginController(mockRequest as any, mockReply as any);

        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Failed to login",
        });
    });
});
