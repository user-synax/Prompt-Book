'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, User } from 'lucide-react';
import { toast } from 'sonner';
import { fetchPublicPromptApi } from '@/lib/api/prompts';
import type { Prompt } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PublicPromptDetailPage() {
  const params = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPrompt() {
      setIsLoading(true);
      try {
        const data = await fetchPublicPromptApi(params.id);
        setPrompt(data.prompt);
      } catch {
        toast.error('Failed to load public prompt');
      } finally {
        setIsLoading(false);
      }
    }

    loadPrompt();
  }, [params.id]);

  if (isLoading) return <div className="p-8 text-slate-300">Loading...</div>;
  if (!prompt) return <div className="p-8 text-red-300">Prompt not found.</div>;

  const author = typeof prompt.userId === 'object' ? prompt.userId.name : 'Anonymous';

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl p-6 text-white lg:p-10">
      <Link href="/public-prompts">
        <Button variant="ghost" className="mb-5">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Public Prompts
        </Button>
      </Link>

      <h1 className="mb-2 text-3xl font-bold">{prompt.title}</h1>
      {prompt.description && <p className="mb-4 text-slate-300">{prompt.description}</p>}

      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="secondary" className="capitalize">{prompt.category}</Badge>
        <Badge variant="outline">v{prompt.version}</Badge>
        <span className="inline-flex items-center gap-1 text-slate-400">
          <User className="h-4 w-4" />
          {author}
        </span>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <pre className="whitespace-pre-wrap font-sans text-slate-100">{prompt.content}</pre>
      </div>
    </div>
  );
}
