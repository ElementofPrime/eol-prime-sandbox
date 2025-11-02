// src/components/ChatMessageRow.tsx
"use client";

import { cn } from "src/lib/utils";
import type { ChatMessage } from "@/types/chat";
import DOMPurify from "dompurify";
import React from "react";

// === SECURITY: Sanitize + Prevent Tabnapping ===
DOMPurify.addHook("afterSanitizeElements", (node) => {
	const element = node as Element;
	if (
		element.tagName === "A" &&
		element.getAttribute("target") === "_blank"
	) {
		element.setAttribute("rel", "noopener noreferrer");
	}
	return node;
});

const sanitizeContent = (content: string): string => {
	return DOMPurify.sanitize(content, {
		ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
		ALLOWED_ATTR: ["href", "target"],
		ADD_ATTR: ["rel"],
	});
};

const ChatMessageRow = React.memo(({ m }: { m: ChatMessage }) => {
	const isUser = m.role === "user";
	const sanitizedContent = sanitizeContent(m.content);

	const containerClasses = cn(
		"w-full flex py-2 px-4",
		isUser ? "justify-end" : "justify-start"
	);

	const messageClasses = cn(
		"max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-lg backdrop-blur-sm transition-all",
		"border",
		isUser
			? "bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 text-cyan-50 border-cyan-500/30"
			: "bg-gradient-to-br from-slate-800/80 to-slate-900/60 text-slate-50 border-slate-700/50"
	);

	return (
		<div className={containerClasses} role="presentation">
			<div
				className={messageClasses}
				role="article"
				aria-label={isUser ? "User message" : "Assistant message"}
			>
				<div
					className="prose prose-sm prose-invert max-w-none"
					dangerouslySetInnerHTML={{ __html: sanitizedContent }}
					tabIndex={-1}
					aria-roledescription={
						isUser
							? "User message content"
							: "Assistant message content"
					}
				/>
			</div>
		</div>
	);
});

export default ChatMessageRow;
