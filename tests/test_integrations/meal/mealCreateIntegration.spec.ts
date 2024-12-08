import { buildApp } from "../../../src/app";
import { prisma } from "../../../src/utils/prisma";
import request from "supertest";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { date } from "zod";

let app: ReturnType<typeof buildApp>;

beforeEach(async () => {
    app = buildApp();
    await app.ready();
    await prisma.meal.deleteMany(); // Limpar tabela de refeições
    await prisma.user.deleteMany(); // Limpar tabela de usuários
});

afterEach(async () => {
    await app.close(); // Fechar o servidor após cada teste
});

describe("POST /meal/create - Integration Test", () => {
    it("should create a meal successfully", async () => {
        // Criar um usuário para autenticação
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email: "test@example.com",
                password: hashedPassword,
            },
        });

        // Gerar token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret");

        const response = await request(app.server)
            .post("/meal/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Lunch",
                calories: 450,
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            {
                message: "Meal created successfully",
                meal: {
                    id: expect.any(String),
                    name: "Lunch",
                    calories: 450,
                    userId: user.id,
                    createdAt: expect.any(String),
                },
            });

        // Verificar se a refeição foi criada no banco de dados
        const meal = await prisma.meal.findFirst({ where: { name: "Lunch" } });
        expect(meal).toBeTruthy();
        expect(meal?.calories).toBe(450);
        expect(meal?.userId).toBe(user.id);
    });

    it("should return 401 if no token is provided", async () => {
        const response = await request(app.server)
            .post("/meal/create")
            .send({
                name: "Lunch",
                calories: 450,
            });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });

    it("should return 401 if token is invalid", async () => {
        const response = await request(app.server)
            .post("/meal/create")
            .set("Authorization", "Bearer invalid_token")
            .send({
                name: "Lunch",
                calories: 450,
            });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });
});