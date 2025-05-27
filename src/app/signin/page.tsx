'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function SignIn() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-baseLight dark:bg-baseDark text-black dark:text-white text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/logo.png"
          alt="Element of Life Logo"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-semibold mb-2">Welcome to Element of Life</h1>
        <p className="text-base text-neutral dark:text-zinc-400 mb-6 max-w-md mx-auto">
          Your journey begins here. Prime will guide you every step of the way.
        </p>

        <div className="flex flex-col gap-4 max-w-sm w-full">
          <button
            onClick={() => signIn('google')}
            className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-accent transition"
          >
            Sign in with Google
          </button>

          <button
            onClick={() => signIn('email')}
            className="bg-white dark:bg-zinc-800 text-black dark:text-white py-2 px-4 rounded-lg border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
          >
            Sign in with Email
          </button>
        </div>
      </motion.div>
    </main>
  );
}
