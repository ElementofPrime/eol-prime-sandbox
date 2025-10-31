"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await signIn("email", { email, callbackUrl: "/" });
  }

  return (
    <main className="min-h-screen pt-24 px-4 flex items-start justify-center">
      <div className="eol-panel p-4">
        <h1 className="eol-heading text-5xl font-bold">Sign in</h1>
        <p className="eol-muted">
          Enter your email and we’ll send a one-time magic link.
        </p>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/10 bg-white/5 dark:bg-black/5 px-3 py-2 outline-none"
          />
          <button className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-slate-500">
            Send magic link
          </button>
        </form>
      </div>
    </main>
  );
}
