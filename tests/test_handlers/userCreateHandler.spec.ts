import { describe, it, expect, vi, beforeEach } from "vitest";
import { userCreateHandler } from '../../src/handlers/user/userCreate.handler'
import { prisma } from '../../src/utils/prisma';

vi.mock('../../src/utils/prisma', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
        }
    }
}))

describe('userCreateHandler', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        prisma.user.findUnique = vi.fn().mockResolvedValue(null); // Usuário não existe por padrão
        prisma.user.create = vi.fn().mockResolvedValue({
            id: 'uuid_generated',
            email: 'teste@gmail.com',
            password: 'hashed_password',
        }); // Valor padrão ao criar
    });

    it('should create a user', async () => {
        const user = await userCreateHandler('teste@gmail.com', '123456')

        expect(user).toEqual({
            id: 'uuid_generated',
            email: 'teste@gmail.com',
            password: 'hashed_password'
        })

        expect(prisma.user.create).toHaveBeenCalledTimes(1);
    })

    it('should throw an error if user already exists', async () => {
        prisma.user.findUnique = vi.fn().mockResolvedValue({
            id: 'uuid_existing',
            email: 'teste@gmail.com',
            password: 'hashed_password'
        })

        await expect(userCreateHandler('teste@gmail.com', 'password123')).rejects.toThrow('Email already exists');


        expect(prisma.user.create).not.toHaveBeenCalled();
    })
})


