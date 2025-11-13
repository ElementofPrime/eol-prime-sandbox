// src/components/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import useSWR from "swr";
import { useMemo } from "react";
import { EOLButton } from "@/components/EOLButton";
import ThemeToggle from "@/components/ThemeToggle";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function NavPill({
  href,
  currentPath,
  children,
}: {
  href: string;
  currentPath: string;
  children: React.ReactNode;
}) {
  const active = currentPath === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 border-2",
        active
          ? "bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-500/25 ring-4 ring-cyan-500/30"
          : "bg-white/60 dark:bg-black/60 border-transparent text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-black/80 hover:border-cyan-500/50",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/50"
      )}
    >
      {children}
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname() || "/";
  const { data: session } = useSession();
  const email = useMemo(
    () => session?.user?.email?.toLowerCase() ?? "",
    [session?.user?.email]
  );
  const { data } = useSWR(
    email ? `/api/profile?email=${encodeURIComponent(email)}` : null,
    fetcher
  );
  const displayName = (data?.profile?.displayName as string | undefined) || "";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-linear-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* LEFT — Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-sky-600 bg-clip-text text-transparent">
              EOL-Prime Labs OS
            </div>
          </Link>

          {/* CENTER — Pills */}
          <div className="hidden md:flex items-center justify-center gap-3">
            {[
              { href: "/", label: "Home" },
              { href: "/chat", label: "Chat" },
              { href: "/journal", label: "Journal" },
              { href: "/to-do", label: "To-Do" },
              { href: "/reminders", label: "Reminders" },
              { href: "/fix-it", label: "Fix-It" },
              { href: "/core", label: "Core" },
              { href: "/about", label: "About" },
              // TREE OF LIFE — ADDED
              { href: "/tree-of-life", label: "Tree of Life" },
            ].map(({ href, label }) => (
              <NavPill key={href} href={href} currentPath={pathname}>
                {label}
              </NavPill>
            ))}
          </div>

          {/* RIGHT — Theme + Auth */}
          <div className="flex items-center justify-end gap-4">
            <ThemeToggle />
            {displayName && (
              <span className="hidden lg:block text-sm font-medium text-cyan-400">
                Welcome, {displayName}
              </span>
            )}
            {!session ? (
              <EOLButton variant="primary" onClick={() => signIn()}>
                Sign In
              </EOLButton>
            ) : (
              <div className="flex items-center gap-3">
                <NavPill href="/settings" currentPath={pathname}>
                  Settings
                </NavPill>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-rose-400 hover:text-rose-300 transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
