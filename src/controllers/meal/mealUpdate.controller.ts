import { FastifyRequest, FastifyReply } from "fastify";
import { mealUpdateHandler } from "../../handlers/meal/mealUpdate.handler";

export async function mealUpdateController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { mealId } = request.params as { mealId: string };
        const userId = request.user?.id;
        if (!userId) {
            return reply.code(400).send({ message: "User not authenticated" });
        }
        const updates = request.body as { name?: string; calories?: number };

        // Chama o handler para atualizar a refeição
        const updatedMeal = await mealUpdateHandler.update(mealId, userId, updates);

        return reply.code(200).send({
            message: "Meal updated successfully",
            meal: updatedMeal,
        });
    } catch (error: any) {
        if (error.message === "Meal not found or not authorized") {
            return reply.code(404).send({ message: error.message });
        }

        console.error(error);
        return reply.code(500).send({ message: "Failed to update meal" });
    }
}
