import request from "supertest";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { app } from "../../src/app";
import { prisma } from "../../src/utils/prisma";

// Mocking prisma
vi.mock("../../src/utils/prisma", () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
    },
}));

describe("Post /user/register - Integration Test", () => {
    beforeEach(() => {
        vi.clearAllMocks();

    });

    it("should create a user and return 201", async () => {
        const response = await request(app.server)
            .post("/user/register")
            .send({
                email: "teste@gmail.com",
                password: "123456",
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "User created successfully" });
    });

    it("should return 400 if validation fails", async () => {
        const response = await request(app.server)
            .post("/user/register")
            .send({
                email: "invalid-email",
                password: "123", // Senha muito curta
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

    it("should return 404 if email is already in use", async () => {
        prisma.user.findUnique = vi.fn().mockResolvedValue({
            id: "uuid_existing",
            email: "teste@gmail.com",
            password: "hashed_password",
        });

        const response = await request(app.server)
            .post("/user/register")
            .send({
                email: "teste@gmail.com",
                password: "123456",
            });

        expect(response.status).toBe(409);
        expect(response.body).toEqual({
            message: "Email already exists",
        });
    });
});