'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const elements = [
  { title: 'Chat', icon: '💬', link: '/chat', desc: 'Prime is always here.' },
  { title: 'Journal', icon: '📔', link: '/journal', desc: 'Journal daily and form a plan.' },
  { title: 'Tasks', icon: '✅', link: '/tasks', desc: 'Daily To-Do.' },
  { title: 'Reminders', icon: '⏰', link: '/reminders', desc: 'Stay Organized, Conquer Your Day.' },
  { title: 'Fix-It', icon: '🛠️', link: '/fixit', desc: 'Simplify fixes, grow your confidence.' },
  { title: 'New Beginning', icon: '🧠', link: '/New Beginning', desc: 'Start here. Shape your journey.' },
  { title: 'Core', icon: '🌿', link: '/core', desc: 'Stay grounded in your truth.' },
  { title: 'About', icon: '✨', link: '/about', desc: 'Meet Prime and the Element mission.' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white px-6 py-16 overflow-hidden relative">
      {/* Background vines + tree */}
      <Image
        src="/vines.svg.png"
        alt="Decorative vines"
        width={160}
        height={160}
        className="absolute top-0 left-0 opacity-10 dark:opacity-20 z-[-1] pointer-events-none select-none"
      />
      <Image
        src="/tree.svg.png"
        alt="Decorative tree"
        width={160}
        height={160}
        className="absolute bottom-0 right-0 opacity-10 dark:opacity-20 z-[-1] pointer-events-none select-none"
      />

      {/* Hero */}
      <section className="flex flex-col items-center text-center z-10 mb-12">
        <motion.img
          src="/logo.png"
          alt="Element of Life Logo"
          className="w-48 h-48 mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />

        <motion.h1
          className=""text-3xl md:text-5xl font-bold mb-3""
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          You Weren’t Meant to Do This Alone
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-black dark:text-white max-w-2xl mb-10""
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Welcome to Element of Life — crafted to keep you focused, empower growth, and guide you toward discovering life's essential elements.
        </motion.p>

        <motion.h2
          className="text-2xl font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Guiding Tools to Discover Your Core Elements
        </motion.h2>
      </section>

      {/* Element Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 max-w-6xl mx-auto z-10">
        {elements.map((el, i) => (
          <Link key={i} href={el.link}>
            <div className="flex flex-col items-center justify-center bg-white dark:bg-zinc-800 text-black dark:text-white rounded-2xl shadow-md p-4 hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-center">
              <div className="text-3xl mb-2">{el.icon}</div>
              <h3 className="text-base font-semibold mb-1">{el.title}</h3>
              <p className="text-xs">{el.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
