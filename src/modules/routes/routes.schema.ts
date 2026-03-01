import { z } from "zod";

const stopSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  photoUrl: z.string().url().optional(),
  position: z.number().int().min(0),
  category: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  description: z.string().optional(),
  placeId: z.string().optional(),
});

export const createRouteSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().min(1),
  transportMode: z.enum(["walking", "transit", "taxi"]).default("walking"),
  estimatedMinutes: z.number().int().positive(),
  departureTime: z.string().min(1),
  arrivalTime: z.string().min(1),
  originName: z.string().min(1),
  originLat: z.number().min(-90).max(90),
  originLng: z.number().min(-180).max(180),
  destinationName: z.string().min(1),
  destinationLat: z.number().min(-90).max(90),
  destinationLng: z.number().min(-180).max(180),
  stops: z.array(stopSchema).optional().default([]),
});

export const updateRouteSchema = createRouteSchema.partial();

export const routeParamsSchema = z.object({ id: z.string().uuid() });

export type CreateRouteInput = z.infer<typeof createRouteSchema>;
export type UpdateRouteInput = z.infer<typeof updateRouteSchema>;
