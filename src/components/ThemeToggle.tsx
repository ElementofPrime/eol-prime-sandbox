// src/components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  const toggle = () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-full p-2 transition-all duration-200
                 bg-white/10 dark:bg-black/20
                 hover:bg-cyan-600/20 dark:hover:bg-cyan-600/30
                 border border-white/10 dark:border-black/20
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
    >
      {/* CSS controls visibility so SSR/CSR markup matches */}
      <Sun className="w-5 h-5 text-yellow-400 hidden dark:inline" />
      <Moon className="w-5 h-5 text-slate-700  inline dark:hidden" />
    </button>
  );
}
