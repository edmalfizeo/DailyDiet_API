import { prisma } from "../../utils/prisma";

export const mealUpdateHandler = {
    async update(mealId: string, userId: string, updates: { name?: string; calories?: number }) {
        // Verifica se a refeição existe e pertence ao usuário
        const meal = await prisma.meal.findUnique({
            where: { id: mealId },
        });

        if (!meal || meal.userId !== userId) {
            throw new Error("Meal not found or not authorized");
        }

        // Atualiza a refeição com os novos dados
        const updatedMeal = await prisma.meal.update({
            where: { id: mealId },
            data: updates,
        });

        return updatedMeal;
    },
};
