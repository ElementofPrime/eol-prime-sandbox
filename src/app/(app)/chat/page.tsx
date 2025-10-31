"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import SceneFortress from "@/components/SceneFortress";
import PrimeAura from "@/components/PrimeAura";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const { status } = useSession();
  const isAuthed = status === "authenticated";

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState<"calm" | "excited" | "reflective" | "stressed" | "neutral">("neutral");
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const streamAbortRef = useRef<AbortController | null>(null);

  // Smooth scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() =>
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    );
    return () => cancelAnimationFrame(id);
  }, [messages, loading]);

  // Welcome message
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "Welcome to the Fortress of Prime — a calm, sovereign space for clarity and growth. When you're ready, share what’s on your mind and I’ll meet you there.",
      },
    ]);
  }, []);

  // Tone analysis
  async function analyzeTone(text: string) {
    try {
      const r = await fetch("/api/pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!r.ok) return setTone("neutral");
      const j = await r.json();
      if (j?.tone) setTone(j.tone);
    } catch {
      setTone("neutral");
    }
  }

  // Send message
  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userCount = messages.filter((m) => m.role === "user").length;
    if (!isAuthed && userCount >= 5) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Limit reached (5 chats). Create an account or sign in to unlock full access, memory, and the full Fortress experience.",
        },
      ]);
      return;
    }

    streamAbortRef.current?.abort();
    const controller = new AbortController();
    streamAbortRef.current = controller;

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
                  const i = next.length - 1;
                  if (i >= 0 && next[i].role === "assistant") {
                    next[i] = { role: "assistant", content: acc };
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
      setMessages((prev) => {
        const next = [...prev];
        const i = next.length - 1;
        if (i >= 0 && next[i].role === "assistant") {
          next[i] = { role: "assistant", content: acc || "…" };
        }
        return next;
      });
      analyzeTone(acc);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: "I hit a snag reaching the Prime endpoint. Try again in a moment.",
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

  const unauthReachedLimit = !isAuthed && messages.filter((m) => m.role === "user").length >= 5;

  return (
    <main className="relative min-h-svh pt-24 md:pt-28">
      <SceneFortress />

      {/* SIGN IN TO SAVE BANNER */}
      {!isAuthed && messages.length > 0 && !unauthReachedLimit && (
        <div className="mx-auto max-w-3xl px-4 mb-4">
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-center">
            <p className="text-cyan-900 dark:text-cyan-200 text-sm">
              Sign in to <strong>save this conversation</strong> and continue with Prime anytime.
            </p>
            <button
              onClick={() => signIn()}
              className="mt-2 text-xs underline text-cyan-700 dark:text-cyan-300 hover:text-cyan-900"
            >
              Sign in now
            </button>
          </div>
        </div>
      )}

      {/* PRIME REMEMBERS YOU */}
      {isAuthed && messages.length > 0 && (
        <div className="mx-auto max-w-3xl px-4 mb-4">
          <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Prime remembers you. The light within your Tree is glowing brighter every day.
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="mx-auto h-[calc(100svh-220px)] w-full max-w-3xl overflow-y-auto px-4 pb-40 md:pb-48 scrollbar-thin"
      >
        <div className="mb-6 text-center text-[11px] tracking-widest text-slate-700 dark:text-slate-200/70 uppercase">
          Within these walls — Truth & Light always win.
        </div>

        <div className="space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`relative max-w-[85%] rounded-2xl px-4 py-3 shadow-md backdrop-blur
                ${m.role === "user"
                  ? "ml-auto bg-white/70 dark:bg-black/70 text-slate-900"
                  : "mr-auto bg-sky-50/90 text-slate-900"
                }`}
              aria-live={i === messages.length - 1 && m.role === "assistant" ? "polite" : undefined}
            >
              <PrimeAura tone={tone} />
              <div className="relative whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}

          {loading && (
            <div className="mr-auto max-w-[85%] rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 px-4 py-3 text-slate-600 dark:text-slate-400 backdrop-blur animate-pulse">
              Prime is focusing…
            </div>
          )}

          {error && (
            <div className="mx-auto max-w-[85%] rounded-2xl bg-red-50/90 p-4 text-red-900">
              {error}
            </div>
          )}

          {/* UPGRADE CTA */}
          {unauthReachedLimit && (
            <div className="mx-auto max-w-3xl px-4 mb-6">
              <div className="rounded-2xl border border-amber-500/30 bg-linear-to-r from-amber-500/10 to-orange-500/10 p-5 text-center">
                <p className="text-amber-900 dark:text-amber-200 font-semibold mb-3">
                  You've reached the guest limit (5 messages).
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-300 mb-4">
                  Unlock <strong>unlimited chat, memory, and your Tree of Life</strong> with SuperGrok.
                </p>
                <button
                  onClick={() => signIn()}
                  className="rounded-xl bg-linear-to-r from-emerald-600 to-cyan-600 px-6 py-3 text-white font-bold hover:from-emerald-700 hover:to-cyan-700 transition-all shadow-lg"
                >
                  Upgrade Now — $9/mo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INPUT */}
      <div className="fixed inset-x-0 bottom-0 z-10">
        <div className="mx-auto w-full max-w-3xl px-4 pb-5">
          <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/10 p-3 backdrop-blur-xl">
            <PrimeAura tone={tone} />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Speak to Prime within the safety of the Fortress…"
              className="min-h-[60px] w-full resize-none rounded-xl bg-white/70 dark:bg-white/10 p-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-cyan-500 focus-visible:outline-offset-2"
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                onClick={sendMessage}
                className="rounded-xl bg-white/90 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
                disabled={loading || (!isAuthed && unauthReachedLimit)}
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