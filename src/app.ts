import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { authRoutes } from "./modules/auth/auth.route";
import bcrypt from "bcrypt";

export const buildApp = () => {
  const app = Fastify({
    logger: true,
  });
  bcrypt.hash("123456", 10).then(console.log);
  
  app.register(cors, {
    origin: true,
  });

  app.register(jwt, {
    secret: process.env.JWT_SECRET as string,
  });

  app.register(authRoutes)

  app.get("/health", async () => {
    return { status: "ok" };
  });
  return app;
};
