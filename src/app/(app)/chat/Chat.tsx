"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import SceneFortress from "@/components/SceneFortress";
import PrimeAura from "@/components/PrimeAura";

type Msg = { role: "user" | "assistant"; content: string };
type Tone = "calm" | "excited" | "reflective" | "stressed" | "neutral";

export default function ChatPage() {
  const { status } = useSession(); // "authenticated" | "unauthenticated" | "loading"
  const isAuthed = status === "authenticated";

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "🏰 **Welcome to the Fortress of Prime** — a calm, sovereign space for clarity and growth. When you're ready, share what’s on your mind, and I’ll meet you there.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState<Tone>("neutral");
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const streamAbortRef = useRef<AbortController | null>(null);

  // Auto-scroll on new content
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() =>
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    );
    return () => cancelAnimationFrame(id);
  }, [messages, loading]);

  async function analyzeTone(text: string) {
    try {
      const r = await fetch("/api/pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!r.ok) return setTone("neutral");
      const j = await r.json();
      if (j?.tone) setTone(j.tone as Tone);
    } catch {
      setTone("neutral");
    }
  }

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Enforce 5 user messages for guests (client-side; you can also enforce server-side via cookie)
    const userCount = messages.filter((m) => m.role === "user").length;
    if (!isAuthed && userCount >= 5) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Limit reached (5 chats). Create an account or sign in to unlock full access, memory, and Prime’s realm.",
        },
      ]);
      return;
    }

    // Abort any in-flight stream
    streamAbortRef.current?.abort();
    const controller = new AbortController();
    streamAbortRef.current = controller;

    // Seed user + empty assistant bubble
    const userMsg: Msg = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "" }]);
    setInput("");
    setError(null);
    setLoading(true);
    analyzeTone(trimmed);

    try {
      const res = await fetch("/api/prime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(`Prime endpoint ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      let raf = 0;

      const pump = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            acc += decoder.decode(value, { stream: true });

            if (!raf) {
              raf = requestAnimationFrame(() => {
                setMessages((prev) => {
                  const next = [...prev];
                  const last = next.length - 1;
                  if (last >= 0 && next[last].role === "assistant") {
                    next[last] = { role: "assistant", content: acc };
                  }
                  return next;
                });
                raf = 0;
              });
            }
          }
        } finally {
          if (raf) cancelAnimationFrame(raf);
        }
      };

      await pump();

      // Finalize last assistant bubble
      setMessages((prev) => {
        const next = [...prev];
        const last = next.length - 1;
        if (last >= 0 && next[last].role === "assistant") {
          next[last] = { role: "assistant", content: acc || "…" };
        }
        return next;
      });

      analyzeTone(acc);
    } catch (e: any) {
      if (e?.name === "AbortError") return; // user sent another message; ignore
      setMessages((prev) => [
        ...prev.slice(0, -1), // drop empty assistant bubble
        {
          role: "assistant",
          content:
            "I hit a snag reaching the Prime endpoint. Try again in a moment, or check your connection.",
        },
      ]);
      setError(e?.message ?? "Request failed.");
    } finally {
      setLoading(false);
      streamAbortRef.current = null;
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const unauthReachedLimit =
    !isAuthed && messages.filter((m) => m.role === "user").length >= 5;

  return (
    <main className="relative min-h-svh pt-24 md:pt-28">
      {/* Hero / fortress scene */}
      <SceneFortress />

      {/* Guest banner */}
      {status !== "authenticated" && (
        <div className="mx-auto w-full max-w-3xl px-4">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/10 backdrop-blur p-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="mr-2">⚠️</span>
            Limited to <strong>5 chats</strong>.{" "}
            <span className="opacity-90">Create an account or sign in to access full features.</span>
            <button
              onClick={() => signIn()}
              className="ml-3 rounded-lg bg-cyan-700 px-3 py-1 text-white hover:bg-cyan-600 focus:outline-none focus-visible:outline  focus-visible:outline-cyan-500 focus-visible:outline-offset-2"
            >
              Sign in
            </button>
          </div>
        </div>
      )}

      {/* Log */}
      <div
        ref={scrollRef}
        className="mx-auto h[calc(100svh-220px)] w-full max-w-3xl overflow-y-auto px-4 pb-40 md:pb-48 scrollbar-thin"
      >
        <div className="mb-6 text-center text-[11px] tracking-widest text-slate-700 dark:text-slate-200/70 uppercase">
          Within these walls — Truth & Light always win.
        </div>

        <div className="space-y-3">
          {messages.map((m, i) => {
            const isAssistant = m.role === "assistant";
            return (
              <div
                key={i}
                className={
                  isAssistant
                    ? // Assistant bubble (glass, dark-safe)
                      "eol-bubble-assistant relative max-w-[85%] mr-auto rounded-2xl px-4 py-3 shadow-md backdrop-blur bg-sky-50/90 text-slate-900 dark:bg-white/10 dark:text-white border border-black/10 dark:border-white/10"
                    : // User bubble
                      "eol-bubble-user relative max-w-[85%] ml-auto rounded-2xl px-4 py-3 shadow-md backdrop-blur bg-white/70 text-slate-900 dark:bg-white/10 dark:text-white border border-black/10 dark:border-white/10"
                }
                aria-live={i === messages.length - 1 && isAssistant ? "polite" : undefined}
              >
                <PrimeAura tone={tone} />
                <div className="relative whitespace-pre-wrap">{m.content}</div>
              </div>
            );
          })}

          {loading && (
            <div
              className="mr-auto max-w-[85%] rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 px-4 py-3 text-slate-600 dark:text-slate-400 backdrop-blur animate-pulse"
              role="status"
              aria-live="polite"
            >
              Prime is focusing…
            </div>
          )}

          {error && !loading && (
            <div className="mr-auto max-w-[85%] rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          {unauthReachedLimit && (
            <div className="mr-auto max-w-[85%] rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
              You’ve reached the guest limit. Sign in to continue your conversation and unlock memory.
            </div>
          )}
        </div>
      </div>

      {/* Input dock */}
      <div className="fixed inset-x-0 bottom-0 z-10">
        <div className="mx-auto w-full max-w-3xl px-4 pb-5">
          <div className="relative eol-panel p-3">
            <PrimeAura tone={tone} />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Speak to Prime within the safety of the Fortress…"
              className="eol-input min-h-[60px]"
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                onClick={sendMessage}
                disabled={loading || unauthReachedLimit}
                className="rounded-xl bg-white/90 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2 dark:bg-white/80 dark:text-slate-900"
              >
                {loading ? "Sending…" : "Send to Prime"}
              </button>
            </div>
          </div>

          <div className="mt-3 text-center text-[11px] text-slate-700 dark:text-slate-200/70">
            “Prime is here to help you navigate safely. The world is full of deception and deepfakes — we don’t fall for any of it.”
          </div>
        </div>
      </div>
    </main>
  );
}
