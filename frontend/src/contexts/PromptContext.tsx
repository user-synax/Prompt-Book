'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  fetchPromptsApi, createPromptApi, updatePromptApi,
  deletePromptApi, duplicatePromptApi, toggleFavoriteApi,
  type PromptFilters,
} from '@/lib/api/prompts';
import type { Prompt, Pagination } from '@/types';

interface PromptContextType {
  prompts: Prompt[];
  pagination: Pagination | null;
  isLoading: boolean;
  filters: PromptFilters;
  setFilters: (filters: PromptFilters) => void;
  fetchPrompts: (filters?: PromptFilters) => Promise<void>;
  createPrompt: (data: Partial<Prompt>) => Promise<Prompt>;
  updatePrompt: (id: string, data: Partial<Prompt>) => Promise<Prompt>;
  deletePrompt: (id: string) => Promise<void>;
  duplicatePrompt: (id: string) => Promise<Prompt>;
  toggleFavorite: (id: string) => Promise<void>;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export function PromptProvider({ children }: { children: ReactNode }) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFiltersState] = useState<PromptFilters>({ sort: 'newest' });

  const fetchPrompts = useCallback(async (overrideFilters?: PromptFilters) => {
    setIsLoading(true);
    try {
      const activeFilters = overrideFilters || filters;
      const data = await fetchPromptsApi(activeFilters);
      setPrompts(data.prompts);
      setPagination(data.pagination);
    } catch {
      // Error handled by caller
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const setFilters = useCallback((newFilters: PromptFilters) => {
    setFiltersState(newFilters);
  }, []);

  const createPrompt = async (data: Partial<Prompt>): Promise<Prompt> => {
    const res = await createPromptApi(data);
    await fetchPrompts();
    return res.prompt;
  };

  const updatePrompt = async (id: string, data: Partial<Prompt>): Promise<Prompt> => {
    const res = await updatePromptApi(id, data);
    setPrompts((prev) => prev.map((p) => (p._id === id ? res.prompt : p)));
    return res.prompt;
  };

  const deletePrompt = async (id: string): Promise<void> => {
    await deletePromptApi(id);
    setPrompts((prev) => prev.filter((p) => p._id !== id));
  };

  const duplicatePrompt = async (id: string): Promise<Prompt> => {
    const res = await duplicatePromptApi(id);
    await fetchPrompts();
    return res.prompt;
  };

  const toggleFavorite = async (id: string): Promise<void> => {
    // Optimistic update
    setPrompts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
    try {
      await toggleFavoriteApi(id);
    } catch {
      // Revert on failure
      setPrompts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isFavorite: !p.isFavorite } : p))
      );
      throw new Error('Failed to toggle favorite');
    }
  };

  return (
    <PromptContext.Provider
      value={{
        prompts,
        pagination,
        isLoading,
        filters,
        setFilters,
        fetchPrompts,
        createPrompt,
        updatePrompt,
        deletePrompt,
        duplicatePrompt,
        toggleFavorite,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
}

export function usePrompts() {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error('usePrompts must be used within a PromptProvider');
  }
  return context;
}
