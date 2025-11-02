"use client";

import { cn } from "src/lib/utils";
import type { ChatMessage } from "@/types/chat";
import DOMPurify from "dompurify"; // Install via npm if adding HTML support
import React from "react";

// Optional: Sanitize content if it may contain HTML
function sanitizeContent(content: string): string {
  return DOMPurify.sanitize(content);
}

const ChatMessageRow = React.memo(({ m }: { m: ChatMessage }) => {
  const isUser = m.role === "user";
  const sanitizedContent = sanitizeContent(m.content); // Apply sanitization

  return (
    <div
      className={cn(
        "w-full flex py-2",
        isUser ? "justify-end" : "justify-start"
      )}
      role="presentation" // ARIA: Indicates structure
    >
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:max-w-[60%]", // Improved responsiveness
          isUser
            ? "bg-cyan-600/20 text-cyan-100 ring-cyan-400/20"
            : "bg-slate-900/50 text-white ring-white/10"
        )}
        role="article" // ARIA: Marks as message content
        aria-label={isUser ? "User message" : "Assistant message"} // ARIA: Improves screen reader experience
      >
        <span dangerouslySetInnerHTML={{ __html: sanitizedContent }} />{" "}
        {/* Use if HTML support needed; otherwise keep as {m.content} */}
      </div>
    </div>
  );
});

export default ChatMessageRow;
