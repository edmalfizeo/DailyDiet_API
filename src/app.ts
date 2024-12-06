import { fastify } from "fastify";
import { registerRoutes } from "./routes/index";

export const app = fastify();

registerRoutes(app);

app.listen({ port: 3000, host: '127.0.0.1' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});