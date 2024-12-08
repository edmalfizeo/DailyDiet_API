import { prisma } from "../../utils/prisma";

export async function mealListHandler(userId: string) {
    try {
        const meals = await prisma.meal.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                calories: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return meals;
    } catch (error) {
        throw new Error("Failed to fetch meals");
    }
}