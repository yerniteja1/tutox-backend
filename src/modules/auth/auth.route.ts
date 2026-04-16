import { FastifyInstance } from "fastify";
import {loginHandler, meHandler, selectInstitutionHandler} from './auth.handler'
import { authenticate } from "../../middleware/authenticate";

export async function authRoutes(app: FastifyInstance) {
  app.post("/api/auth/login", loginHandler);

  app.post(
    "/api/auth/select-institution",
    { preHandler: [authenticate] },
    selectInstitutionHandler as any
  );
  
  app.get(
    "/api/auth/me",
    { preHandler: [authenticate] },
    meHandler
  );
}