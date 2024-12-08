import { FastifyRequest, FastifyReply } from "fastify";
import { mealListHandler } from "../../handlers/meal/mealList.handler";

export async function mealListController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const userId = request.user?.id; // Recupera o ID do usuário do middleware de autenticação

        if (!userId) {
            return reply.code(401).send({ message: "Unauthorized" });
        }

        const meals = await mealListHandler(userId);

        return reply.code(200).send(meals);
    } catch (error) {
        return reply.code(500).send({ message: "Failed to list meals" });
    }
}