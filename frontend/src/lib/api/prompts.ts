import { api } from './client';
import type { Prompt, PromptVersion, PromptHistory, Pagination } from '@/types';

interface PromptsResponse {
  success: boolean;
  prompts: Prompt[];
  pagination: Pagination;
}

interface PromptResponse {
  success: boolean;
  prompt: Prompt;
}

interface VersionsResponse {
  success: boolean;
  versions: PromptVersion[];
}

interface GenerateResponse {
  success: boolean;
  response: string;
  tokensUsed: number | null;
  model: string;
  promptVersion: number;
}

interface HistoryResponse {
  success: boolean;
  history: PromptHistory[];
  pagination: Pagination;
}

export interface PromptFilters {
  search?: string;
  category?: string;
  tags?: string;
  rating?: number;
  isPublic?: boolean;
  isFavorite?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function fetchPromptsApi(filters: PromptFilters = {}): Promise<PromptsResponse> {
  return api.get<PromptsResponse>('/prompts', filters as Record<string, string | number | boolean | undefined>);
}

export async function fetchPromptApi(id: string): Promise<PromptResponse> {
  return api.get<PromptResponse>(`/prompts/${id}`);
}

export async function createPromptApi(data: Partial<Prompt>): Promise<PromptResponse> {
  return api.post<PromptResponse>('/prompts', data);
}

export async function updatePromptApi(id: string, data: Partial<Prompt>): Promise<PromptResponse> {
  return api.put<PromptResponse>(`/prompts/${id}`, data);
}

export async function deletePromptApi(id: string): Promise<{ success: boolean }> {
  return api.delete(`/prompts/${id}`);
}

export async function duplicatePromptApi(id: string): Promise<PromptResponse> {
  return api.post<PromptResponse>(`/prompts/${id}/duplicate`);
}

export async function toggleFavoriteApi(id: string): Promise<PromptResponse> {
  return api.patch<PromptResponse>(`/prompts/${id}/favorite`);
}

export async function fetchVersionsApi(id: string): Promise<VersionsResponse> {
  return api.get<VersionsResponse>(`/prompts/${id}/versions`);
}

export async function generateApi(promptId: string, variables: Record<string, string>, model?: string): Promise<GenerateResponse> {
  return api.post<GenerateResponse>('/ai/generate', { promptId, variables, model });
}

export async function fetchHistoryApi(page = 1, promptId?: string): Promise<HistoryResponse> {
  return api.get<HistoryResponse>('/ai/history', { page, promptId });
}

export async function fetchPublicPromptsApi(filters: PromptFilters = {}): Promise<PromptsResponse> {
  return api.get<PromptsResponse>('/public/prompts', filters as Record<string, string | number | boolean | undefined>);
}

export async function fetchPublicPromptApi(id: string): Promise<PromptResponse> {
  return api.get<PromptResponse>(`/public/prompts/${id}`);
}
