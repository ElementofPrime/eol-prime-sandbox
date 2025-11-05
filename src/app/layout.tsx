// src/app/layout.tsx

import "./globals.css";
import { Inter, Great_Vibes } from "next/font/google";
import Providers from "./providers";
import BackgroundDecor from "@/components/BackgroundDecor";
import NavBar from "@/components/NavBar";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-greatvibes",
  display: "swap",
});

// METADATA — SERVER ONLY
export const metadata = {
  title: "Element of Life",
  description: "Your sanctuary for growth, purpose, and legacy.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Element of Life",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.variable} ${greatVibes.variable} font-sans min-h-screen antialiased bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900`}
      >
        <Providers>
          <BackgroundDecor />
          <ClientLayout>
            <main className="relative z-10 flex flex-col min-h-screen">
              <NavBar />
              <div className="flex-1">{children}</div>
            </main>
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
