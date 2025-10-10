'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function NavBar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <header className="w-full px-6 py-3" />;

  const isDark = resolvedTheme === 'dark';

  return (
    <header className="relative header-beam w-full flex justify-between items-center px-6 md:px-8 py-3 md:py-4">
      <h1 className="text-lg md:text-xl font-semibold text-cyan-500">
        Element of Life — <span className="text-inherit">Prime OS</span>
      </h1>

      <nav className="flex items-center gap-4 md:gap-6 text-sm md:text-base">
        <Link href="/core" className="hover:text-cyan-400 transition">Core</Link>
        <Link href="/about" className="hover:text-cyan-400 transition">About</Link>
        <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="border border-cyan-400 text-cyan-400 px-3 py-1 rounded-md hover:bg-cyan-400 hover:text-black transition"
          aria-label="Toggle theme"
        >
          {isDark ? '🌙' : '☀️'}
        </button>
      </nav>
    </header>
  );
}
