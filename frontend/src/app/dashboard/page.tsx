'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePrompts } from '@/contexts/PromptContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import SearchBar from '@/components/common/SearchBar';
import PromptFilters from '@/components/prompt/PromptFilters';
import PromptGrid from '@/components/prompt/PromptGrid';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const {
    prompts, isLoading, filters, setFilters,
    fetchPrompts, duplicatePrompt, deletePrompt, toggleFavorite,
  } = usePrompts();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [category, setCategory] = useState('all');
  const [visibility, setVisibility] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const newFilters: Record<string, unknown> = { sort, search: search || undefined };

      if (category !== 'all') newFilters.category = category;
      if (visibility === 'public') newFilters.isPublic = true;
      if (visibility === 'private') newFilters.isPublic = false;

      // Handle sidebar filter
      if (activeFilter === 'favorites') newFilters.isFavorite = true;
      if (activeFilter.startsWith('category:')) {
        newFilters.category = activeFilter.split(':')[1];
      }

      setFilters(newFilters);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, sort, category, visibility, activeFilter, setFilters]);

  // Fetch when filters change
  useEffect(() => {
    fetchPrompts(filters);
  }, [filters, fetchPrompts]);

  const handleSidebarFilter = useCallback((filter: string) => {
    setActiveFilter(filter);
    // Reset other filters when sidebar filter changes
    if (filter === 'all') {
      setCategory('all');
      setVisibility('all');
    } else if (filter === 'favorites') {
      setCategory('all');
      setVisibility('all');
    } else if (filter === 'public') {
      setCategory('all');
      setVisibility('public');
    } else if (filter.startsWith('category:')) {
      setCategory(filter.split(':')[1]);
      setVisibility('all');
    }
  }, []);

  const handleDuplicate = async (id: string) => {
    try {
      await duplicatePrompt(id);
      toast.success('Prompt duplicated');
    } catch {
      toast.error('Failed to duplicate prompt');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePrompt(deleteId);
      toast.success('Prompt deleted');
    } catch {
      toast.error('Failed to delete prompt');
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id);
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeFilter={activeFilter}
        onFilterChange={handleSidebarFilter}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onCreateClick={() => router.push('/prompt')}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Search & Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-sm">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <PromptFilters
              sort={sort}
              onSortChange={setSort}
              category={category}
              onCategoryChange={setCategory}
              visibility={visibility}
              onVisibilityChange={setVisibility}
            />
          </div>

          {/* Prompt Grid */}
          <PromptGrid
            prompts={prompts}
            isLoading={isLoading}
            onToggleFavorite={handleToggleFavorite}
            onDuplicate={handleDuplicate}
            onDelete={(id) => setDeleteId(id)}
          />
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="border-white/10 bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this prompt? This action cannot be undone.
              All version history will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="text-slate-300">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
