'use client';

import { useState } from 'react';
import { fetcher } from '@/lib/fetcher';
import useSWR, { mutate as mutateSWR } from 'swr';

type Entry = { _id: string; content: string; createdAt: string };
type List = { items: Entry[] };

export default function JournalPage() {
  const { data, isLoading, mutate } = useSWR<List>('/api/journal', fetcher, {
    refreshInterval: 0,        // manual; Pulse handles background refresh
    revalidateOnFocus: true,
  });

  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    setMsg(null);
    try {
      const r = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!r.ok) throw new Error('Save failed');

      setContent('');
      // Optimistic refresh of the list
      await mutate(); await mutateSWR('/prime/pulse');  // ⟵ immediately refresh Prime Pulse
    } catch (err: any) {
      setMsg(err.message || 'Error');
    } finally {
      setSaving(false);
      setMsg('Saved + analyzed ✅');
    }
  }

  const items = data?.items ?? [];

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <h1 className="eol-heading text-5xl font-bold">Journal</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <textarea
          className="w-full rounded-xl border border-slate-700/30 bg-slate-900/40 p-3"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something… bullets (- [ ] to-do), dates, $ amounts, tickers…"
        />
        <button
          disabled={saving || !content.trim()}
          className="rounded-xl px-4 py-2 bg-cyan-600 text-slate-500 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {msg && <div className="text-sm opacity-90">{msg}</div>}
      </form>

      <section className="space-y-3">
        {isLoading && <div className="opacity-70">Loading…</div>}
        {!isLoading && !items.length && <div className="opacity-70">No entries yet.</div>}
        {items.map((it) => (
          <article key={it._id} className="rounded-xl border border-slate-700/30 p-3">
            <div className="text-xs opacity-70">{new Date(it.createdAt).toLocaleString()}</div>
            <p className="whitespace-pre-wrap mt-1">{it.content}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
