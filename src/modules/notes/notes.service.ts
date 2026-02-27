import { prisma } from "../../config/database.js";
import type { CreateNoteInput, UpdateNoteInput } from "./notes.schema.js";

function notFound(): never {
  const err = new Error("Note not found");
  (err as any).statusCode = 404;
  throw err;
}

export async function listByRoute(routeId: string, userId: string) {
  return prisma.note.findMany({
    where: { routeId, userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function create(userId: string, input: CreateNoteInput) {
  const route = await prisma.route.findFirst({
    where: { id: input.routeId, userId },
  });
  if (!route) {
    const err = new Error("Route not found");
    (err as any).statusCode = 404;
    throw err;
  }

  return prisma.note.create({ data: { ...input, userId } });
}

export async function update(
  id: string,
  userId: string,
  input: UpdateNoteInput
) {
  const existing = await prisma.note.findFirst({ where: { id, userId } });
  if (!existing) notFound();
  return prisma.note.update({ where: { id }, data: input });
}

export async function remove(id: string, userId: string) {
  const existing = await prisma.note.findFirst({ where: { id, userId } });
  if (!existing) notFound();
  await prisma.note.delete({ where: { id } });
}
