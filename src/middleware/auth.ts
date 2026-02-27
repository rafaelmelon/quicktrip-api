import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken, TokenPayload } from "../utils/jwt.js";

declare module "fastify" {
  interface FastifyRequest {
    user: TokenPayload;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const header = request.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Missing or invalid token" });
  }

  try {
    const token = header.slice(7);
    request.user = verifyToken(token);
  } catch {
    return reply.status(401).send({ error: "Token expired or invalid" });
  }
}
