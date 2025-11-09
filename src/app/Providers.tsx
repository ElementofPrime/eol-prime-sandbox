"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import SWRProvider from "@/hooks/SWRProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SWRProvider>
        <ThemeProvider
          attribute="class" // sets <html class="light|dark">
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark"]}
        >
          {children}
        </ThemeProvider>
      </SWRProvider>
    </SessionProvider>
  );
}
