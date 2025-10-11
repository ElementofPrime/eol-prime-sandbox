'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Initialize from localStorage or prefers-color-scheme
 useEffect(() => {
   const saved = localStorage.getItem('eol-theme');
   const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
   const dark = saved ? saved === 'dark' : prefersDark;
   setIsDark(dark);
   document.documentElement.classList.toggle('dark', dark);
 }, []); // <— add this empty array

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('eol-theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="border border-cyan-400 text-cyan-400 px-3 py-1 rounded-md hover:bg-cyan-400 hover:text-black transition"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
