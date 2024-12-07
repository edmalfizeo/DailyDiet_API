import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { userCreateController } from "../../controllers/user/userCreate.controller";
import { userLoginController } from "../../controllers/user/userLogin.controller";
import { userDeleteController } from "../../controllers/user/userDelete.controller";

export async function userRoutes(app: FastifyInstance) {
    app.post("/user/register", userCreateController);
    app.post("/user/login", userLoginController);
    app.delete("/user/delete", { preHandler: authMiddleware }, userDeleteController);
}