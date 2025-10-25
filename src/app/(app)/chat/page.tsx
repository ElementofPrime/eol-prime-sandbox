"use client";

import { useEffect, useRef, useState } from "react";
import SceneFortress from "@/components/SceneFortress";
import PrimeAura from "@/components/PrimeAura";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState<"calm" | "excited" | "reflective" | "stressed" | "neutral">("neutral");
  const [unauthLimit, setUnauthLimit] = useState(false); // wire to session later
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const analyzeTone = async (text: string) => {
    try {
      const r = await fetch("/api/pulse", { method: "POST", body: JSON.stringify({ text }) });
      const j = await r.json();
      if (j?.tone) setTone(j.tone);
    } catch {
      setTone("neutral");
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // enforce 5 messages for unauthenticated users
    if (unauthLimit) {
      const userCount = messages.filter((m) => m.role === "user").length;
      if (userCount >= 5) {
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
    }

    const userMsg: Msg = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "" }]); // seed streaming bubble
    setInput("");
    setLoading(true);
    analyzeTone(trimmed);

    // Replace with your existing /api/chat call
    try {
      // IMPORTANT: use /api/prime (streaming)
      const res = await fetch("/api/prime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      if (!res.ok || !res.body) {
        throw new Error(`prime endpoint ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });

        // stream into last assistant bubble
        setMessages((prev) => {
          const next = [...prev];
          const lastIdx = next.length - 1;
          if (lastIdx >= 0 && next[lastIdx].role === "assistant") {
            next[lastIdx] = { ...next[lastIdx], content: acc };
          }
          return next;
        });
      }
         // "Welcome to the secure Fortress of Prime — a place built for light, focus, and clarity. I’m here with you. Always forward.",
      analyzeTone(acc);
    } catch (e) {
      setMessages((prev) => [
        ...prev.slice(0, -1), // drop empty assistant bubble
        { role: "assistant", content: "I hit a snag reaching the Prime endpoint. Try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  return (
    <main className="relative min-h-svh] pt-24 md:pt-28">
      <SceneFortress />
      {unauthLimit && (
        <div className="mx-auto w-full max-w-3xl px-4">
          <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-500 backdrop-blur">
            <span className="mr-2">⚠️</span>
            Limited to <strong>5 chats</strong>.{" "}
            <span className="opacity-90">Create an account or sign in to access full features.</span>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="mx-auto h-[calc(100svh-220px)] w-full max-w-3xl overflow-y-auto px-4 pb-40 md:pb-48 scrollbar-thin"
      >
        <div className="mb-6 text-center text-xs tracking-widest text-slate-200/70 uppercase">
          Within these walls- truth light always wins.
        </div>
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`relative max-w-[85%] rounded-2xl px-4 py-3 shadow-md backdrop-blur ${
                m.role === "user"
                  ? "ml-auto bg-white/10 text-white"
                  : "mr-auto bg-sky-50/90 text-slate-900 dark:bg-white/10 dark:text-white"
              }`}
            >
              <PrimeAura tone={tone} />
              <div className="relative whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="mr-auto max-w-[85%] rounded-2xl bg-white/10 px-4 py-3 text-slate-500 backdrop-blur">
              Prime is focusing…
            </div>
          )}
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-10">
        <div className="mx-auto w-full max-w-3xl px-4 pb-5">
          <div className="relative rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl">
            <PrimeAura tone={tone} />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Speak to Prime within the safety of the Web3 blockchain Fortress…"
              className="min-h-[60px] w-full resize-none rounded-xl bg-black/20 p-3 text-slate-700 placeholder:text-slate-300/70 focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                onClick={sendMessage}
                className="rounded-xl bg-white/90 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
                disabled={loading}
              >
                {loading ? "Sending…" : "Send to Prime"}
              </button>
            </div>
          </div>
          <div className="mt-3 text-center text-[11px] text-slate-200/70">
            “Prime is here to help you navigate safely. The world is full of deception and deepfakes, we don't fall for any of it.”
          </div>
        </div>
      </div>
    </main>
  );
}
