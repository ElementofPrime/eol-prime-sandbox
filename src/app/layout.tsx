import '@/styles/globals.css';
import type { ReactNode } from 'react';
import NavBar from '@/components/NavBar';
import Providers from './providers';
import { Inter, Great_Vibes } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'], variable: '--font-greatvibes' });

export const metadata = { title: 'Element of Life — Prime OS' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${greatVibes.variable}`}>
      <body className="bg-baseLight dark:bg-baseDark text-black dark:text-white min-h-screen flex flex-col">
        <Providers>
          <NavBar />
          <main className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 md:px-6 py-6 md:py-10 relative overflow-hidden">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
