'use client';

import useSWR from 'swr';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Pulse = { mood: 'positive'|'neutral'|'negative'; prompt: string };

const getPulse = async (): Promise<Pulse | null> => {
  const r = await fetch('/api/pulse', { cache: 'no-store' });
  const j = await r.json();
  if (!j?.ok) return null;
  return { mood: j.mood, prompt: j.prompt };
};

const moodGlow: Record<string, string> = {
  positive: 'ring-emerald-400/40 shadow-[0_0_55px_10px_rgba(16,185,129,.20)]',
  negative: 'ring-rose-400/40 shadow-[0_0_55px_10px_rgba(244,63,94,.18)]',
  neutral:  'ring-sky-300/30 shadow-[0_0_45px_8px_rgba(125,211,252,.14)]',
};

export default function PrimePulseTile() {
  const { data: pulse, isLoading, mutate, isValidating } = useSWR('/prime/pulse', getPulse, {
    fetcher: undefined,
    revalidateOnFocus: true,
    refreshInterval: 10000,
  });

  async function analyzeLatest() {
    await fetch('/api/pulse', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    await mutate();
  }

  async function QuickToDo() {
    const title = prompt('Add To-Do:');
    if (!title?.trim()) return;
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ title })
    });
    alert('To-Do created 👍');
  }

  async function quickReminder() {
    const text = prompt('Reminder note:');
    if (!text?.trim()) return;
    await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ text })
    });
    alert('Reminder set ⏰');
  }

  const glow = moodGlow[pulse?.mood || 'neutral'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`rounded-2xl p-4 sm:p-5 ring-1 ${glow} bg-slate-900/45 backdrop-blur`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-wide opacity-70">Prime Pulse</div>
        <div className="text-[10px] opacity-60">{isValidating ? 'refreshing…' : 'live'}</div>
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-5 w-64 rounded bg-white/10" />
        </div>
      )}

      {!isLoading && !pulse && (
        <div className="opacity-85">
          Prime is listening… add a <Link href="/journal" className="underline">journal entry</Link> to kickstart insights.
        </div>
      )}

      {!isLoading && pulse && (
        <>
          <div className="text-lg font-semibold mb-1">
            Mood: <span className="capitalize">{pulse.mood}</span>
          </div>
          <div className="text-sm opacity-90">{pulse.prompt}</div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={QuickToDo}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
              + Add To-Do
            </button>
            <button onClick={quickReminder}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
              + Create Reminder
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button onClick={analyzeLatest}
              className="rounded-lg bg-cyan-600/90 hover:bg-cyan-500 px-3 py-1 text-xs">
              Analyze Latest
            </button>
            <Link href="/journal" className="text-xs underline opacity-80 hover:opacity-100">
              Open Journal →
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
}
