'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = (mounted ? resolvedTheme : theme) === 'dark';
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="rounded-full border border-white/10 bg-white/10 dark:bg-black/10 px-3 py-1.5 text-sm text-slate-500 hover:bg-white/20 dark:hover:bg-black/20"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
