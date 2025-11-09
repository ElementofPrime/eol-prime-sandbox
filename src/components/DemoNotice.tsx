"use client";

import useSWR from "swr";
import Link from "next/link";

const fetcher = async (url: string) => {
  const r = await fetch(url, { credentials: "include" });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err: any = new Error("API error");
    err.status = r.status;
    err.info = data;
    throw err;
  }
  return data;
};

export default function DemoNotice() {
  const { data } = useSWR("/api/demo/status", fetcher, {
    revalidateOnFocus: false,
  });

  if (!data || data.authed || !data.demo) return null;

  const remaining = data.chatsRemaining ?? 0;
  return (
    <div className="mx-auto mb-4 w-full max-w-5xl rounded-2xl border border-cyan-500/20 bg-[rgb(var(--eol-panel))] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          <span className="font-semibold">Demo Mode:</span> {remaining} chat
          {remaining === 1 ? "" : "s"} remaining. Create an account to unlock
          memory, unlimited chats, To-Dos & Reminders.
        </p>
        <div className="flex items-center gap-2">
          <Link
            href="/api/auth/signin"
            className="rounded-full border border-cyan-500/40 px-3 py-1.5 text-sm"
          >
            Sign In
          </Link>
          <Link
            href="/api/auth/signin"
            className="rounded-full bg-cyan-500/90 px-3 py-1.5 text-sm text-white"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
