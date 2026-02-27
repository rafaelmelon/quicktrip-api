import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { env } from "../config/env.js";

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: "Validation failed",
      details: error.flatten().fieldErrors,
    });
  }

  const statusCode = error.statusCode ?? 500;
  const message =
    statusCode >= 500 && env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message;

  if (statusCode >= 500) {
    console.error(error);
  }

  return reply.status(statusCode).send({ error: message });
}
