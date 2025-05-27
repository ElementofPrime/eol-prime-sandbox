'use client';

import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import NavBar from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b7a57" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="EOL" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <title>Element of Life</title>
      </head>
      <body className={`${inter.className} bg-baseLight dark:bg-baseDark text-black dark:text-white transition-colors duration-300`}>
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
