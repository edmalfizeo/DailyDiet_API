import { FastifyReply, FastifyRequest } from "fastify";
import { userDeleteHandler } from "../../handlers/user/userDelete.handler";

export async function userDeleteController(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
        return reply.status(401).send({ message: "Unauthorized" });
    }

    try {
        const deletedUser = await userDeleteHandler(request.user.id);

        return reply.status(200).send({
            message: "User deleted successfully",
            user: { id: deletedUser.id, email: deletedUser.email },
        });
    } catch (error) {
        return reply.status(500).send({ message: "Failed to delete user" });
    }
}