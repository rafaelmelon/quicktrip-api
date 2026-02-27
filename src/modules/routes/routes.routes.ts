import { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/auth.js";
import * as ctrl from "./routes.controller.js";

export async function routeRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);

  app.get("/routes", ctrl.listHandler);
  app.get("/routes/:id", ctrl.getHandler);
  app.post("/routes", ctrl.createHandler);
  app.patch("/routes/:id", ctrl.updateHandler);
  app.delete("/routes/:id", ctrl.removeHandler);
}
