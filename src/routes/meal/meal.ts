import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { mealCreateController } from "../../controllers/meal/mealCreate.controller";
import { mealListController } from "../../controllers/meal/mealList.controller";
import { mealDeleteController } from "../../controllers/meal/mealDelete.controller";

export async function mealRoutes(app: FastifyInstance) {
    app.post("/create", { preHandler: [authMiddleware] }, mealCreateController);
    app.get("/list", { preHandler: [authMiddleware] }, mealListController);
    app.delete("/:mealId", { preHandler: [authMiddleware] }, mealDeleteController);
}