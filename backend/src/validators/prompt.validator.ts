import { z } from 'zod';
import { CATEGORIES } from '../models/Prompt';

export const createPromptSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').trim(),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').trim().optional().default(''),
  content: z.string().min(1, 'Prompt content is required').trim(),
  category: z.enum(CATEGORIES).optional().default('general'),
  tags: z.array(z.string().trim().max(50)).max(10, 'Cannot have more than 10 tags').optional().default([]),
  rating: z.number().min(1).max(5).nullable().optional(),
  isPublic: z.boolean().optional().default(false),
});

export const updatePromptSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  description: z.string().max(1000).trim().optional(),
  content: z.string().min(1).trim().optional(),
  category: z.enum(CATEGORIES).optional(),
  tags: z.array(z.string().trim().max(50)).max(10).optional(),
  rating: z.number().min(1).max(5).nullable().optional(),
  isPublic: z.boolean().optional(),
});

export const promptQuerySchema = z.object({
  search: z.string().optional(),
  category: z.enum(CATEGORIES).optional(),
  tags: z.string().optional(), // comma-separated, parsed in controller
  rating: z.string().optional().transform((v) => v ? Number(v) : undefined),
  isPublic: z.string().optional().transform((v) => v === 'true' ? true : v === 'false' ? false : undefined),
  isFavorite: z.string().optional().transform((v) => v === 'true' ? true : undefined),
  sort: z.enum(['newest', 'oldest', 'title', 'rating', 'updated']).optional().default('newest'),
  page: z.string().optional().transform((v) => v ? Number(v) : 1),
  limit: z.string().optional().transform((v) => v ? Math.min(Number(v), 100) : 20),
});
