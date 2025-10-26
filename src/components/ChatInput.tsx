"use client";
import { useState } from "react";

export default function ChatInput({ onSend, disabled }: { onSend: (t: string) => void; disabled?: boolean }) {
  const [v, setV] = useState("");
  return (
    <form
      onSubmit={(e)=>{ e.preventDefault(); if(v.trim()){ onSend(v.trim()); setV(""); } }}
      className="flex gap-2 rounded-2xl bg-slate-900/50 ring-1 ring-white/10 p-2"
    >
      <input
        value={v}
        onChange={e=>setV(e.target.value)}
        placeholder="Ask Prime anything…"
        className="flex-1 bg-transparent outline-none text-slate-500 placeholder:text-slate-500 px-2"
      />
      <button
        disabled={disabled || !v.trim()}
        className="px-3 py-2 rounded-xl bg-cyan-600/80 text-slate-500 disabled:opacity-40"
      >
        Send
      </button>
    </form>
  );
}
