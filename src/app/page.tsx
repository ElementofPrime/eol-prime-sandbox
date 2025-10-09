// src/app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="container mx-auto max-w-5xl px-4 pt-12 md:pt-16">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo.png" // or your crest path
            alt="Element of Life"
            width={220}       // bump size here
            height={220}
            priority
            className="drop-shadow-sm"
          />
          <h1 className="mt-6 text-2xl md:text-3xl font-semibold tracking-tight">
            You Weren’t Meant to Do This Alone
          </h1>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-neutral-600">
            Prime keeps you focused, organized, and progressing—one clear step at a time.
          </p>
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className="container mx-auto max-w-5xl px-4 pb-16 md:pb-24">
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* your existing tiles/components go here unchanged */}
        </div>
      </section>
    </main>
  );
}
