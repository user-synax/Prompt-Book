import { Response } from 'express';
import { Prompt } from '../models/Prompt';
import { PromptHistory } from '../models/PromptHistory';
import { generateCompletion } from '../services/openai.service';
import { replaceVariables, extractVariables } from '../utils/templateParser';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from '../types';

export const generate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { promptId, variables, model } = req.body;

  const prompt = await Prompt.findOne({ _id: promptId, userId: req.user!.id });
  if (!prompt) {
    throw ApiError.notFound('Prompt not found');
  }

  // Check all required variables are provided
  const requiredVars = extractVariables(prompt.content);
  const missingVars = requiredVars.filter((v) => !(v in (variables || {})));
  if (missingVars.length > 0) {
    throw ApiError.badRequest(`Missing variables: ${missingVars.join(', ')}`);
  }

  // Replace variables in the prompt content
  const processedContent = replaceVariables(prompt.content, variables || {});

  // Call OpenAI
  const result = await generateCompletion({ prompt: processedContent, model });

  // Save to history
  await PromptHistory.create({
    promptId: prompt._id,
    promptVersion: prompt.version,
    promptContent: processedContent,
    userId: req.user!.id,
    variables: variables || {},
    generatedResponse: result.response,
    aiModel: result.model,
    tokensUsed: result.tokensUsed,
  });

  res.json({
    success: true,
    response: result.response,
    tokensUsed: result.tokensUsed,
    model: result.model,
    promptVersion: prompt.version,
  });
});

export const getHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const skip = (page - 1) * limit;

  const query: any = { userId: req.user!.id };
  if (req.query.promptId) {
    query.promptId = req.query.promptId;
  }

  const [history, total] = await Promise.all([
    PromptHistory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('promptId', 'title'),
    PromptHistory.countDocuments(query),
  ]);

  res.json({
    success: true,
    history,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});
