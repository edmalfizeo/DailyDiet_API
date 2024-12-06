import { prisma } from '../../utils/prisma';
import bcrypt from 'bcrypt';
import { InvalidCredentialsError } from '../../errors/invalidCredentials';
import jwt from 'jsonwebtoken';

export const userLoginHandler = async (email: string, password: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in .env file");
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw new InvalidCredentialsError();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new InvalidCredentialsError();
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
        },
        expiresIn: 3600, // 1 hora em segundos
    };
}