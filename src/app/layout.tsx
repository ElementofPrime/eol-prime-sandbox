'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import NavBar from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-baseLight dark:bg-baseDark text-black dark:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <NavBar />
            <main className="min-h-screen">{children}</main>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
