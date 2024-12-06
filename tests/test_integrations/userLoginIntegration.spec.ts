import request from "supertest";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { app } from "../../src/app";
import { prisma } from "../../src/utils/prisma";
import bcrypt from "bcrypt";

vi.mock("../../src/utils/prisma", () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
        },
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "fake_secret_key";
});

describe("POST /user/login - Integration Test", () => {
    it("should return token and user data on successful login", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10);

        // Simula um usuário válido no banco
        (prisma.user.findUnique as any).mockResolvedValue({
            id: "user-id",
            email: "user@example.com",
            password: hashedPassword,
        });

        const response = await request(app.server)
            .post("/user/login")
            .send({
                email: "user@example.com",
                password: "password123",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body.user).toEqual({
            id: "user-id",
            email: "user@example.com",
        });
    });

    it("should return 401 if credentials are invalid", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10);

        (prisma.user.findUnique as any).mockResolvedValue({
            id: "user-id",
            email: "user@example.com",
            password: hashedPassword,
        });

        const response = await request(app.server)
            .post("/user/login")
            .send({
                email: "user@example.com",
                password: "wrongpassword",
            });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "Invalid credentials",
        });
    });

    it("should return 400 if validation fails", async () => {
        const response = await request(app.server)
            .post("/user/login")
            .send({
                email: "invalid-email",
                password: "123", // Senha curta
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Validation error",
            issues: [
                { path: "email", message: "Invalid email" },
                { path: "password", message: "Password must be at least 6 characters" },
            ],
        });
    });
});