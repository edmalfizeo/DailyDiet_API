import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { mealDeleteHandler } from "../../handlers/meal/mealDelete.handler";

export async function mealDeleteController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { mealId } = request.params as { mealId: string };

        if (!request.user?.id) {
            return reply.code(401).send({ message: "Unauthorized" });
        }

        await mealDeleteHandler.delete(mealId, request.user.id);

        return reply.code(200).send({ message: "Meal deleted successfully" });
    } catch (error: any) {
        if (error.message === "Meal not found or not authorized") {
            return reply.code(404).send({ message: "Meal not found or not authorized" });
        }
        return reply.code(500).send({ message: "Failed to delete meal" });
    }
}