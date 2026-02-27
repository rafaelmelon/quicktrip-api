import { FastifyRequest, FastifyReply } from "fastify";
import {
  createRouteSchema,
  updateRouteSchema,
  routeParamsSchema,
} from "./routes.schema.js";
import * as routesService from "./routes.service.js";

export async function listHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const routes = await routesService.list(request.user.sub);
  return reply.send(routes);
}

export async function getHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = routeParamsSchema.parse(request.params);
  const route = await routesService.getById(id, request.user.sub);
  return reply.send(route);
}

export async function createHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = createRouteSchema.parse(request.body);
  const route = await routesService.create(request.user.sub, body);
  return reply.status(201).send(route);
}

export async function updateHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = routeParamsSchema.parse(request.params);
  const body = updateRouteSchema.parse(request.body);
  const route = await routesService.update(id, request.user.sub, body);
  return reply.send(route);
}

export async function removeHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = routeParamsSchema.parse(request.params);
  await routesService.remove(id, request.user.sub);
  return reply.status(204).send();
}
