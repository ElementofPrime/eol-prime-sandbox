import '../styles/globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Element of Life',
  description: 'Illuminate with intelligence.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-black text-white font-sans ${inter.variable}`}>
        <Providers>
          <main className="w-full max-w-5xl mx-auto px-4 py-6 min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
