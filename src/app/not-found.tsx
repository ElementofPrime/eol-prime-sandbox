// src/app/not-found.tsx  ← **Server Component (NO 'use client')**
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Page Not Found
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Could not find requested resource.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center px-6 py-3 text-base font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
      >
        Return Home
      </Link>
    </main>
  );
}