// src/components/EOLButton.tsx
"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type BaseProps = {
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = BaseProps &
  ComponentPropsWithoutRef<"button"> & {
    asChild?: false | undefined;
  };

type SlotProps = BaseProps & {
  asChild: true;
};

type EOLButtonProps = ButtonProps | SlotProps;

export function EOLButton(props: EOLButtonProps) {
  const { variant = "primary", className, children, asChild, ...rest } = props;
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary"
          ? "bg-cyan-600 text-white hover:bg-cyan-500 active:bg-cyan-700"
          : "bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-800",
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}
