import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { userCreateController } from "../../controllers/user/userCreate.controller";
import { userLoginController } from "../../controllers/user/userLogin.controller";
import { userDeleteController } from "../../controllers/user/userDelete.controller";

export async function userRoutes(app: FastifyInstance) {
    app.post("/register", userCreateController);
    app.post("/login", userLoginController);
    app.delete("/delete", { preHandler: authMiddleware }, userDeleteController);
}