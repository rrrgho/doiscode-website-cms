'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
        'text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
      )}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          Dark Mode
        </>
      )}
    </button>
  );
}
