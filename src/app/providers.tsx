'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import SWRProvider from '@/hooks/SWRProvider';
import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SWRProvider>
          {children}
        </SWRProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
