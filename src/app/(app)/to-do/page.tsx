// src/app/(app)/to-do/page.tsx
"use client";

import useSWR from "swr";
import { useState } from "react";
import ToDo from "@/models/ToDo"; // ← DEFAULT
import EOLButton from "@/components/EOLButton";
import { Loader2, CheckCircle2, Trash2 } from "lucide-react";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => r.json());

type ToDo = {
  _id: string;
  title: string;
  done: boolean;
  createdAt: string;
};

export default function ToDoPage() {
  const { data, mutate, isValidating } = useSWR<{ ok: true; items: ToDo[] }>(
    "/api/to-dos",
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );
  const [title, setTitle] = useState("");

  const items = data?.items || [];

  async function addToDo(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      title: title.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    };

    await mutate(
      async (curr) => {
        const res = await fetch("/api/to-dos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim() }),
        });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error);

        return {
          ok: true,
          items: [
            json.item,
            ...(curr?.items || []).filter((i) => i._id !== tempId),
          ],
        };
      },
      {
        optimisticData: { ok: true, items: [optimistic, ...items] },
        revalidate: false,
      }
    );

    setTitle("");
  }

  async function toggle(id: string, done: boolean) {
    await mutate(
      async () => {
        await fetch("/api/to-dos", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, done }),
        });
        return {
          ok: true,
          items: items.map((i) => (i._id === id ? { ...i, done } : i)),
        };
      },
      {
        optimisticData: {
          ok: true,
          items: items.map((i) => (i._id === id ? { ...i, done } : i)),
        },
        revalidate: false,
      }
    );
  }

  async function remove(id: string) {
    await mutate(
      async () => {
        await fetch("/api/to-dos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        return { ok: true, items: items.filter((i) => i._id !== id) };
      },
      {
        optimisticData: { ok: true, items: items.filter((i) => i._id !== id) },
        revalidate: false,
      }
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-bold bg-linear-to-r from-cyan-400 to-sky-600 bg-clip-text text-transparent">
          To-Do
        </h1>
        <p className="text-sm opacity-70">Build momentum. Grow your Tree.</p>
      </header>

      <form onSubmit={addToDo} className="eol-panel flex gap-3 p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 rounded-xl border border-slate-700/20 bg-slate-900/30 dark:bg-slate-950/50 px-4 py-3 text-sm placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
        <EOLButton variant="primary" disabled={!title.trim()}>
          Add To-Do
        </EOLButton>
      </form>

      <section className="space-y-3">
        {isValidating && !items.length && (
          <div className="eol-panel p-8 text-center opacity-70">
            <Loader2 className="w-6 h-6 mx-auto animate-spin" />
            <p className="mt-2">Loading your To-Dos…</p>
          </div>
        )}

        {!items.length && !isValidating && (
          <div className="eol-panel p-8 text-center opacity-70">
            <p>No To-Dos yet. Start building momentum!</p>
          </div>
        )}

        {items.map((item) => (
          <article
            key={item._id}
            className="eol-panel group flex items-center gap-3 p-4 transition-all hover:scale-[1.005]"
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={(e) => toggle(item._id, e.target.checked)}
              className="w-5 h-5 rounded border-cyan-500/50 text-cyan-600 focus:ring-cyan-500"
            />
            <div
              className={`flex-1 text-sm ${item.done ? "line-through opacity-60" : ""}`}
            >
              {item.title}
            </div>
            <button
              onClick={() => remove(item._id)}
              className="opacity-0 group-hover:opacity-70 hover:opacity-100 transition"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
