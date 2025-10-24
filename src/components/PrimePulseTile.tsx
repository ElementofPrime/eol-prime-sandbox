'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Insight = {
  _id?: string;
  mood: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  primePrompts?: string[];
};

export default function PrimePulseTile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [prompt, setPrompt] = useState<string>('Prime is here and listening... add a journal entry to kickstart insights.');

  async function refresh() {
    setLoading(true); setError(null);
    try {
      const r = await fetch('/api/pulse', { cache: 'no-store' });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setInsight(data.lastInsight ?? null);
      setPrompt(data.prompt ?? 'What matters most right now?');
    } catch (e:any) {
      setError('Please sign in to see Prime Pulse insights.');
    } finally {
      setLoading(false);
    }
  }

  async function analyzeLatest() {
    setLoading(true);
    try {
      const r = await fetch('/api/pulse', { method: 'POST' });
      if (r.ok) {
        await refresh();
      } else {
        setError('No journal entry found. Try adding one.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  // simple gauge 0..100 based on |sentiment|
  const level = Math.max(0, Math.min(100, (Math.abs(insight?.sentimentScore ?? 0) / 5) * 100));
  const moodLabel = insight?.mood ?? 'neutral';

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_80px_rgba(0,220,255,0.08)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs tracking-widest text-slate-400">PRIME PULSE</span>
        <span className="text-xs text-slate-400">live</span>
      </div>

      {loading ? (
        <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-400">
          Analyzing your latest reflections…
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-yellow-400/30 bg-yellow-500/10 p-5 text-yellow-200">
          {error} <Link href="/signin" className="ml-2 underline">Sign in</Link>
        </div>
      ) : (
        <>
          {/* reflection level */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Reflection Level</span>
              <span className="capitalize">{moodLabel}</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-500/70 transition-[width]"
                style={{ width: `${level}%` }}
              />
            </div>
          </div>

          {/* prompt */}
          <p className="mt-4 text-slate-200">{prompt}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={analyzeLatest}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
            >
              Analyze Latest
            </button>
            <Link
              href="/journal"
              className="rounded-xl border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/10"
            >
              Reflect now
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
