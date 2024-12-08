import { prisma } from "../../utils/prisma";

export const mealDeleteHandler = {
    async delete(mealId: string, userId: string) {
        // Verifica se a refeição pertence ao usuário
        const meal = await prisma.meal.findUnique({
            where: { id: mealId },
        });

        if (!meal || meal.userId !== userId) {
            throw new Error("Meal not found or not authorized");
        }

        // Exclui a refeição
        await prisma.meal.delete({
            where: { id: mealId },
        });

        return { message: "Meal deleted successfully" };
    },
};