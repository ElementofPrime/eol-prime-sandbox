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
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
        <p className="text-sm opacity-80 mb-4">
          Enter your email and we’ll send a one-time magic link.
        </p>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
          />
          <button className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-slate-300">
            Send magic link
          </button>
        </form>
      </div>
    </main>
  );
}
