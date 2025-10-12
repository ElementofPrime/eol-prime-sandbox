'use client';

import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-10 text-center">
      <h1 className="text-2xl font-semibold mb-2">Sign In</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-6">
        Choose a provider to continue.
      </p>
      <div className="flex flex-col gap-3">
        <button onClick={() => signIn()} className="rounded-xl px-4 py-2 bg-cyan-600 text-white">
          Continue
        </button>
        {/* Or specific providers if configured: */}
        {/* <button onClick={() => signIn('google')} className="...">Google</button> */}
        {/* <button onClick={() => signIn('github')} className="...">GitHub</button> */}
      </div>
    </div>
  );
}
