import { FastifyReply, FastifyRequest } from "fastify";
import { userLoginHandler } from "../../handlers/user/userLogin.handler";
import { z } from "zod";
import { InvalidCredentialsError } from "../../errors/invalidCredentials";

const userLoginSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export async function userLoginController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const { email, password } = userLoginSchema.parse(request.body);

        const resultSucessLogin = await userLoginHandler(email, password);

        reply.status(200).send(resultSucessLogin);
    } catch (error) {
        if (error instanceof z.ZodError) {
            reply.status(400).send({
                message: "Validation error",
                issues: error.errors.map((e) => ({
                    path: e.path.join("."),
                    message: e.message,
                })),
            });
        } else if (error instanceof InvalidCredentialsError) {
            reply.status(401).send({ message: error.message });
        } else {
            console.error("Unexpected error in userLoginController:", error);
            reply.status(500).send({ message: "Failed to login" });
        }
    }
}