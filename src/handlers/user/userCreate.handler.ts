import { prisma } from '../../utils/prisma';
import bcrypt from 'bcrypt';
import { DuplicateEmailError } from '../../errors/duplicatedEmail';

export async function userCreateHandler(email: string, password: string) {
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new DuplicateEmailError();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    return user;
}