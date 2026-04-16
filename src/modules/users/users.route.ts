import { FastifyInstance } from "fastify";
import {
  getUsersHandler,
  getUserHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "./users.handler";
import { authenticate } from "../../middleware/authenticate";

export async function userRoutes(app: FastifyInstance) {
  app.get("/api/users", { preHandler: [authenticate] }, getUsersHandler);

  app.get("/api/users/:id", { preHandler: [authenticate] }, getUserHandler);

  app.post("/api/users", { preHandler: [authenticate] }, createUserHandler);

  app.patch("/api/users/:id", { preHandler: [authenticate] }, updateUserHandler);

  app.delete("/api/users/:id", { preHandler: [authenticate] }, deleteUserHandler);
}