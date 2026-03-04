export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Prompt {
  _id: string;
  title: string;
  description: string;
  content: string;
  category: Category;
  tags: string[];
  rating: number | null;
  isPublic: boolean;
  isFavorite: boolean;
  version: number;
  userId: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface PromptVersion {
  _id: string;
  promptId: string;
  version: number;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  rating: number | null;
  isPublic: boolean;
  createdAt: string;
}

export interface PromptHistory {
  _id: string;
  promptId: string | { _id: string; title: string };
  promptVersion: number;
  promptContent: string;
  userId: string;
  variables: Record<string, string>;
  generatedResponse: string;
  aiModel: string;
  tokensUsed: number | null;
  createdAt: string;
}

export type Category =
  | 'general'
  | 'coding'
  | 'writing'
  | 'design'
  | 'marketing'
  | 'education'
  | 'data'
  | 'other';

export const CATEGORIES: Category[] = [
  'general', 'coding', 'writing', 'design', 'marketing', 'education', 'data', 'other',
];

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  [key: string]: T | boolean | string | undefined;
}
