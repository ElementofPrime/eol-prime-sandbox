// src/components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		console.log("Theme:", resolvedTheme); // ← DEBUG
	}, [resolvedTheme]);

	if (!mounted) return null;

	const isDark = resolvedTheme === "dark";

	return (
		<button
			onClick={() => {
				setTheme(isDark ? "light" : "dark");
				console.log("Toggled to:", isDark ? "light" : "dark"); // ← DEBUG
			}}
			className={cn(
				"rounded-full border px-3 py-1.5 text-sm transition-all",
				"border-white/10 bg-white/10 text-slate-500 hover:bg-white/20",
				"dark:border-black/20 dark:bg-black/10 dark:hover:bg-black/20"
			)}
			aria-label="Toggle dark mode"
		>
			{isDark ? "🌙" : "☀️"}
		</button>
	);
}
