import { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/auth.js";
import * as ctrl from "./notes.controller.js";

export async function noteRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);

  app.get("/notes", ctrl.listHandler);
  app.post("/notes", ctrl.createHandler);
  app.patch("/notes/:id", ctrl.updateHandler);
  app.delete("/notes/:id", ctrl.removeHandler);
}
