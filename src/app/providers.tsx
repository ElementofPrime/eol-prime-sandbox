'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"        // toggles the `class` on <html>
      defaultTheme="dark"      // start in dark
      enableSystem={true}      // allow system preference
      storageKey="eol-theme"   // persist in localStorage
    >
      {children}
    </ThemeProvider>
  );
}
