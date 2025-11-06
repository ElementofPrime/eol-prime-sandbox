"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import PrimePulseTile from "@/components/PrimePulseTile";

const elements = [
  { title: "Chat", icon: "💬", link: "/chat" },
  { title: "Journal", icon: "📔", link: "/journal" },
  { title: "To-Do", icon: "✅", link: "/To-Do" },
  { title: "Reminders", icon: "⏰", link: "/reminders" },
  { title: "Fix-It", icon: "🛠️", link: "/fix-it" },
  { title: "New Beginning", icon: "🧠", link: "/new-beginning" },
  { title: "Core", icon: "🌿", link: "/core" },
  { title: "About", icon: "✨", link: "/about" },
];

export default function Home() {
  return (
    <div className="relative mx-auto w-full max-w-6xl text-center overflow-visible flex flex-col items-center">
      {/* Logo focus */}
      <motion.div
        className="relative isolate mx-auto mb-8 mt-2 sm:mt-4 w-36 sm:w-48 md:w-56 eol-breathe"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* circular aura (decorative) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-full eol-pulse-glow"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(34,211,238,.28) 0%, rgba(59,130,246,.16) 40%, transparent 70%)",
            filter: "blur(16px)",
            transform: "translateZ(0)",
          }}
        />
        <Image
          src="/logo.png"
          alt="Element of Life logo"
          width={480}
          height={480}
          sizes="(max-width: 640px) 9rem, (max-width: 768px) 12rem, 14rem"
          priority
          draggable={false}
          className="w-full h-auto rounded-full select-none eol-glow eol-glow-transition"
        />
      </motion.div>

      {/* Mantra + subhead */}
      <div className="mx-auto max-w-[68ch] px-4">
        <motion.p
          className="text-lg md:text-xl text-zinc-700 dark:text-zinc-500 leading-relaxed text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="font-medium text-zinc-800 dark:text-zinc-500">
            Welcome to Element of Life —
          </span>{" "}
          the foundation where{" "}
          <span className="text-cyan-600 dark:text-cyan-300">focus</span>{" "}
          becomes growth, and growth becomes transformation.
        </motion.p>

        <motion.h2
          className="text-center text-cyan-600 dark:text-cyan-400 text-sm sm:text-base font-semibold mt-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Guiding Tools that help Discover Your Core Elements
        </motion.h2>
      </div>

      {/* Prime Pulse */}
      <div className="mx-auto w-full max-w-6xl px-3 pb-6">
        <PrimePulseTile />
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 px-3 pb-12 mt-2">
        {elements.map((el) => (
          <Link key={el.title} href={el.link} aria-label={el.title}>
            <motion.div
              whileHover={{ scale: 1.06, y: -2 }}
              transition={{ type: "spring", stiffness: 250, damping: 14 }}
              className="eol-panel p-4 focus-within:ring-2 focus-within:ring-cyan-400/50"
            >
              <div className="text-2xl sm:text-3xl mb-2" aria-hidden="true">
                {el.icon}
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-500">
                {el.title}
              </h3>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
