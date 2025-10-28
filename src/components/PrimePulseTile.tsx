'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import useSWR from 'swr';

type Insight = {
  _id?: string;
  mood: 'positive' | 'negative' | 'neutral';
  // expected range [-1, 1], but we’ll clamp defensively
  sentimentScore: number;
  primePrompts?: string[];
};

type PulseResponse = {
  lastInsight?: Insight | null;
  prompt?: string;
};

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then((r) => {
  if (!r.ok) throw new Error('Failed to load insights');
  return r.json();
}) as Promise<PulseResponse>;

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function moodClasses(mood: Insight['mood']) {
  switch (mood) {
    case 'positive':
      return {
        dot: 'bg-emerald-500',
        chip: 'text-emerald-700 dark:text-emerald-300',
        bar: 'from-emerald-400 via-teal-400 to-cyan-500 dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-400',
      };
    case 'negative':
      return {
        dot: 'bg-rose-500',
        chip: 'text-rose-600 dark:text-rose-300',
        bar: 'from-rose-500 via-orange-400 to-amber-400 dark:from-rose-400 dark:via-orange-300 dark:to-amber-300',
      };
    default:
      return {
        dot: 'bg-slate-400 dark:bg-slate-300',
        chip: 'text-slate-700 dark:text-slate-300',
        bar: 'from-slate-400 via-sky-400 to-cyan-500 dark:from-slate-300 dark:via-sky-300 dark:to-cyan-400',
      };
  }
}

export default function PrimePulseTile() {
  const { status } = useSession();
  const [posting, setPosting] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    status === 'authenticated' ? '/api/pulse' : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  if (status !== 'authenticated') {
    return (
      <div className="mx-auto mt-6 max-w-4xl rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/10 backdrop-blur p-5 shadow-[0_0_80px_rgba(56,189,248,0.12)]">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs tracking-widest text-slate-500 dark:text-slate-400">PRIME PULSE</span>
          <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
            offline
          </span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-400">
          Please sign in to see Prime Pulse insights.
        </p>
        <button
          onClick={() => signIn()}
          className="mt-4 rounded-xl px-4 py-2 text-sm font-medium bg-cyan-700 text-white hover:bg-cyan-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
        >
          Sign in
        </button>
      </div>
    );
  }

  const insight = data?.lastInsight ?? null;
  const mood: Insight['mood'] = insight?.mood ?? 'neutral';
  const colors = moodClasses(mood);

  // Map sentimentScore → 0..100 “signal strength”.
  // If score is [-1..1], (score+1)/2 ∈ [0..1]. If backend ever returns [-5..5], this clamps gracefully.
  const norm = clamp01(((insight?.sentimentScore ?? 0) + 1) / 2);
  const levelPct = Math.round(norm * 100);

  const prompt =
    data?.prompt ??
    'Prime is here and listening… add a journal entry to kickstart insights.';

  async function analyzeLatest() {
    try {
      setPosting(true);
      const r = await fetch('/api/pulse', { method: 'POST' });
      if (!r.ok) throw new Error('No recent journal entry to analyze.');
      await mutate(); // re-fetch GET /api/pulse
    } catch (e) {
      // Let SWR error state + UI message handle it
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/10 backdrop-blur p-5 shadow-[0_0_80px_rgba(56,189,248,0.12)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs tracking-widest text-slate-500 dark:text-slate-400">PRIME PULSE</span>
        <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className={`absolute inline-flex h-full w-full rounded-full ${colors.dot} opacity-75 animate-ping`} />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${colors.dot}`} />
          </span>
          live
        </span>
      </div>

      {(isLoading || posting) && (
        <div
          className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 animate-pulse"
          role="status"
          aria-live="polite"
        >
          <div className="h-3 w-24 bg-black/10 dark:bg-white/10 rounded mb-3" />
          <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded" />
          <div className="mt-4 h-3 w-2/3 bg-black/10 dark:bg-white/10 rounded" />
        </div>
      )}

      {!isLoading && !posting && error && (
        <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-300">
          {String(error.message || 'Unable to load insights.')}
        </div>
      )}

      {!isLoading && !posting && !error && (
        <>
          {/* Signal / mood */}
          <div className="mb-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-400">Signal strength</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${colors.chip}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                <span className="capitalize">{mood}</span>
              </span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={levelPct}
              aria-valuetext={`${mood} • ${levelPct}%`}
            >
              <div
                className={`h-full w-0 bg-linear-to-r ${colors.bar} transition-[width] duration-500`}
                style={{ width: `${levelPct}%` }}
              />
            </div>
          </div>

          {/* Prompt */}
          <p className="mt-4 text-slate-700 dark:text-slate-400">
            {insight?.primePrompts?.[0] ?? prompt}
          </p>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={analyzeLatest}
              disabled={posting}
              className="rounded-xl px[16] px-4 py-2 text-sm font-medium bg-cyan-700 text-white hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            >
              {posting ? 'Analyzing…' : 'Analyze Latest'}
            </button>
            <Link
              href="/journal"
              className="rounded-xl border border-cyan-500/30 px-4 py-2 text-sm text-cyan-700 dark:text-cyan-300 hover:bg-cyan-600/15 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            >
              Reflect now
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
