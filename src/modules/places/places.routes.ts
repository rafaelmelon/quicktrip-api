import { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/auth.js";
import * as ctrl from "./places.controller.js";

export async function placeRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);

  app.get("/places", ctrl.listHandler);
  app.post("/places", ctrl.createHandler);
  app.delete("/places/:id", ctrl.removeHandler);
}
