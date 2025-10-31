'use client';

import { useSession } from 'next-auth/react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CorePage() {
  const { status } = useSession();
  if (status !== 'authenticated') return <div>Sign in required for Daily Prompt.</div>;

  const { data } = useSWR('/api/pulse', fetcher);
  const prompt = data?.prompt ?? 'What is one small step forward today?';

  return (
    <main className="min-h-svh px-4 pb-24 pt-28 text-slate-700 dark:text-slate-300">
      <section className="mx-auto max-w-5xl rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/60 backdrop-blur p-8 shadow-[0_0_80px_rgba(56,189,248,0.10)]">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100">Daily Prompt</h1>
        <p className="mt-4 text-lg">{prompt}</p>
      </section>
    </main>
  );
}
