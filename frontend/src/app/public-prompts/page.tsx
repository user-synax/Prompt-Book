'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, User } from 'lucide-react';
import { toast } from 'sonner';
import { fetchPublicPromptsApi, type PromptFilters } from '@/lib/api/prompts';
import type { Prompt } from '@/types';
import { CATEGORIES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatRelativeDate } from '@/lib/helpers';

export default function PublicPromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const filters: PromptFilters = {
          search: search || undefined,
          category: category !== 'all' ? category : undefined,
          sort,
        };
        const data = await fetchPublicPromptsApi(filters);
        setPrompts(data.prompts);
      } catch {
        toast.error('Failed to load public prompts');
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, sort]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl p-6 text-white lg:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Globe className="h-7 w-7 text-indigo-400" />
            Public Prompt Library
          </h1>
          <p className="mt-1 text-sm text-slate-400">Explore prompts shared publicly by the community.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search public prompts..."
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 rounded-md border border-white/10 bg-transparent px-3 text-sm"
        >
          <option value="all" className="bg-slate-900">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-slate-900 capitalize">{cat}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-9 rounded-md border border-white/10 bg-transparent px-3 text-sm"
        >
          <option value="newest" className="bg-slate-900">Newest</option>
          <option value="oldest" className="bg-slate-900">Oldest</option>
          <option value="title" className="bg-slate-900">Title</option>
          <option value="rating" className="bg-slate-900">Rating</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-slate-400">Loading public prompts...</p>
      ) : prompts.length === 0 ? (
        <p className="text-slate-400">No public prompts found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => {
            const author = typeof prompt.userId === 'object' ? prompt.userId.name : 'Anonymous';
            return (
              <Link
                key={prompt._id}
                href={`/public-prompts/${prompt._id}`}
                className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-indigo-500/40"
              >
                <h2 className="line-clamp-1 text-lg font-semibold text-white">{prompt.title}</h2>
                {prompt.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">{prompt.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="capitalize">{prompt.category}</Badge>
                  <Badge variant="outline">v{prompt.version}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {author}</span>
                  <span>{formatRelativeDate(prompt.updatedAt)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
