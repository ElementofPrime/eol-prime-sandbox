import "./../styles/globals.css";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = { title: "Element of Life — Prime OS" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-baseLight dark:bg-baseDark text-black dark:text-white min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <header className="w-full flex justify-between items-center px-8 py-4 border-b border-cyan-500 bg-transparent">
          <h1 className="text-xl font-semibold text-cyan-400">
            Element of Life — <span className="text-white">Prime OS</span>
          </h1>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/core" className="hover:text-cyan-400 transition">Core</Link>
            <Link href="/about" className="hover:text-cyan-400 transition">About</Link>
            <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
            <ThemeToggle />
          </nav>
        </header>

        {/* Page Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
