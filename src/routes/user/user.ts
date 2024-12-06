import { FastifyInstance } from "fastify";
import { userCreateController } from "../../controllers/user/userCreate.controller";
import { userLoginController } from "../../controllers/user/userLogin.controller";

export async function userRoutes(app: FastifyInstance) {
    app.post("/user/register", userCreateController);
    app.post("/user/login", userLoginController);
}