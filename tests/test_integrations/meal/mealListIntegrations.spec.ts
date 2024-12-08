import request from "supertest";
import { buildApp } from "../../../src/app";
import { prisma } from "../../../src/utils/prisma";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import bcrypt from "bcrypt";

describe("GET /meal - Integration Test", () => {
    let app: any;
    let token: string;
    let userId: string;

    beforeAll(async () => {
        app = await buildApp();
        await app.ready();

        // Criação do usuário com senha hashada
        const hashedPassword = await bcrypt.hash("password123", 10);

        const user = await prisma.user.create({
            data: {
                email: "testuser@example.com",
                password: hashedPassword,
            },
        });
        userId = user.id;

        // Autenticação do usuário
        const response = await request(app.server)
            .post("/user/login")
            .send({ email: "testuser@example.com", password: "password123" }); // Senha em texto puro

        if (!response.body.token) {
            throw new Error("Token não gerado no login.");
        }

        token = response.body.token;

        // Criação de refeições para teste
        await prisma.meal.createMany({
            data: [
                { name: "Breakfast", calories: 300, userId },
                { name: "Lunch", calories: 600, userId },
            ],
        });
    });

    afterAll(async () => {
        await prisma.meal.deleteMany();
        await prisma.user.deleteMany();
        await app.close();
    });

    it("should list all meals for the authenticated user", async () => {
        const response = await request(app.server)
            .get("/meal/list")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2); // Agora verifica o array diretamente
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "Breakfast", calories: 300 }),
                expect.objectContaining({ name: "Lunch", calories: 600 }),
            ])
        );
    });

    it("should return 401 if no token is provided", async () => {
        const response = await request(app.server).get("/meal/list");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });
});