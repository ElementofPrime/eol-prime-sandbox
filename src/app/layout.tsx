import '../styles/globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Providers from './providers'; // ← This will be your SessionProvider wrapper

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Element of Life',
  description: 'Illuminate with intelligence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black text-white font-sans`}>
        <Providers>
          <div className="w-full max-w-5xl mx-auto p-4">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
