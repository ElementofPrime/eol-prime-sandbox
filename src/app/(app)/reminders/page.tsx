'use client';

import { useEffect, useState } from 'react';

type Reminder = { _id?: string; text: string; dueAt?: string };

export default function RemindersPage() {
  const [items, setItems] = useState<Reminder[]>([]);
  const [text, setText] = useState('');
  const [dueAt, setDueAt] = useState('');

  async function refresh() {
    try {
      const r = await fetch('/api/todos?kind=reminder', { cache: 'no-store' });
      const data = await r.json();
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setItems([]);
    }
  }

  async function add() {
    const body = { text: text.trim(), dueAt: dueAt || undefined, kind: 'reminder' };
    if (!body.text) return;
    setText('');
    setDueAt('');
    await fetch('/api/todos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    refresh();
  }

  async function remove(id?: string) {
    if (!id) return;
    await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
    refresh();
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main className="min-h-[calc(100vh-6rem)] px-4 pb-24 pt-28 text-slate-100">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-semibold">Reminders</h1>
        <p className="mt-2 text-slate-300">Lightweight, simple, and ready for notifications in the next step.</p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Reminder text…"
              className="rounded-xl bg-black/30 px-4 py-3 outline-none"
            />
            <input
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              type="datetime-local"
              className="rounded-xl bg-black/30 px-4 py-3 outline-none"
            />
            <button onClick={add} className="rounded-xl bg-cyan-600 px-5 py-3 font-medium hover:bg-cyan-500">
              Add
            </button>
          </div>
        </div>

        <ul className="mt-6 space-y-3">
          {items.length === 0 && <li className="text-slate-400">No reminders yet.</li>}
          {items.map((it) => (
            <li key={it._id ?? it.text} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="font-medium">{it.text}</p>
                {it.dueAt && <p className="text-sm text-slate-400">Due {new Date(it.dueAt).toLocaleString()}</p>}
              </div>
              <button onClick={() => remove(it._id)} className="rounded-lg border border-red-400/40 px-3 py-2 text-red-300 hover:bg-red-500/10">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
