'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Pencil } from 'lucide-react';
import { fetchPromptApi } from '@/lib/api/prompts';
import type { Prompt } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PromptDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPrompt() {
      setIsLoading(true);
      try {
        const data = await fetchPromptApi(params.id);
        setPrompt(data.prompt);
      } catch {
        toast.error('Failed to load prompt');
      } finally {
        setIsLoading(false);
      }
    }

    loadPrompt();
  }, [params.id]);

  if (isLoading) {
    return <div className="p-8 text-slate-300">Loading prompt...</div>;
  }

  if (!prompt) {
    return <div className="p-8 text-red-300">Prompt not found.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => router.push(`/prompt/${prompt._id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-white">{prompt.title}</h1>
      {prompt.description && <p className="mb-6 text-slate-300">{prompt.description}</p>}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="capitalize">{prompt.category}</Badge>
        <Badge variant="secondary">v{prompt.version}</Badge>
        <Badge variant="secondary">{prompt.isPublic ? 'Public' : 'Private'}</Badge>
        {prompt.tags.map((tag) => (
          <Badge key={tag} variant="secondary">#{tag}</Badge>
        ))}
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Prompt Content</h2>
        <pre className="whitespace-pre-wrap font-sans text-slate-100">{prompt.content}</pre>
      </div>
    </div>
  );
}
