// src/app/(app)/journal/page.tsx
"use client";

import { useState } from "react";
import { fetcher } from "@/lib/fetcher";
import useSWR, { mutate as globalMutate } from "swr";
import { format } from "date-fns";
import { Loader2, CheckCircle2 } from "lucide-react";
import EOLButton from "@/components/EOLButton";

// === TYPES ===
type Entry = {
  _id: string;
  content: string;
  createdAt: string;
  mood?: "positive" | "negative" | "neutral";
  tags?: string[];
};

type ListResponse = { items: Entry[] };

// === POST HELPER ===
async function postJournal(content: string) {
  const res = await fetch("/api/journal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error("Failed to save");
  return res.json();
}

// === MAIN COMPONENT ===
export default function JournalPage() {
  const { data, isLoading, mutate } = useSWR<ListResponse>(
    "/api/journal",
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 0,
    }
  );

  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const entries = data?.items ?? [];

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSaving(true);
    setMsg(null);

    const tempId = `temp-${Date.now()}`;
    const optimisticEntry: Entry = {
      _id: tempId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      mood: "neutral",
    };

    // Optimistic UI
    mutate(
      (curr) => ({
        items: [optimisticEntry, ...(curr?.items || [])],
      }),
      false
    );

    try {
      const { item } = await postJournal(content.trim());

      // Replace temp with real
      mutate(
        (curr) => ({
          items: [item, ...(curr?.items || []).filter((i) => i._id !== tempId)],
        }),
        false
      );

      // Refresh Prime Pulse
      await globalMutate("/api/prime/pulse");

      setContent("");
      setMsg({ text: "Saved + analyzed", type: "success" });
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setMsg({ text: "Save failed", type: "error" });
      mutate(); // rollback
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-bold bg-linear-to-r from-cyan-400 to-sky-600 bg-clip-text text-transparent">
          Journal
        </h1>
        <p className="text-sm opacity-70">
          Capture thoughts. Uncover Elements. Grow your Tree.
        </p>
      </header>

      {/* Form */}
      <form onSubmit={onSave} className="eol-panel space-y-4 p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="• Use - [ ] for ToDos\n• $100, AAPL, 3pm — I’ll detect it\n• Just write. I’ll listen."
          className="w-full rounded-2xl border border-slate-700/20 bg-slate-900/30 dark:bg-slate-950/50 p-4 text-sm placeholder:opacity-60 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
          rows={6}
          disabled={saving}
        />

        <div className="flex items-center justify-between">
          <EOLButton variant="primary" disabled={saving || !content.trim()}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Save Entry
              </>
            )}
          </EOLButton>

          {msg && (
            <span
              className={`text-sm font-medium flex items-center gap-1 ${
                msg.type === "success" ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {msg.type === "success" ? "Check" : "Warning"} {msg.text}
            </span>
          )}
        </div>
      </form>

      {/* Entries List */}
      <section className="space-y-4">
        {isLoading && !entries.length && (
          <div className="eol-panel p-8 text-center opacity-70">
            <Loader2 className="w-6 h-6 mx-auto animate-spin" />
            <p className="mt-2">Loading your thoughts…</p>
          </div>
        )}

        {!isLoading && !entries.length && (
          <div className="eol-panel p-8 text-center opacity-70">
            <p>No entries yet. Start writing to grow your Tree</p>
          </div>
        )}

        {entries.map((entry) => (
          <article
            key={entry._id}
            className="eol-panel group relative overflow-hidden transition-all hover:scale-[1.005] hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {entry.content}
                </p>
              </div>

              {/* Mood Indicator */}
              {entry.mood && (
                <div
                  className={`w-2 h-2 rounded-full pulse-dot ${
                    entry.mood === "positive"
                      ? "positive"
                      : entry.mood === "negative"
                        ? "negative"
                        : "neutral"
                  }`}
                  title={entry.mood}
                />
              )}
            </div>

            <time className="text-xs opacity-60 mt-2 block">
              {format(new Date(entry.createdAt), "MMM d, yyyy • h:mm a")}
            </time>
          </article>
        ))}
      </section>
    </main>
  );
}
