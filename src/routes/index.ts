import { FastifyInstance } from "fastify";
import { userRoutes } from "./user/user";
import { mealRoutes } from "./meal/meal";

export async function registerRoutes(app: FastifyInstance) {
    app.register(userRoutes, { prefix: "/user" });
    app.register(mealRoutes, { prefix: "/meal" });
}