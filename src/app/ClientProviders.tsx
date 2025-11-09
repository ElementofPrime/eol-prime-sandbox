// src/app/ClientProviders.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import BackgroundDecor from "@/components/BackgroundDecor";
import NavBar from "@/components/NavBar";
import ClientLayout from "@/components/ClientLayout";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SessionProvider>
        <BackgroundDecor />
        <ClientLayout>
          <main className="relative z-10 flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-1">{children}</div>
          </main>
        </ClientLayout>
      </SessionProvider>
    </ThemeProvider>
  );
}
