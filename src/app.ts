import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { routeRoutes } from "./modules/routes/routes.routes.js";
import { placeRoutes } from "./modules/places/places.routes.js";
import { noteRoutes } from "./modules/notes/notes.routes.js";

export async function buildApp() {
  const app = Fastify({ logger: env.NODE_ENV !== "test" });

  await app.register(cors, {
    origin: env.CORS_ORIGINS.split(",").map((o) => o.trim()),
    credentials: true,
  });

  await app.register(helmet);

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  app.setErrorHandler(errorHandler);

  app.get("/health", async () => ({ status: "ok" }));

  await app.register(authRoutes, { prefix: "/api" });
  await app.register(routeRoutes, { prefix: "/api" });
  await app.register(placeRoutes, { prefix: "/api" });
  await app.register(noteRoutes, { prefix: "/api" });

  return app;
}
