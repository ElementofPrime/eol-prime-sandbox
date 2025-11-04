// src/components/PrimePulseTile.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subscribeToPulse, getPrimePulse } from "@/lib/prime/pulse";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";

// === LOCAL SUB-COMPONENTS (Fixes "Cannot find name") ===
function UnauthTile() {
  return (
    <div className="eol-panel p-6 text-center">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Sign in to see your Prime Pulse.
      </p>
      <button onClick={() => signIn()} className="btn-primary">
        Sign In
      </button>
    </div>
  );
}

function LoadingTile() {
  return (
    <div className="eol-panel p-6">
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse" />
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-16 animate-pulse" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse" />
      </div>
    </div>
  );
}

function PulseDot({ mood }: { mood: string }) {
  return <div className={`pulse-dot ${mood}`} />;
}

function LivePulseTile({
  pulse,
}: {
  pulse: NonNullable<Awaited<ReturnType<typeof getPrimePulse>>>;
}) {
  const { mood, strength, streak, trend, prompt } = pulse;
  const pct = Math.round(strength * 100);

  return (
    <motion.div
      className="eol-panel p-6"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-bold tracking-widest text-sky-600 dark:text-sky-400">
          PRIME PULSE
        </span>
        <PulseDot mood={mood} />
      </div>

      <motion.div
        key={pct}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-5xl font-bold bg-linear-to-br from-sky-600 to-cyan-700 bg-clip-text text-transparent"
      >
        {pct}%
      </motion.div>

      <div className="text-xs opacity-70 mt-1">
        {streak > 0
          ? `${streak} day streak ${trend === "rising" ? "↑" : ""}`
          : "Begin your rhythm"}
      </div>

      <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">
        {prompt}
      </p>

      <div className="mt-4">
        <Link href="/journal" className="btn-primary text-sm">
          Reflect
        </Link>
      </div>
    </motion.div>
  );
}

// === MAIN COMPONENT ===
export default function PrimePulseTile() {
  const { status } = useSession();
  const [pulse, setPulse] =
    useState<Awaited<ReturnType<typeof getPrimePulse>>>(null);

  useEffect(() => {
    getPrimePulse().then(setPulse);
    return subscribeToPulse(setPulse);
  }, []);

  if (status !== "authenticated") return <UnauthTile />;
  if (!pulse) return <LoadingTile />;
  return <LivePulseTile pulse={pulse} />;
}
