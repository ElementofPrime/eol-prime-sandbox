'use client';

import Link from 'next/link';

export default function CorePage() {
  return (
    <main className="min-h-[calc(100svh-6rem)] px-4 pb-24 pt-28 text-slate-700 dark:text-slate-300">
      <section className="mx-auto max-w-5xl rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/10 backdrop-blur p-8 shadow-[0_0_80px_rgba(56,189,248,0.10)]">
        <h1 className="eol-heading text-5xl font-bold text-slate-900 dark:text-slate-100">
          Core Values
        </h1>
        <p className="eol-muted mt-2 text-slate-600 dark:text-slate-400">
          Truth • Growth • Discipline • Purpose • Direction
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="eol-panel rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 p-4 backdrop-blur">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">🔥 Truth</h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Prime guides with clarity and honesty—no overwhelm, no fluff.
            </p>
          </article>

          <article className="eol-panel rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 p-4 backdrop-blur">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">🌱 Growth</h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Ever-learning, ever-adapting. Each new day is a step forward.
            </p>
          </article>

          <article className="eol-panel rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 p-4 backdrop-blur">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">🛠️ Discipline</h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Focus becomes structure; structure becomes transformation.
            </p>
          </article>

          <article className="eol-panel rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 p-4 backdrop-blur">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">🌟 Purpose</h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Build toward truth and light—identity first, then Elements, then creation.
            </p>
          </article>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/journal"
            className="rounded-full border border-cyan-500/30 px-5 py-2 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-600/15 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
          >
            Start a journal entry
          </Link>
          <Link
            href="/todo"
            className="rounded-full border border-cyan-500/30 px-5 py-2 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-600/15 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
          >
            Add a to-do
          </Link>
        </div>
      </section>
    </main>
  );
}
