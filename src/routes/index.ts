import { FastifyInstance } from "fastify";
import { userRoutes } from "./user/user";

export async function registerRoutes(app: FastifyInstance) {
    await app.register(userRoutes);
}