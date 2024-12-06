import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { userCreateHandler } from "../../handlers/user/userCreate.handler";
import { DuplicateEmailError } from "../../errors/duplicatedEmail";

const userCreateSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export async function userCreateController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { email, password } = userCreateSchema.parse(request.body);

        await userCreateHandler(email, password);

        reply.code(201).send({ message: "User created successfully" });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            reply.code(400).send({
                message: "Validation error",
                issues: error.errors.map((e) => ({
                    path: e.path.join("."),
                    message: e.message,
                })),
            });
        } else if (error instanceof DuplicateEmailError) {
            reply.code(error.statusCode).send({ message: error.message });
        } else {
            reply.code(500).send({ message: "Failed to create user" });
        }
    }
}