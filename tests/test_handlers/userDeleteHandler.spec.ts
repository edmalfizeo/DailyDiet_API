import { describe, it, expect, vi, beforeEach } from "vitest";
import { userDeleteHandler } from "../../src/handlers/user/userDelete.handler";
import { prisma } from "../../src/utils/prisma";

vi.mock("../../src/utils/prisma", () => ({
    prisma: {
        user: {
            delete: vi.fn(),
        },
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("userDeleteHandler", () => {
    it("should delete a user successfully", async () => {
        (prisma.user.delete as any).mockResolvedValue({
            id: "user-id",
            email: "user@example.com",
        });

        const result = await userDeleteHandler("user-id");

        expect(result).toEqual({
            id: "user-id",
            email: "user@example.com",
        });

        expect(prisma.user.delete).toHaveBeenCalledWith({
            where: {
                id: "user-id",
            },
        });
    });

    it("should throw an error if user deletion fails", async () => {
        (prisma.user.delete as any).mockRejectedValue(new Error("Deletion failed"));

        await expect(userDeleteHandler("user-id")).rejects.toThrow("Deletion failed");

        expect(prisma.user.delete).toHaveBeenCalledWith({
            where: {
                id: "user-id",
            },
        });
    });
});