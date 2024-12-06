import { FastifyReply, FastifyRequest } from "fastify";
import jwt, { JwtPayload as JwtPayloadType } from "jsonwebtoken";

interface JwtPayload extends JwtPayloadType {
    id: string;
    email: string;
}

declare module "fastify" {
    interface FastifyRequest {
        user?: JwtPayload;
    }
}

export async function authMiddleware(request: FastifyRequest, response: FastifyReply) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return response.status(401).send({ message: "Unauthorized" });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in .env file");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        request.user = decoded;
    } catch (error) {
        return response.status(401).send({ message: "Unauthorized" });
    }
}