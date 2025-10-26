// /src/app/(app)/chat/page.tsx
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
  const [unauthLimit] = useState(false); // TODO: wire to session
  const containerRef = useRef<HTMLDivElement>(null);

  // autoscroll
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

    // simple client-side limit (server also enforces with cookie)
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
    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "" }]); // seed empty assistant bubble
    setInput("");
    setLoading(true);
    analyzeTone(trimmed);

    try {
      // STREAM from /api/prime
      const res = await fetch("/api/prime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      if (!res.ok || !res.body) throw new Error(`prime endpoint ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });

        // stream into the last assistant bubble
        setMessages((prev) => {
          const next = [...prev];
          const last = next.length - 1;
          if (last >= 0 && next[last].role === "assistant") {
            next[last] = { ...next[last], content: acc };
          }
          return next;
        });
      }

      analyzeTone(acc);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1), // remove the empty assistant bubble
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

      {/* Optional guest banner (set unauthLimit=true to show) */}
      {unauthLimit && (
        <div className="mx-auto w-full max-w-3xl px-4">
          <div className="eol-panel p-4">
            <span className="mr-2">⚠️</span>
            Limited to <strong>5 chats</strong>.{" "}
            <span className="opacity-90">Create an account or sign in to access full features.</span>
          </div>
        </div>
      )}

      {/* Chat log */}
      <div
        ref={containerRef}
        className="mx-auto h-[calc(100svh-220px)] w-full max-w-3xl overflow-y-auto px-4 pb-40 md:pb-48 scrollbar-thin"
      >
        <div className="mb-6 text-center text-xs tracking-widest text-slate-600 dark:text-slate-200/70 uppercase">
          Within these walls, light always wins.
        </div>

        <div className="space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "eol-bubble-user" : "eol-bubble-assistant"}>
              <PrimeAura tone={tone} />
              <div className="relative whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}

          {loading && (
            <div className="eol-bubble-assistant">
              Prime is focusing…
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
              <button onClick={sendMessage} className="eol-btn" disabled={loading}>
                {loading ? "Sending…" : "Send to Prime"}
              </button>
            </div>
          </div>

          <div className="mt-3 text-center text-[11px] text-slate-600 dark:text-slate-200/70">
            “Prime is here to help you navigate safely. The world is full of deception and deepfakes — we don’t fall for any of it.”
          </div>
        </div>
      </div>
    </main>
  );
}
