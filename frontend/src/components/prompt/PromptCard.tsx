'use client';

import Link from 'next/link';
import { Heart, Globe, Lock, Copy, Trash2, Star, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatRelativeDate } from '@/lib/helpers';
import type { Prompt } from '@/types';

interface PromptCardProps {
  prompt: Prompt;
  onToggleFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function PromptCard({ prompt, onToggleFavorite, onDuplicate, onDelete }: PromptCardProps) {
  const ratingStars = prompt.rating
    ? Array.from({ length: 5 }, (_, i) => i < prompt.rating!)
    : [];

  return (
    <div className="group relative rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5">
      {/* Top row */}
      <div className="mb-3 flex items-start justify-between">
        <Link
          href={`/prompt/${prompt._id}`}
          className="flex-1 text-base font-semibold text-white transition-colors hover:text-indigo-300"
        >
          {prompt.title}
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleFavorite(prompt._id)}
            className="rounded p-1 text-slate-400 transition-colors hover:text-red-400"
          >
            <Heart
              className={`h-4 w-4 ${prompt.isFavorite ? 'fill-red-400 text-red-400' : ''}`}
            />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded p-1 text-slate-400 transition-colors hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-white/10 bg-slate-800 text-white" align="end">
              <DropdownMenuItem asChild>
                <Link href={`/prompt/${prompt._id}/edit`} className="cursor-pointer">
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(prompt._id)} className="cursor-pointer">
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(prompt._id)}
                className="cursor-pointer text-red-400 focus:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Description */}
      {prompt.description && (
        <p className="mb-3 line-clamp-2 text-sm text-slate-400">{prompt.description}</p>
      )}

      {/* Tags */}
      {prompt.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {prompt.tags.slice(0, 4).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="border-white/10 bg-white/5 text-xs text-slate-300"
            >
              {tag}
            </Badge>
          ))}
          {prompt.tags.length > 4 && (
            <Badge variant="secondary" className="border-white/10 bg-white/5 text-xs text-slate-500">
              +{prompt.tags.length - 4}
            </Badge>
          )}
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-white/10 text-xs capitalize text-indigo-300">
            {prompt.category}
          </Badge>
          {prompt.isPublic ? (
            <span className="flex items-center gap-1 text-green-400">
              <Globe className="h-3 w-3" /> Public
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3" /> Private
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {prompt.rating && (
            <span className="flex items-center gap-0.5 text-amber-400">
              <Star className="h-3 w-3 fill-amber-400" />
              {prompt.rating}
            </span>
          )}
          <span>v{prompt.version}</span>
          <span>{formatRelativeDate(prompt.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
