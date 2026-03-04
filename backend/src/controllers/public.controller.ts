import { Request, Response } from 'express';
import { Prompt } from '../models/Prompt';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

export const getPublicPrompts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const skip = (page - 1) * limit;

  const query: any = { isPublic: true };

  if (req.query.search) {
    query.$text = { $search: req.query.search as string };
  }
  if (req.query.category) {
    query.category = req.query.category;
  }
  if (req.query.tags) {
    query.tags = { $in: (req.query.tags as string).split(',').map((t) => t.trim()) };
  }
  if (req.query.rating) {
    query.rating = parseInt(req.query.rating as string);
  }

  let sortOption: any = { createdAt: -1 };
  switch (req.query.sort) {
    case 'oldest': sortOption = { createdAt: 1 }; break;
    case 'title': sortOption = { title: 1 }; break;
    case 'rating': sortOption = { rating: -1 }; break;
  }

  const [prompts, total] = await Promise.all([
    Prompt.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name'),
    Prompt.countDocuments(query),
  ]);

  res.json({
    success: true,
    prompts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getPublicPrompt = asyncHandler(async (req: Request, res: Response) => {
  const prompt = await Prompt.findOne({ _id: req.params.id, isPublic: true })
    .populate('userId', 'name');

  if (!prompt) {
    throw ApiError.notFound('Prompt not found');
  }

  res.json({ success: true, prompt });
});
