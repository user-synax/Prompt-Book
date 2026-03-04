import { Prompt, IPrompt } from '../models/Prompt';
import { PromptVersion } from '../models/PromptVersion';
import { ApiError } from '../utils/ApiError';
import mongoose from 'mongoose';

interface PromptFilters {
  userId: string;
  search?: string;
  category?: string;
  tags?: string[];
  rating?: number;
  isPublic?: boolean;
  isFavorite?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getPrompts(filters: PromptFilters) {
  const query: any = { userId: filters.userId };

  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  if (filters.rating) {
    query.rating = filters.rating;
  }
  if (filters.isPublic !== undefined) {
    query.isPublic = filters.isPublic;
  }
  if (filters.isFavorite !== undefined) {
    query.isFavorite = filters.isFavorite;
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  let sortOption: any = { createdAt: -1 };
  switch (filters.sort) {
    case 'oldest': sortOption = { createdAt: 1 }; break;
    case 'title': sortOption = { title: 1 }; break;
    case 'rating': sortOption = { rating: -1 }; break;
    case 'updated': sortOption = { updatedAt: -1 }; break;
  }

  const [prompts, total] = await Promise.all([
    Prompt.find(query).sort(sortOption).skip(skip).limit(limit),
    Prompt.countDocuments(query),
  ]);

  return {
    prompts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getPromptById(promptId: string, userId: string) {
  const prompt = await Prompt.findOne({ _id: promptId, userId });
  if (!prompt) {
    throw ApiError.notFound('Prompt not found');
  }
  return prompt;
}

export async function createPrompt(data: Partial<IPrompt>, userId: string) {
  const prompt = await Prompt.create({ ...data, userId, version: 1 });
  return prompt;
}

export async function updatePrompt(promptId: string, data: Partial<IPrompt>, userId: string) {
  const prompt = await Prompt.findOne({ _id: promptId, userId });
  if (!prompt) {
    throw ApiError.notFound('Prompt not found');
  }

  // Save current state as a version snapshot
  await PromptVersion.create({
    promptId: prompt._id,
    version: prompt.version,
    title: prompt.title,
    description: prompt.description,
    content: prompt.content,
    category: prompt.category,
    tags: prompt.tags,
    rating: prompt.rating,
    isPublic: prompt.isPublic,
  });

  // Update prompt and increment version
  const updateFields = { ...data, version: prompt.version + 1 };
  const updated = await Prompt.findByIdAndUpdate(promptId, updateFields, { new: true, runValidators: true });

  return updated;
}

export async function deletePrompt(promptId: string, userId: string) {
  const prompt = await Prompt.findOneAndDelete({ _id: promptId, userId });
  if (!prompt) {
    throw ApiError.notFound('Prompt not found');
  }

  // Clean up versions and history
  await PromptVersion.deleteMany({ promptId });

  return prompt;
}

export async function duplicatePrompt(promptId: string, userId: string) {
  const original = await Prompt.findOne({ _id: promptId, userId });
  if (!original) {
    throw ApiError.notFound('Prompt not found');
  }

  const duplicate = await Prompt.create({
    title: `${original.title} (Copy)`,
    description: original.description,
    content: original.content,
    category: original.category,
    tags: original.tags,
    rating: undefined,
    isPublic: false,
    isFavorite: false,
    version: 1,
    userId,
  });

  return duplicate;
}

export async function toggleFavorite(promptId: string, userId: string) {
  const prompt = await Prompt.findOne({ _id: promptId, userId });
  if (!prompt) {
    throw ApiError.notFound('Prompt not found');
  }
  prompt.isFavorite = !prompt.isFavorite;
  await prompt.save();
  return prompt;
}

export async function getVersionHistory(promptId: string, userId: string) {
  const prompt = await Prompt.findOne({ _id: promptId, userId });
  if (!prompt) {
    throw ApiError.notFound('Prompt not found');
  }

  const versions = await PromptVersion.find({ promptId }).sort({ version: -1 });
  return versions;
}

export async function getSpecificVersion(promptId: string, version: number, userId: string) {
  const prompt = await Prompt.findOne({ _id: promptId, userId });
  if (!prompt) {
    throw ApiError.notFound('Prompt not found');
  }

  // If requesting the current version, return the prompt itself
  if (version === prompt.version) {
    return prompt;
  }

  const versionDoc = await PromptVersion.findOne({ promptId, version });
  if (!versionDoc) {
    throw ApiError.notFound('Version not found');
  }

  return versionDoc;
}
