'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Pulse = { mood: 'positive'|'neutral'|'negative'; prompt: string };

async function getPulse(): Promise<Pulse | null> {
  // load latest entry
  const list = await fetch('/api/journal', { cache: 'no-store' }).then(r => r.json());
  const latest = list?.items?.[0];
  if (!latest?._id) return null;

  // get its insight
  const { insight } = await fetch(`/api/journal/${latest._id}/insights`, { cache: 'no-store' }).then(r => r.json());
  if (!insight) return null;

  return {
    mood: insight.mood ?? 'neutral',
    prompt: insight.primePrompts?.[0] || 'What matters most right now?',
  };
}

export default function PrimePulseTile() {
  const { data: pulse, isLoading } = useSWR('/prime/pulse', getPulse, {
    fetcher: undefined,             // using our custom getter above
    revalidateOnFocus: true,
    refreshInterval: 10_000,        // 🔁 auto-refresh every 10s
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl p-4 sm:p-5 shadow ring-1 ring-black/5 dark:ring-white/5
                 bg-slate-900/45 dark:bg-slate-900/40 backdrop-blur text-left"
    >
      <div className="text-xs uppercase tracking-wide opacity-70 mb-2">Prime Pulse</div>

      {isLoading && (
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-5 w-64 rounded bg-white/10" />
        </div>
      )}

      {!isLoading && !pulse && (
        <div className="opacity-80">
          Prime is listening… add a <Link href="/journal" className="underline">journal entry</Link> to kickstart insights.
        </div>
      )}

      {!isLoading && pulse && (
        <>
          <div className="text-lg font-semibold mb-1">
            Mood: <span className="capitalize">{pulse.mood}</span>
          </div>
          <div className="text-sm opacity-90">{pulse.prompt}</div>
          <div className="mt-3">
            <Link href="/journal" className="text-xs underline opacity-80 hover:opacity-100">
              Open Journal →
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
}
