'use client';

import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import NavBar from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b7a57" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.png" />
        <title>Element of Life</title>
      </head>
      <body className={`${inter.className} bg-white dark:bg-black text-black dark:text-white transition-colors duration-300`}>
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
