import { prisma } from "../../utils/prisma";

export const userDeleteHandler = async (userId: string) => {
    const deletedUser = await prisma.user.delete({
        where: {
            id: userId,
        },
    });

    return deletedUser;
};