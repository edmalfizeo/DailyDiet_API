import request from "supertest";
import { buildApp } from "../../../src/app";
import { prisma } from "../../../src/utils/prisma";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import bcrypt from "bcrypt";

describe("PUT /meal/:mealId - Integration Test", () => {
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
                password: hashedPassword,
            },
        });
        userId = user.id;

        const response = await request(app.server)
            .post("/user/login")
            .send({ email: "testuser@example.com", password: "password123" });

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

    it("should update the meal successfully", async () => {
        const response = await request(app.server)
            .put(`/meal/${mealId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Updated Meal", calories: 600 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Meal updated successfully",
            meal: expect.objectContaining({
                id: mealId,
                name: "Updated Meal",
                calories: 600,
            }),
        });

        const updatedMeal = await prisma.meal.findUnique({ where: { id: mealId } });
        expect(updatedMeal).toEqual(
            expect.objectContaining({
                id: mealId,
                name: "Updated Meal",
                calories: 600,
            })
        );
    });

    it("should return 404 if meal is not found", async () => {
        const response = await request(app.server)
            .put(`/meal/non-existent-id`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Updated Meal", calories: 600 });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: "Meal not found or not authorized",
        });
    });

    it("should return 401 if no token is provided", async () => {
        const response = await request(app.server)
            .put(`/meal/${mealId}`)
            .send({ name: "Updated Meal", calories: 600 });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });
});