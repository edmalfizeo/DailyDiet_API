import { buildApp } from "../../../src/app";
import { prisma } from "../../../src/utils/prisma";
import request from "supertest";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

let app: ReturnType<typeof buildApp>;

beforeEach(async () => {
    app = buildApp();
    await app.ready();

    // Limpar tabela de usuários
    await prisma.user.deleteMany();
});

afterEach(async () => {
    // Fechar o servidor após cada teste
    if (app) await app.close();
    await prisma.$disconnect();
});

describe("POST /user/register - Integration Test", () => {
    it("should create a user and return 201", async () => {
        const response = await request(app.server).post("/user/register").send({
            email: `test${Date.now()}@example.com`, // Email único para evitar colisões
            password: "password123",
        });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "User created successfully" });
    });

    it("should return 409 if email already exists", async () => {
        const email = `duplicate${Date.now()}@example.com`; // Email único para o teste

        // Criar usuário antes do teste
        await prisma.user.create({
            data: { email, password: "hashed_password" },
        });

        // Tentar criar o mesmo usuário novamente
        const response = await request(app.server).post("/user/register").send({
            email,
            password: "password123",
        });

        expect(response.status).toBe(409); // Verificar status 409
        expect(response.body).toEqual({ message: "Email already exists" }); // Verificar mensagem
    });
});