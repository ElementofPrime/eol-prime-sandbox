"use client";
import { cn } from "src/lib/utils"; // if you don’t have a cn util, swap to template strings
import type { ChatMessage } from "@/types/chat";

export default function ChatMessageRow({ m }: { m: ChatMessage }) {
  const isUser = m.role === "user";
  return (
    <div className={cn(
      "w-full flex py-2",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isUser
          ? "bg-cyan-600/20 text-cyan-200 ring-1 ring-cyan-400/20"
          : "bg-slate-900/50 text-slate-200 ring-1 ring-white/10"
      )}>
        {m.content}
      </div>
    </div>
  );
}
