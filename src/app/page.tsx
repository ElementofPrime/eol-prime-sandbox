'use client';

import Link from 'next/link';
import Image from "next/image";
import { motion } from "framer-motion";
import BackgroundDecor from '@/components/BackgroundDecor';

const elements = [
  { title: 'Chat', icon: '💬', link: '/chat' },
  { title: 'Journal', icon: '📔', link: '/journal' },
  { title: 'Tasks', icon: '✅', link: '/tasks' },
  { title: 'Reminders', icon: '⏰', link: '/reminders' },
  { title: 'Fix-It', icon: '🛠️', link: '/fixit' },
  { title: 'New Beginning', icon: '🧠', link: '/new-beginning' }, // keep tile; route added below
  { title: 'Core', icon: '🌿', link: '/core' },
  { title: 'About', icon: '✨', link: '/about' },
];
export default function Home() {
  return (
    <div className="relative w-full max-w-6xl mx-auto text-center">
      {/* background decorations under everything */}
       <BackgroundDecor />

      {/* Logo with scale-in + beam (no image blur) */}
      <motion.div
        className="relative mx-auto mb-6 w-40 sm:w-52 md:w-60 will-change-transform transform-gpu"
        initial={{ opacity: 0, scale: 1.06 }}   // smaller delta prevents softening
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Light beam */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
          aria-hidden
          style={{
            background:
              'radial-gradient(60% 60% at 50% 45%, rgba(59,130,246,0.35), rgba(34,211,238,0.18) 45%, transparent 70%)',
          }}
         />
         {/* Dark beam */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 blur-2xl hidden dark:block"
          aria-hidden
          style={{
            background:
              'radial-gradient(60% 60% at 50% 45%, rgba(129,230,217,0.25), rgba(34,197,94,0.20) 45%, transparent 70%)',
          }}
        />

        {/* Logo — crisp (no filters), with adaptive glow */}
        <Image
          src="/logo.png"
          alt="Element of Life Logo"
          width={480}
          height={480}
          priority
          className="eol-glow eol-glow-transition w-full h-auto rounded-full select-none [backface-visibility:hidden]"
          draggable={false}
        />
      </motion.div>

      {/* Welcome (bigger) */}
      <motion.p
        className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Welcome to Element of Life — crafted to keep you focused, empower growth, and guide you
        toward discovering life’s essential elements.
      </motion.p>

      {/* Guiding Tools (smaller) */}
      <motion.h2
        className="mt-3 text-sm sm:text-base md:text-lg font-semibold text-cyan-500 mb-5 md:mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.45 }}
      >
        Guiding Tools to Discover Your Core Elements
      </motion.h2>

      {/* Elements grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {elements.map((el) => (
          <Link key={el.title} href={el.link}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="bg-zinc-900/90 dark:bg-zinc-800 text-white rounded-2xl shadow-lg p-5 text-center ring-1 ring-black/5 dark:ring-white/5"
            >
              <div className="text-2xl sm:text-3xl mb-2">{el.icon}</div>
              <h3 className="text-sm sm:text-base font-semibold">{el.title}</h3>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
