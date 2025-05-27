'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const elements = [
  { title: 'Chat', icon: '💬', link: '/chat', desc: 'Prime is always here.' },
  { title: 'Journal', icon: '📔', link: '/journal', desc: 'Journal daily and form a plan.' },
  { title: 'Tasks', icon: '✅', link: '/tasks', desc: 'Daily To-Do.' },
  { title: 'Reminders', icon: '⏰', link: '/reminders', desc: 'Stay organized. Conquer your day.' },
  { title: 'Fix-It', icon: '🛠️', link: '/fixit', desc: 'Simplify problems. Grow your confidence.' },
  { title: 'New Beginning', icon: '🧠', link: '/New Beginning', desc: 'Start here. Shape your journey.' },
  { title: 'Core', icon: '🌿', link: '/core', desc: 'Stay grounded in your truth.' },
  { title: 'About', icon: '✨', link: '/about', desc: 'Meet Prime and the mission.' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-baseLight dark:bg-baseDark text-black dark:text-white px-6 py-20 relative overflow-hidden">
      
      {/* Decorative Images */}
      <Image
        src="/vines.svg.png"
        alt=""
        width={160}
        height={160}
        className="absolute top-0 left-0 opacity-10 dark:opacity-20 z-[-1] pointer-events-none select-none"
        aria-hidden
      />
      <Image
        src="/tree.svg.png"
        alt=""
        width={160}
        height={160}
        className="absolute bottom-0 right-0 opacity-10 dark:opacity-20 z-[-1] pointer-events-none select-none"
        aria-hidden
      />

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mb-14">
        <motion.img
          src="/logo.png"
          alt="Element of Life Logo"
          className="w-32 sm:w-40 h-auto mb-6"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />

        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold mb-4"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          You Weren’t Meant to Do This Alone
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl max-w-2xl text-muted mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          Welcome to Element of Life — Crafted to keep you focused, empower growth, and guide you toward discovering your essential Elements.
        </motion.p>

        <motion.h2
          className="text-lg sm:text-xl font-semibold text-accent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          Guiding Tools to Discover Your Core Elements
        </motion.h2>
      </section>

      {/* Grid of Features */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto z-10">
        {elements.map((el, i) => (
          <Link key={i} href={el.link}>
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow hover:shadow-lg transition-all p-5 text-center hover:scale-[1.03] cursor-pointer border border-transparent hover:border-primary">
              <div className="text-3xl mb-3">{el.icon}</div>
              <h3 className="text-base font-semibold mb-1">{el.title}</h3>
              <p className="text-xs text-muted">{el.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
