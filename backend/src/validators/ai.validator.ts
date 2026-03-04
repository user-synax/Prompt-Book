import { z } from 'zod';

export const generateSchema = z.object({
  promptId: z.string().min(1),
  variables: z.record(z.string(), z.string()).optional().default({}),
  model: z.string().optional(),
});
