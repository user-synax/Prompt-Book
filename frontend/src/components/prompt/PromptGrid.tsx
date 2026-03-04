'use client';

import PromptCard from './PromptCard';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';
import type { Prompt } from '@/types';

interface PromptGridProps {
  prompts: Prompt[];
  isLoading: boolean;
  onToggleFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
          <Skeleton className="mb-3 h-5 w-3/4 bg-white/10" />
          <Skeleton className="mb-2 h-4 w-full bg-white/10" />
          <Skeleton className="mb-4 h-4 w-2/3 bg-white/10" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
            <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FileText className="mb-4 h-12 w-12 text-slate-600" />
      <h3 className="mb-2 text-lg font-medium text-slate-300">No prompts yet</h3>
      <p className="text-sm text-slate-500">
        Create your first prompt to get started
      </p>
    </div>
  );
}

export default function PromptGrid({ prompts, isLoading, onToggleFavorite, onDuplicate, onDelete }: PromptGridProps) {
  if (isLoading) return <LoadingSkeleton />;
  if (prompts.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt._id}
          prompt={prompt}
          onToggleFavorite={onToggleFavorite}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
