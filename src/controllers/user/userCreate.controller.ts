import { FastifyRequest, FastifyReply } from "fastify";
import { userCreateHandler } from "../../handlers/user/userCreate.handler";
import { z } from "zod";

export async function userCreateController(request: FastifyRequest, reply: FastifyReply) {
    const userCreateSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { email, password } = userCreateSchema.parse(request.body);

    if(!email || !password) {
        reply.status(400).send({ message: "Email and password are required" });
        return;
    }

    try {
        const user = await userCreateHandler(email, password);

        reply.code(201).send(user);
    } catch (error) {
        if ((error as any).code === 'P2002') { 
            reply.status(409).send({ message: "Email already in use" });
        } else {
            reply.status(500).send({ message: "Failed to create user" });
        }
    }

}