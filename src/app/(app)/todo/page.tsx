'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';

const fetcher = (u: string) => fetch(u, { cache: 'no-store' }).then(r => r.json());

export default function TodoPage() {
  const { data, mutate, isValidating } = useSWR('/api/todos', fetcher, { revalidateOnFocus: true });
  const [title, setTitle] = useState('');

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const next = { _id: 'temp-' + Date.now(), title, done: false, createdAt: new Date().toISOString() };

    await mutate(async (curr: any) => {
      const optimistic = { ok: true, items: [next, ...(curr?.items || [])] };
      // fire POST
      const res = await fetch('/api/todos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
        body: JSON.stringify({ title })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'Save failed');
      return { ok: true, items: [json.item, ...(curr?.items || [])] };
    }, { revalidate: false });

    setTitle('');
  }

  async function toggle(id: string, done: boolean) {
    await mutate(async (curr: any) => {
      const items = (curr?.items || []).map((it: any) => it._id === id ? { ...it, done } : it);
      await fetch('/api/todos', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, done })
      });
      return { ok: true, items };
    }, { revalidate: false });
  }

  async function remove(id: string) {
    await mutate(async (curr: any) => {
      const items = (curr?.items || []).filter((it: any) => it._id !== id);
      await fetch('/api/todos', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id })
      });
      return { ok: true, items };
    }, { revalidate: false });
  }

  return (
    <main className="min-h-screen pt-24 px-4 pb-24">
      <h1 className="eol-heading text-5xl font-bold">To-Do</h1>

      <form onSubmit={addTodo} className="mb-4 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 dark:bg-black/5 px-3 py-2 outline-none"
          placeholder="Add a to-do…"
        />
        <button className="rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-slate-500 disabled:opacity-50" disabled={!title.trim()}>
          Add
        </button>
      </form>

      <div className="text-xs opacity-60 mb-3">{isValidating ? 'Refreshing…' : 'Live'}</div>

      <ul className="space-y-2">
        {(data?.items || []).map((it: any) => (
          <li key={it._id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 dark:bg-black/5 px-3 py-2">
            <input type="checkbox" checked={!!it.done} onChange={(e) => toggle(it._id, e.target.checked)} />
            <div className={`flex-1 ${it.done ? 'line-through opacity-60' : ''}`}>{it.title}</div>
            <button onClick={() => remove(it._id)} className="text-xs opacity-70 hover:opacity-100">Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
