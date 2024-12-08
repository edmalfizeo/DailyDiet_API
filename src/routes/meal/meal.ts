import { FastifyInstance } from "fastify";
import { mealCreateController } from "../../controllers/meal/mealCreate.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export async function mealRoutes(app: FastifyInstance) {
    app.post("/create", { preHandler: [authMiddleware] }, mealCreateController);
}