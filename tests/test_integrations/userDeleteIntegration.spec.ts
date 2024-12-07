import request from "supertest";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { app } from "../../src/app";
import { prisma } from "../../src/utils/prisma";
import jwt from "jsonwebtoken";

vi.mock("../../src/utils/prisma", () => ({
    prisma: {
        user: {
            delete: vi.fn(),
            findUnique: vi.fn(),
        },
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "fake_secret_key";
});

describe("DELETE /user - Integration Test", () => {
    it("should delete the authenticated user successfully", async () => {
        const token = jwt.sign({ id: "user-id", email: "user@example.com" }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });

        (prisma.user.delete as any).mockResolvedValue({
            id: "user-id",
            email: "user@example.com",
        });

        const response = await request(app.server)
            .delete("/user/delete")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "User deleted successfully",
            user: { id: "user-id", email: "user@example.com" },
        });
    });

    it("should return 401 if no token is provided", async () => {
        const response = await request(app.server).delete("/user/delete");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });

    it("should return 500 if deletion fails", async () => {
        const token = jwt.sign({ id: "user-id", email: "user@example.com" }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });

        (prisma.user.delete as any).mockRejectedValue(new Error("Deletion failed"));

        const response = await request(app.server)
            .delete("/user/delete")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Failed to delete user" });
    });
});