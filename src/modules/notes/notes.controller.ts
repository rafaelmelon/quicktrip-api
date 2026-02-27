import { FastifyRequest, FastifyReply } from "fastify";
import {
  createNoteSchema,
  updateNoteSchema,
  noteParamsSchema,
} from "./notes.schema.js";
import * as notesService from "./notes.service.js";
import { z } from "zod";

const routeQuerySchema = z.object({ routeId: z.string().uuid() });

export async function listHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { routeId } = routeQuerySchema.parse(request.query);
  const notes = await notesService.listByRoute(routeId, request.user.sub);
  return reply.send(notes);
}

export async function createHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = createNoteSchema.parse(request.body);
  const note = await notesService.create(request.user.sub, body);
  return reply.status(201).send(note);
}

export async function updateHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = noteParamsSchema.parse(request.params);
  const body = updateNoteSchema.parse(request.body);
  const note = await notesService.update(id, request.user.sub, body);
  return reply.send(note);
}

export async function removeHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = noteParamsSchema.parse(request.params);
  await notesService.remove(id, request.user.sub);
  return reply.status(204).send();
}
