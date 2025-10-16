"use client";
import { useState } from "react";
import ChatMessageRow from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import type { ChatMessage } from "@/types/chat";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hey — I’m Prime. What should we build or solve next?" }
  ]);
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    const next = [...messages, { role: "user", content: text } as ChatMessage];
    setMessages(next);
    setLoading(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const json = await r.json();
      if (json?.content) {
        setMessages(prev => [...prev, { role: "assistant", content: json.content }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry—there was a problem reaching the model." }]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-3xl w-full px-4 pb-24 overflow-visible">
      <h1 className="text-xl font-semibold text-slate-100 mb-4">Prime Chat</h1>

      <div className="h-[60vh] sm:h-[64vh] overflow-y-auto rounded-2xl bg-slate-950/40 ring-1 ring-white/10 p-3 mb-3">
        {messages.map((m, i) => (<ChatMessageRow key={i} m={m} />))}
        {loading && (
          <div className="text-xs text-slate-400 px-2 py-2">Prime is thinking…</div>
        )}
      </div>

      <ChatInput onSend={send} disabled={loading} />
    </div>
  );
}
