import request from "supertest";
import { buildApp } from "../../../src/app";
import { prisma } from "../../../src/utils/prisma";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import bcrypt from "bcrypt";

describe("DELETE /meal/:mealId - Integration Test", () => {
    let app: any;
    let token: string;
    let userId: string;
    let mealId: string;

    beforeAll(async () => {
        app = await buildApp();
        await app.ready();

        const hashedPassword = await bcrypt.hash("password123", 10);

        const user = await prisma.user.create({
            data: {
                email: "testuser@example.com",
                password: hashedPassword, // Use o hash gerado
            },
        });
        userId = user.id;

        const response = await request(app.server)
            .post("/user/login")
            .send({ email: "testuser@example.com", password: "password123" }); // Correspondente à senha original

        if (!response.body.token) {
            throw new Error("Token não gerado no login.");
        }

        token = response.body.token;

        const meal = await prisma.meal.create({
            data: {
                name: "Test Meal",
                calories: 500,
                userId,
            },
        });
        mealId = meal.id;
    });

    afterAll(async () => {
        await prisma.meal.deleteMany();
        await prisma.user.deleteMany();
        await app.close();
    });

    it("should delete the meal successfully", async () => {
        const response = await request(app.server)
            .delete(`/meal/${mealId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Meal deleted successfully" });

        const deletedMeal = await prisma.meal.findUnique({ where: { id: mealId } });
        expect(deletedMeal).toBeNull();
    });

    it("should return 404 if meal is not found", async () => {
        const response = await request(app.server)
            .delete("/meal/nonexistent-id")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: "Meal not found or not authorized",
        });
    });

    it("should return 401 if no token is provided", async () => {
        const response = await request(app.server).delete(`/meal/${mealId}`);

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });
});