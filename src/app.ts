import Fastify, { FastifyInstance } from "fastify";
import { registerRoutes } from "./routes";
import { prisma } from "./utils/prisma";

export function buildApp(): FastifyInstance {
  const app = Fastify();

  // Adicione middlewares aqui (se necessário)
  app.register(registerRoutes);

  // Garante que o Prisma seja conectado/desconectado corretamente
  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
}