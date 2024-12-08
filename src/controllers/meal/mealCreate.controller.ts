import { FastifyRequest, FastifyReply } from "fastify";
import { createMealHandler } from "../../handlers/meal/mealCreate.handler";
import { z } from "zod";

// Definindo o schema de validação
const mealCreateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    calories: z.number().min(0, "Calories must be non-negative"),
});

export async function mealCreateController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id: userId } = request.user!;

        const { name, calories } = mealCreateSchema.parse(request.body);

        const meal = await createMealHandler({ userId, name, calories });

        return reply.code(201).send(meal);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.code(400).send({
                message: "Validation error",
                issues: error.errors.map(err => ({
                    path: err.path.join("."),
                    message: err.message,
                })),
            });
        }

        return reply.code(500).send({ message: "Failed to create meal" });
    }
}