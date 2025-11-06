// src/components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-2 rounded-full bg-white/10" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "rounded-full p-2 transition-all duration-200",
        "bg-white/10 dark:bg-black/20",
        "hover:bg-cyan-600/20 dark:hover:bg-cyan-600/30",
        "border border-white/10 dark:border-black/20",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
      )}
      aria-label="Toggle dark mode"
      suppressHydrationWarning // ← FIX: Suppress warning
    >
      {isDark ? (
        <Moon className="w-5 h-5 text-cyan-300" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  );
}
