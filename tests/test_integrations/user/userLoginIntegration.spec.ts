import { buildApp } from "../../../src/app";
import { prisma } from "../../../src/utils/prisma";
import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

let app: ReturnType<typeof buildApp>;

beforeEach(async () => {
    app = buildApp();
    await app.ready();
    await prisma.user.deleteMany(); // Limpar tabela de usuários
});

afterEach(async () => {
    await app.close(); // Fechar o servidor após cada teste
    await prisma.$disconnect();
});

describe("POST /user/login - Integration Test", () => {
    it("should return token and user data on successful login", async () => {
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: { email: "test@example.com", password: hashedPassword },
        });

        const response = await request(app.server).post("/user/login").send({
            email: "test@example.com",
            password,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body.user).toEqual({ email: "test@example.com", id: expect.any(String) });
    });

    it("should return 401 if credentials are invalid", async () => {
        const response = await request(app.server).post("/user/login").send({
            email: "invalid@example.com",
            password: "wrongpassword",
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Invalid credentials" });
    });
});