import { FastifyRequest, FastifyReply } from "fastify";
import { createPlaceSchema, placeParamsSchema } from "./places.schema.js";
import * as placesService from "./places.service.js";

export async function listHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const places = await placesService.list(request.user.sub);
  return reply.send(places);
}

export async function createHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = createPlaceSchema.parse(request.body);
  const place = await placesService.create(request.user.sub, body);
  return reply.status(201).send(place);
}

export async function removeHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = placeParamsSchema.parse(request.params);
  await placesService.remove(id, request.user.sub);
  return reply.status(204).send();
}
