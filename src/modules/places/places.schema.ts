import { z } from "zod";

export const createPlaceSchema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  photoUrl: z.string().url().optional(),
  category: z.string().optional(),
});

export const placeParamsSchema = z.object({ id: z.string().uuid() });

export type CreatePlaceInput = z.infer<typeof createPlaceSchema>;
