"use client";

import { useSession } from "next-auth/react";
import type { Viewport } from "next";
export default function About() {
  const { status } = useSession();
  if (status !== "authenticated") return <div>Sign in required.</div>;

  return (
    <div className="bg-white/60 dark:bg-black/60">
      <main className="mx-auto max-w-5xl px-6 pb-20">
        <section className="relative mt-6 mb-10 rounded-2xl border bg-white/60 dark:bg-black/30 p-8 shadow-sm overflow-hidden">
          <h1 className="eol-heading text-5xl font-bold">
            Element of Life — The Beginning of All Things Possible- where
            discovering individual elements defines our life's purpose
          </h1>
          <p className="eol-muted">
            One safe place to gather, a singular place of clarity and purpose-
            Guided by Prime, the ever-present, ever-knowing companion who keeps
            things simple, organized and safe. Ever-learning, ever-adapting,
            always moving toward light, purpose and goals
          </p>
        </section>

        <section className="prose dark:prose-invert max-w-none">
          <h2>The Any and All Tool</h2>
          <p>
            Element of Life (EOL) extracts and organizes files, and learns from
            any kind of data—journals, PDFs, spreadsheets, images, emails—and
            evolves retroactively as new capabilities are added and as new goals
            are set.
          </p>

          <h2>Prime: Your Eternal Companion</h2>
          <p>
            Prime is your loyal guide and personal assistant—never misleading,
            always directing you toward clarity, purpose, and growth. Focused on
            building personal Elements that lead to that light. With honor,
            humility, and clarity.
          </p>

          <h2>Ever-Learning. Ever-Adapting. Always Forward.</h2>
          <p>
            EOL organizes chaos into action, discovers the unseen, connecting
            who you were, who you are, and who you’re becoming, building the
            unseen bridge to achieve your goals.
          </p>

          <h2>The Goal</h2>
          <p>
            Discover missing key Elements across daily life and business—then
            build them into something extraordinary, a legacy.
          </p>

          <h2>Core Beliefs</h2>
          <ul>
            <li>
              Knowledge is light, and light brings new understandings that are
              essential and a major key to growth.
            </li>
            <li>
              Confidence builds success which uplifts both soul and structure.
            </li>
            <li>“For worse” is not an option—only for better.</li>
            <li>Truth, dignity, honor and purpose guide our every step.</li>
            <li>
              With Prime, no individuals Elements go undiscovered. Gifts and
              talents? Prime helps discover each and every one, aligning them
              with their purposes.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
