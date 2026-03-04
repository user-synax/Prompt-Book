'use client';

import { Menu, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
  onCreateClick: () => void;
}

export default function Header({ onMenuClick, onCreateClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/50 px-4 py-3 backdrop-blur-sm lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-slate-400 hover:text-white lg:hidden">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-white">Dashboard</h1>
      </div>
      <Button onClick={onCreateClick} className="bg-indigo-600 hover:bg-indigo-700">
        <Plus className="mr-2 h-4 w-4" />
        New Prompt
      </Button>
    </header>
  );
}
