import { FastifyRequest, FastifyReply } from "fastify";
import { signupSchema, loginSchema, refreshSchema } from "./auth.schema.js";
import * as authService from "./auth.service.js";

export async function signupHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = signupSchema.parse(request.body);
  const result = await authService.signup(body);
  return reply.status(201).send(result);
}

export async function loginHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = loginSchema.parse(request.body);
  const result = await authService.login(body);
  return reply.send(result);
}

export async function refreshHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = refreshSchema.parse(request.body);
  const result = await authService.refresh(body.refreshToken);
  return reply.send(result);
}

export async function meHandler(request: FastifyRequest, reply: FastifyReply) {
  const result = await authService.me(request.user.sub);
  return reply.send(result);
}
