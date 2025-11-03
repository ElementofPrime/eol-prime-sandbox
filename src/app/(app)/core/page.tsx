"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image"; // Add if using image

const FALLBACK_PROMPT =
	"What is one small action or step you could take today that is something you usually resist or don't like to do? Let's build from here.";

export default function CorePage() {
	const { data: session } = useSession();
	const fetcher = (url: string) => fetch(url).then((r) => r.json());
	const { status } = useSession();
	const { data, error, isLoading } = useSWR("/api/pulse", fetcher);

	if (status === "loading") {
		return <div>Checking authentication...</div>;
	}

	if (status !== "authenticated") {
		return <div>Sign in required for Daily Prompt and memory.</div>;
	}

	if (!data) {
		return <div>Loading prompt...</div>;
	}

	if (error) {
		return (
			<div>
				Failed to load prompt. Meanwhile, reflect on: {FALLBACK_PROMPT}
			</div>
		);
	}

	const prompt = data?.prompt ?? FALLBACK_PROMPT;

	return (
		<main className="min-h-svh px-4 pb-24 pt-28 text-slate-700 dark:text-slate-300">
			<section
				aria-labelledby="daily-prompt-heading"
				className="relative mx-auto max-w-5xl rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur p-8 shadow-[0_0_100px_rgba(56,189,248,0.15)] hover:shadow-[0_0_120px_rgba(56,189,248,0.20)] transition-shadow"
			>
				{/* Optional Tree Emblem */}
				<Image
					src="/assets/tree-emblem.png"
					alt="Tree of Life Emblem"
					width={150}
					height={150}
					className="absolute top-4 right-4 opacity-10 dark:opacity-20"
				/>
				<h1
					id="daily-prompt-heading"
					className="text-5xl font-bold text-sky-800 dark:text-sky-300"
				>
					Daily Prompt
				</h1>
				<p className="mt-4 text-lg">{prompt}</p>
				{/* Optional CTA */}
				<button className="mt-6 px-4 py-2 bg-sky-500 text-white rounded-lg">
					Respond in Journal
				</button>
			</section>
		</main>
	);
}
