import { FastifyInstance } from "fastify";
import {loginHandler, selectInstitutionHandler} from './auth.handler'
import { authenticate } from "../../middleware/authenticate";

export async function authRoutes(app: FastifyInstance) {
  app.post("/api/auth/login", loginHandler);

  app.post(
    "/api/auth/select-institution",
    { preHandler: [authenticate] },
    selectInstitutionHandler
  );
  
  app.get(
  "/api/auth/me",
  { preHandler: [authenticate] },
  meHandler
);
}