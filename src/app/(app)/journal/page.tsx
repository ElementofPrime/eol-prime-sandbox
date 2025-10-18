'use client';

import { useEffect, useState } from 'react';

type Entry = { _id: string; content: string; createdAt: string };

export default function JournalPage() {
  const [content, setContent] = useState('');
  const [items, setItems] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const res = await fetch('/api/journal', { cache: 'no-store' });
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => { load(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const r = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!r.ok) throw new Error('Save failed');
      setContent('');
      await load();
      setMsg('Saved + analyzed ✅');
    } catch (err: any) {
      setMsg(err.message || 'Error');
    } finally { setLoading(false); }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Journal</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <textarea
          className="w-full rounded-xl border border-slate-700/30 bg-slate-900/40 p-3"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something… bullets (- [ ] task), dates, $ amounts, tickers…"
        />
        <button
          disabled={loading || !content.trim()}
          className="rounded-xl px-4 py-2 bg-cyan-600 text-white disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
        {msg && <div className="text-sm opacity-80">{msg}</div>}
      </form>

      <section className="space-y-3">
        {items.map((it) => (
          <article key={it._id} className="rounded-xl border border-slate-700/30 p-3">
            <div className="text-xs opacity-70">{new Date(it.createdAt).toLocaleString()}</div>
            <p className="whitespace-pre-wrap mt-1">{it.content}</p>
          </article>
        ))}
        {!items.length && <div className="opacity-70">No entries yet.</div>}
      </section>
    </main>
  );
}
