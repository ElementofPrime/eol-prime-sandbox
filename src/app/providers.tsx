'use client';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"      // <-- puts 'dark' on <html>
        defaultTheme="dark"    // <-- open in dark by default
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
