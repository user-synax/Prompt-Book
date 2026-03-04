'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usePrompts } from '@/contexts/PromptContext';
import { CATEGORIES, type Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function NewPromptPage() {
  const router = useRouter();
  const { createPrompt } = usePrompts();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('general');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const prompt = await createPrompt({
        title,
        description,
        content,
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        isPublic,
      });

      toast.success('Prompt created');
      router.push(`/prompt/${prompt._id}`);
    } catch {
      toast.error('Failed to create prompt');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl p-6 text-white lg:p-10">
      <h1 className="mb-6 text-3xl font-bold">Create New Prompt</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Prompt Content</Label>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-40" required />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Make this prompt public
        </label>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push('/dashboard')}>Cancel</Button>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Prompt'}
          </Button>
        </div>
      </form>
    </div>
  );
}
