import { FastifyInstance } from "fastify";
import {loginHandler} from './auth.handler'

export async function authRoutes(app: FastifyInstance){
  app.post("/api/auth/login", loginHandler)
}