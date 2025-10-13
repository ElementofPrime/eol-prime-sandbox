import "../../styles/globals.css";
import type { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import Providers from "./providers";
import { Inter, Great_Vibes } from "next/font/google";
import BackgroundDecor from "@/components/BackgroundDecor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-greatvibes" });

export const metadata = { title: "Element of Life — Prime OS" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${greatVibes.variable}`}>
      {/* Tailwind is set to darkMode:'class'; ThemeToggle should add/remove 'dark' on <html> */}
      <body className="bg-slate-950 text-slate-100">
        <BackgroundDecor />
        <Providers>
          <NavBar />
          <main className="relative z-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
