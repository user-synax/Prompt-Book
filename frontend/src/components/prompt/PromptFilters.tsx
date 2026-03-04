'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES } from '@/types';

interface PromptFiltersProps {
  sort: string;
  onSortChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  visibility: string;
  onVisibilityChange: (value: string) => void;
}

export default function PromptFilters({
  sort, onSortChange,
  category, onCategoryChange,
  visibility, onVisibilityChange,
}: PromptFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[140px] border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-slate-800 text-white">
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
          <SelectItem value="updated">Updated</SelectItem>
        </SelectContent>
      </Select>

      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[140px] border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-slate-800 text-white">
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat} className="capitalize">
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={visibility} onValueChange={onVisibilityChange}>
        <SelectTrigger className="w-[140px] border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Visibility" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-slate-800 text-white">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="private">Private</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
