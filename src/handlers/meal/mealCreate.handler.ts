import { prisma } from "../../utils/prisma";

interface CreateMealInput {
    name: string;
    calories: number;
    userId: string;
}

export const createMealHandler = async ({ name, calories, userId }: CreateMealInput) => {
    const meal = await prisma.meal.create({
        data: {
            name,
            calories,
            userId,
        },
    });

    return meal;
};