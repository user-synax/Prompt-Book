import { Response } from 'express';
import * as promptService from '../services/prompt.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';

export const getPrompts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { search, category, tags, rating, isPublic, isFavorite, sort, page, limit } = req.query as any;

  const result = await promptService.getPrompts({
    userId: req.user!.id,
    search: search as string | undefined,
    category: category as string | undefined,
    tags: tags ? String(tags).split(',').map((t: string) => t.trim()) : undefined,
    rating: rating ? Number(rating) : undefined,
    isPublic,
    isFavorite,
    sort: sort as string | undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  res.json({ success: true, ...result });
});

export const getPrompt = asyncHandler(async (req: AuthRequest, res: Response) => {
  const prompt = await promptService.getPromptById(String(req.params.id), req.user!.id);
  res.json({ success: true, prompt });
});

export const createPrompt = asyncHandler(async (req: AuthRequest, res: Response) => {
  const prompt = await promptService.createPrompt(req.body, req.user!.id);
  res.status(201).json({ success: true, prompt });
});

export const updatePrompt = asyncHandler(async (req: AuthRequest, res: Response) => {
  const prompt = await promptService.updatePrompt(String(req.params.id), req.body, req.user!.id);
  res.json({ success: true, prompt });
});

export const deletePrompt = asyncHandler(async (req: AuthRequest, res: Response) => {
  await promptService.deletePrompt(String(req.params.id), req.user!.id);
  res.json({ success: true, message: 'Prompt deleted' });
});

export const duplicatePrompt = asyncHandler(async (req: AuthRequest, res: Response) => {
  const prompt = await promptService.duplicatePrompt(String(req.params.id), req.user!.id);
  res.status(201).json({ success: true, prompt });
});

export const toggleFavorite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const prompt = await promptService.toggleFavorite(String(req.params.id), req.user!.id);
  res.json({ success: true, prompt });
});

export const getVersionHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const versions = await promptService.getVersionHistory(String(req.params.id), req.user!.id);
  res.json({ success: true, versions });
});

export const getSpecificVersion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const version = await promptService.getSpecificVersion(
    String(req.params.id),
    parseInt(String(req.params.version)),
    req.user!.id
  );
  res.json({ success: true, version });
});
