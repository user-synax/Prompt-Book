'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText, Heart, Globe, Tag, LogOut, Sparkles, X, Menu,
  Code, PenTool, Palette, Megaphone, GraduationCap, Database, MoreHorizontal, Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, React.ReactNode> = {
  general: <Layers className="h-4 w-4" />,
  coding: <Code className="h-4 w-4" />,
  writing: <PenTool className="h-4 w-4" />,
  design: <Palette className="h-4 w-4" />,
  marketing: <Megaphone className="h-4 w-4" />,
  education: <GraduationCap className="h-4 w-4" />,
  data: <Database className="h-4 w-4" />,
  other: <MoreHorizontal className="h-4 w-4" />,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function Sidebar({ isOpen, onClose, activeFilter, onFilterChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleFilterClick = (filter: string) => {
    onFilterChange(filter);
    onClose();
  };

  const navItems = [
    { id: 'all', label: 'All Prompts', icon: <FileText className="h-4 w-4" /> },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="h-4 w-4" /> },
    { id: 'public', label: 'Public Prompts', icon: <Globe className="h-4 w-4" /> },
  ];

  const categories = ['general', 'coding', 'writing', 'design', 'marketing', 'education', 'data', 'other'];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-white/10 bg-slate-900/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-400" />
            <span className="text-lg font-bold text-white">Prompt Studio</span>
          </Link>
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Separator className="bg-white/10" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleFilterClick(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  activeFilter === item.id
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <Separator className="my-4 bg-white/10" />

          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Categories
          </div>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterClick(`category:${cat}`)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm capitalize transition-colors',
                  activeFilter === `category:${cat}`
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
              >
                {categoryIcons[cat]}
                {cat}
              </button>
            ))}
          </div>
        </nav>

        <Separator className="bg-white/10" />

        {/* User info */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="text-slate-400 hover:text-red-400">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
