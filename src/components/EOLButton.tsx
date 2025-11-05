// src/components/EOLButton.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Loader2, LogIn, LogOut, CheckCircle2 } from "lucide-react";

type EOLButtonProps =
  | {
      variant: "auth";
      loadingText?: string;
    }
  | {
      variant: "primary" | "secondary";
      onClick?: () => void;
      disabled?: boolean;
      children: React.ReactNode;
      className?: string;
    };

export default function EOLButton(props: EOLButtonProps) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (props.variant === "auth") {
    if (loading) {
      return (
        <button
          disabled
          className="btn-primary flex items-center gap-2 opacity-70"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          {props.loadingText || "Loading..."}
        </button>
      );
    }

    if (!session) {
      return (
        <button
          onClick={() => signIn()}
          className="btn-primary flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </button>
      );
    }

    return (
      <button
        onClick={() => signOut()}
        className="btn-primary flex items-center gap-2 bg-rose-600 hover:bg-rose-500"
        title={session.user?.email ?? undefined}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    );
  }

  const { variant, children, onClick, disabled, className } = props;
  const base = "btn-primary flex items-center justify-center gap-2";
  const variantClass =
    variant === "secondary"
      ? "bg-zinc-600 hover:bg-zinc-500 text-slate-300"
      : "bg-cyan-600 hover:bg-cyan-500";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variantClass} ${className || ""}`}
    >
      {children}
    </button>
  );
}
