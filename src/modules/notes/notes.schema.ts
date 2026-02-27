import { z } from "zod";

export const createNoteSchema = z.object({
  routeId: z.string().uuid(),
  content: z.string().min(1).max(2000),
});

export const updateNoteSchema = z.object({
  content: z.string().min(1).max(2000),
});

export const noteParamsSchema = z.object({ id: z.string().uuid() });

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
