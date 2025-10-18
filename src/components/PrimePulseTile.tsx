'use client';

import { useEffect, useState } from 'react';
import { getPrimePulse, type Pulse } from '@/lib/prime/pulse';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrimePulseTile() {
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrimePulse().then((p) => {
      setPulse(p);
      setLoading(false);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl p-4 sm:p-5 shadow ring-1 ring-black/5 dark:ring-white/5
                 bg-slate-900/45 dark:bg-slate-900/40 backdrop-blur text-left"
    >
      <div className="text-xs uppercase tracking-wide opacity-70 mb-2">Prime Pulse</div>

      {loading && (
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-5 w-64 rounded bg-white/10" />
        </div>
      )}

      {!loading && !pulse && (
        <div className="opacity-80">
          Prime is listening… add a <Link href="/journal" className="underline">journal entry</Link> to kickstart insights.
        </div>
      )}

      {!loading && pulse && (
        <>
          <div className="text-lg font-semibold mb-1">
            Mood: <span className="capitalize">{pulse.mood}</span>
          </div>
          <div className="text-sm opacity-90">{pulse.prompt}</div>
          <div className="mt-3">
            <Link
              href="/journal"
              className="text-xs underline opacity-80 hover:opacity-100"
            >
              Open Journal →
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
}
