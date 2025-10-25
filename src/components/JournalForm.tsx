'use client';

import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then(r => r.json());

export default function JournalForm() {
  const { data, mutate, isValidating } = useSWR('/api/journal', fetcher, {
    revalidateOnFocus: true
  });
  const [content, setContent] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newItem = {
      _id: 'temp-' + Date.now(),
      content,
      mood: null,
      tags: [],
      createdAt: new Date().toISOString()
    };

    // optimistic
    await mutate(
      async (curr: any) => {
        const optimistic = { ok: true, items: [newItem, ...(curr?.items || [])] };
        // fire POST
        const res = await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({ content })
        });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || 'Save failed');
        // replace temp with server item
        return {
          ok: true,
          items: [json.item, ...(curr?.items || [])]
        };
      },
      { revalidate: false }
    );

    setContent('');
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts…"
          className="w-full rounded-xl border p-3"
        />
        <button
          type="submit"
          className="rounded-xl bg-black px-4 py-2 text-slate-200 disabled:opacity-50"
          disabled={!content.trim()}
        >
          Save Entry
        </button>
      </form>

      <div className="text-sm text-gray-500">{isValidating ? 'Refreshing…' : null}</div>

      <ul className="space-y-3">
        {(data?.items || []).map((it: any) => (
          <li key={it._id} className="rounded-xl border p-3">
            <div className="text-xs opacity-60">{new Date(it.createdAt).toLocaleString()}</div>
            <div>{it.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
