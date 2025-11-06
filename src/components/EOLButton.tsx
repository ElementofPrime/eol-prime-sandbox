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

  // ONE STRING PER VARIANT — NO ARRAYS
  const primaryClasses =
    "bg-cyan-600 text-white hover:bg-cyan-500 active:bg-cyan-700 " +
    "dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:active:bg-cyan-700";

  const secondaryClasses =
    "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 " +
    "dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:active:bg-slate-900";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" ? primaryClasses : secondaryClasses,
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}
