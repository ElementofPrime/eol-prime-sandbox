"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const outRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim()) return;
    const next = [...messages, { role: "user" as const, content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/prime", {
      method: "POST",
      body: JSON.stringify({ messages: next }),
    });

    const reader = res.body!.getReader();
    let assistant = "";
    setMessages([...next, { role: "assistant", content: "" }]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      assistant += new TextDecoder().decode(value);
      setMessages([...next, { role: "assistant", content: assistant }]);
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <div className="rounded-2xl border p-4 shadow-sm bg-white/70 dark:bg-black/30 backdrop-blur">
        <div ref={outRef} className="h-[60vh] overflow-auto space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <div
                className={`inline-block rounded-2xl px-4 py-2 ${
                  m.role === "user"
                    ? "bg-sky-100 dark:bg-sky-900/30"
                    : "bg-slate-100 dark:bg-slate-800/40"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-sm opacity-70">Prime is thinking…</div>}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask Prime…"
            className="flex-1 rounded-full border px-4 py-2 bg-white/80 dark:bg-black/40"
          />
          <button onClick={send} className="rounded-full px-5 py-2 bg-sky-500 text-white hover:opacity-90">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
