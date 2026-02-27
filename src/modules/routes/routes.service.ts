import { prisma } from "../../config/database.js";
import type { CreateRouteInput, UpdateRouteInput } from "./routes.schema.js";

const INCLUDE_STOPS = { stops: { orderBy: { position: "asc" as const } } };

function notFound(): never {
  const err = new Error("Route not found");
  (err as any).statusCode = 404;
  throw err;
}

export async function list(userId: string) {
  return prisma.route.findMany({
    where: { userId },
    include: { ...INCLUDE_STOPS, _count: { select: { notes: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getById(id: string, userId: string) {
  const route = await prisma.route.findFirst({
    where: { id, userId },
    include: { ...INCLUDE_STOPS, notes: { orderBy: { createdAt: "desc" } } },
  });
  if (!route) notFound();
  return route;
}

export async function create(userId: string, input: CreateRouteInput) {
  const { stops, ...routeData } = input;
  return prisma.route.create({
    data: {
      ...routeData,
      userId,
      stops: { create: stops },
    },
    include: INCLUDE_STOPS,
  });
}

export async function update(
  id: string,
  userId: string,
  input: UpdateRouteInput
) {
  const existing = await prisma.route.findFirst({ where: { id, userId } });
  if (!existing) notFound();

  const { stops, ...routeData } = input;

  return prisma.$transaction(async (tx) => {
    if (stops) {
      await tx.routeStop.deleteMany({ where: { routeId: id } });
      await tx.routeStop.createMany({
        data: stops.map((s) => ({ ...s, routeId: id })),
      });
    }

    return tx.route.update({
      where: { id },
      data: routeData,
      include: INCLUDE_STOPS,
    });
  });
}

export async function remove(id: string, userId: string) {
  const existing = await prisma.route.findFirst({ where: { id, userId } });
  if (!existing) notFound();
  await prisma.route.delete({ where: { id } });
}
