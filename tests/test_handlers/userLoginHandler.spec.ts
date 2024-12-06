import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import { prisma } from "../../src/utils/prisma";
import { userLoginHandler } from "../../src/handlers/user/userLogin.handler";
import { InvalidCredentialsError } from "../../src/errors/invalidCredentials";

vi.mock("../../src/utils/prisma", () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
        },
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "fake_secret_key"; // Definindo JWT_SECRET para evitar erro
});

describe("userLoginHandler", () => {
    it("should throw InvalidCredentialsError if user is not found", async () => {
        (prisma.user.findUnique as any).mockResolvedValue(null);

        await expect(userLoginHandler("notfound@example.com", "password123")).rejects.toThrow(
            InvalidCredentialsError
        );

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: "notfound@example.com" },
        });
    });

    it("should throw InvalidCredentialsError if password is incorrect", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10);

        (prisma.user.findUnique as any).mockResolvedValue({
            id: "user-id",
            email: "user@example.com",
            password: hashedPassword,
        });

        await expect(userLoginHandler("user@example.com", "wrongpassword")).rejects.toThrow(
            InvalidCredentialsError
        );

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: "user@example.com" },
        });
    });

    it("should return token and user data on successful login", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10);

        (prisma.user.findUnique as any).mockResolvedValue({
            id: "user-id",
            email: "user@example.com",
            password: hashedPassword,
        });

        const result = await userLoginHandler("user@example.com", "password123");

        expect(result).toHaveProperty("token");
        expect(result.user).toEqual({
            id: "user-id",
            email: "user@example.com",
        });
        expect(result.expiresIn).toBe(3600);

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: "user@example.com" },
        });
    });
});
