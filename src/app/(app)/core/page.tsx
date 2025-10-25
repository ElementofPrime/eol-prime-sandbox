'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function CorePage() {
  return (
    <main className="min-h-[calc(100vh-6rem)] px-4 pb-24 pt-28 text-slate-500">
      <section className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_80px_rgba(0,220,255,0.06)]">
        <h1 className="eol-heading text-5xl font-bold">Core Values</h1>
        <p className="eol-muted">Truth • Growth • Discipline • Purpose • Direction</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="eol-panel p-4">
            <h3 className="text-xl font-semibold">🔥 Truth</h3>
            <p className="mt-2 text-slate-500">
              Prime guides with clarity and honesty—no overwhelm, no fluff.
            </p>
          </article>
          <article className="eol-panel p-4">
            <h3 className="text-xl font-semibold">🌱 Growth</h3>
            <p className="mt-2 text-slate-300">
              Ever-learning, ever-adapting. Each new day is a step forward.
            </p>
          </article>
          <article className="eol-panel p-4">
            <h3 className="text-xl font-semibold">🛠 Discipline</h3>
            <p className="mt-2 text-slate-300">
              Focus becomes structure; structure becomes transformation.
            </p>
          </article>
          <article className="eol-panel p-4">
            <h3 className="text-xl font-semibold">🌟 Purpose</h3>
            <p className="mt-2 text-slate-300">
              Build toward truth and light—identity first, then Elements, then creation.
            </p>
          </article>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/journal" className="rounded-full border border-cyan-400/40 px-5 py-2 text-cyan-300 hover:bg-cyan-400/10">
            Start a journal entry
          </Link>
          <Link href="/to-do" className="rounded-full border border-cyan-400/40 px-5 py-2 text-cyan-300 hover:bg-cyan-400/10">
            Add a to-do
          </Link>
        </div>
      </section>
    </main>
  );
}
