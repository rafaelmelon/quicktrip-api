import { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/auth.js";
import * as ctrl from "./auth.controller.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/signup", ctrl.signupHandler);
  app.post("/auth/login", ctrl.loginHandler);
  app.post("/auth/refresh", ctrl.refreshHandler);
  app.get("/auth/me", { preHandler: [authenticate] }, ctrl.meHandler);
}
