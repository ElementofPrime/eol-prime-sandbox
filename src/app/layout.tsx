import "./globals.css";
import { Inter, Great_Vibes } from "next/font/google";
import Providers from "./Providers";
import AppShell from "@/components/AppShell";

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

export const metadata = {
  title: "Element of Life",
  description: "Your sanctuary for growth, purpose, and legacy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${greatVibes.variable} font-sans min-h-screen antialiased
                    bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900`}
      >
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
