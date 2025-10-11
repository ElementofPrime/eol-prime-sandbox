import { z } from 'zod';

export const JournalCreateSchema = z.object({
  title: z.string().trim().max(200).optional(),
  content: z.string().min(1, 'Content is required'),
  mood: z.string().trim().max(50).optional(),
  tags: z.array(z.string().trim().max(32)).optional(),
});

export const JournalUpdateSchema = JournalCreateSchema.partial();
