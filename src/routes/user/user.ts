import { FastifyInstance } from "fastify";
import { userCreateController } from "../../controllers/user/userCreate.controller";

export async function userRoutes(app: FastifyInstance) {
    app.post("/user/register", userCreateController);
}