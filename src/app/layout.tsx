import './globals.css';
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Element of Life',
  description: 'Illuminate with intelligence.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[rgb(252,252,251)]">{children}</body>
    </html>
  );
}
