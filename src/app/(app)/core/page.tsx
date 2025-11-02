"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";

const FALLBACK_PROMPT =
	"What is one small action or step you could take today that is something you usually resist or don't like to do?";

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
		return <div>Failed to load prompt.</div>;
	}

	const prompt = data?.prompt ?? FALLBACK_PROMPT;

	return (
		<main className="min-h-svh px-4 pb-24 pt-28 text-slate-700 dark:text-slate-300">
			<section className="mx-auto max-w-5xl rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/60 backdrop-blur p-8 shadow-[0_0_80px_rgba(56,189,248,0.10)]">
				<h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100">
					Daily Prompt
				</h1>
				<p className="mt-4 text-lg">{prompt}</p>
			</section>
		</main>
	);
}
