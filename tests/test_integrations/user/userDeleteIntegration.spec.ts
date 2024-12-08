import { buildApp } from "../../../src/app";
import { prisma } from "../../../src/utils/prisma";
import request from "supertest";
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

describe("DELETE /user/delete - Integration Test", () => {
    it("should delete the authenticated user successfully", async () => {
        const user = await prisma.user.create({
            data: { email: "test@example.com", password: "hashed_password" },
        });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });

        const response = await request(app.server)
            .delete("/user/delete")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User deleted successfully", user: { email: user.email, id: user.id } });
    });

    it("should return 401 if token is not provided", async () => {
        const response = await request(app.server).delete("/user/delete");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });

    it("should return 401 if token is invalid", async () => {
        const response = await request(app.server)
            .delete("/user/delete")
            .set("Authorization", "Bearer invalid_token");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });
});