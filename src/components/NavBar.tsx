"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";
import { useSession, signIn, signOut } from "next-auth/react";
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
        "rounded-full px-3 py-1.5 text-sm font-medium transition-colors border",
        // base surfaces (light/dark)
        active
          ? "bg-cyan-600/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 hover:bg-cyan-600/25"
          : "bg-white/40 dark:bg-black/40 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/15",
        // focus ring for a11y
        "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
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
    () => (session?.user?.email ? session.user.email.toLowerCase() : ""),
    [session?.user?.email]
  );
  const { data } = useSWR(
    email ? `/api/profile?email=${encodeURIComponent(email)}` : null,
    fetcher
  );
  const displayName = (data?.profile?.displayName as string | undefined) || "";

  return (
    <div className="absolute inset-x-0 top-0 z-50 bg-transparent">
      {/* Grid keeps center pills perfectly centered regardless of left/right widths */}
      <nav
        className={cx(
          "mx-auto w-full max-w-6xl px-4 py-4",
          "grid grid-cols-[1fr_auto_1fr] items-center gap-3"
        )}
      >
        {/* LEFT — brand */}
        <div className="min-w-0">
          <Link
            href="/"
            className={cx(
              "block truncate font-semibold tracking-wide",
              "text-slate-900 dark:text-slate-100",
              "hover:text-cyan-600 dark:hover:text-cyan-300",
              "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            )}
            title="EOL—Prime Labs OS"
          >
            EOL-Prime Labs OS
          </Link>
        </div>

        {/* CENTER — pills (hidden on xs) */}
        <div className="hidden sm:flex items-center justify-center gap-2">
          <NavPill href="/" currentPath={pathname}>
            Home
          </NavPill>
          <NavPill href="/chat" currentPath={pathname}>
            Chat
          </NavPill>
          <NavPill href="/journal" currentPath={pathname}>
            Journal
          </NavPill>
          <NavPill href="/ToDo" currentPath={pathname}>
            ToDo
          </NavPill>
          <NavPill href="/reminders" currentPath={pathname}>
            Reminders
          </NavPill>
          <NavPill href="/fix-it" currentPath={pathname}>
            Fix-It
          </NavPill>
          <NavPill href="/core" currentPath={pathname}>
            Core
          </NavPill>
          <NavPill href="/about" currentPath={pathname}>
            About
          </NavPill>
        </div>

        {/* RIGHT — theme + auth */}
        <div className="flex items-center justify-end gap-3">
          <ThemeToggle />
          {displayName && (
            <Link
              href="/settings"
              className={cx(
                "hidden sm:inline rounded-full px-3 py-1.5 text-sm font-medium",
                "border border-cyan-500/30 text-cyan-700 dark:text-cyan-300",
                "hover:bg-cyan-600/15",
                "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              )}
              title="Edit profile"
            >
              Welcome back, {displayName}
            </Link>
          )}

          {!session ? (
            <button
              onClick={() => signIn()}
              className={cx(
                "rounded-full px-4 py-1.5 text-sm font-semibold",
                "bg-cyan-700 text-white hover:bg-cyan-600 active:bg-cyan-700",
                "dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:active:bg-cyan-600",
                "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              )}
            >
              Sign In
            </button>
          ) : (
            <>
              <NavPill href="/settings" currentPath={pathname}>
                Settings
              </NavPill>
              <button
                onClick={() => signOut()}
                className={cx(
                  "rounded-full px-3 py-1.5 text-sm font-medium",
                  "border border-black/10 dark:border-white/10",
                  "bg-white/40 dark:bg-black/40 text-slate-700 dark:text-slate-300",
                  "hover:bg-black/5 dark:hover:bg-white/15",
                  "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
                )}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
