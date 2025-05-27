import '../styles/globals.css'; // ← Important: Adjusted path for styles/globals.css
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

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
      <body className={`${inter.className} min-h-screen bg-black text-white font-sans flex items-center justify-center`}>
        <div className="w-full max-w-5xl p-4">{children}</div>
      </body>
    </html>
  );
}
