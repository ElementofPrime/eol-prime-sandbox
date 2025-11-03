"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion"; // Add framer-motion for subtle pulse
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function PrimePulseTile() {
	const { data: session, status } = useSession();
	const { data, error, isLoading } = useSWR(
		status === "authenticated" ? "/api/journal" : null,
		fetcher
	);

	const count = data?.length ?? 0;
	const hasEntries = count > 0;

	// Subtle pulse animation (only when entries exist)
	const pulseVariants = {
		idle: { scale: 1 },
		pulse: {
			scale: [1, 1.05, 1],
			transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
		},
	};

	if (status === "loading") {
		return (
			<div className="eol-panel p-4 animate-pulse">
				<div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
				<div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mt-2 w-12"></div>
			</div>
		);
	}

	if (status !== "authenticated") {
		return (
			<div className="eol-panel p-4 text-center">
				<div className="text-sm opacity-70">Prime Pulse</div>
				<div className="text-3xl font-semibold mt-1">—</div>
				<Link
					href="/signin"
					className="text-xs text-sky-600 dark:text-sky-400 underline mt-1 block"
				>
					Sign in to see your pulse
				</Link>
			</div>
		);
	}

	return (
		<Link href="/journal" className="block group">
			<motion.div
				className={`
          eol-panel p-4 rounded-2xl 
          bg-white/70 dark:bg-black/70 
          backdrop-blur-sm 
          border border-black/5 dark:border-white/5
          shadow-[0_0_60px_rgba(56,189,248,0.08)] 
          group-hover:shadow-[0_0_90px_rgba(56,189,248,0.18)]
          transition-all duration-300
          relative overflow-hidden
        `}
				animate={hasEntries ? "pulse" : "idle"}
				variants={pulseVariants}
			>
				{/* Subtle glowing ring behind count */}
				{hasEntries && (
					<div className="absolute inset-0 -z-10">
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-sky-400/20 rounded-full blur-3xl animate-pulse"></div>
					</div>
				)}

				<div className="text-sm font-medium opacity-75 text-slate-600 dark:text-slate-400">
					Prime Pulse
				</div>

				<motion.div
					key={count}
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", stiffness: 300, damping: 20 }}
					className="text-4xl font-bold mt-1 bg-linear-to-br from-sky-600 to-sky-800 dark:from-sky-400 dark:to-sky-600 bg-clip-text text-transparent"
				>
					{count}
				</motion.div>

				<div className="text-xs opacity-70 text-slate-500 dark:text-slate-500 mt-0.5">
					{count === 1 ? "entry" : "entries"} processed
				</div>

				{/* Encouragement based on momentum */}
				{count > 0 && (
					<div className="mt-3 text-xs font-medium text-sky-600 dark:text-sky-400">
						{count >= 7
							? "Strong roots growing!"
							: "Every entry strengthens your Tree."}
					</div>
				)}

				{/* Optional: Streak indicator later */}
			</motion.div>
		</Link>
	);
}
