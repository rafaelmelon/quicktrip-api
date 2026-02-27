import { prisma } from "../../config/database.js";
import type { CreatePlaceInput } from "./places.schema.js";

function notFound(): never {
  const err = new Error("Place not found");
  (err as any).statusCode = 404;
  throw err;
}

export async function list(userId: string) {
  return prisma.place.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function create(userId: string, input: CreatePlaceInput) {
  return prisma.place.create({ data: { ...input, userId } });
}

export async function remove(id: string, userId: string) {
  const existing = await prisma.place.findFirst({ where: { id, userId } });
  if (!existing) notFound();
  await prisma.place.delete({ where: { id } });
}
