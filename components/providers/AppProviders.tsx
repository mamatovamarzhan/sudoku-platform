"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeDecorations } from "@/components/theme/ThemeDecorations";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ThemeDecorations />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
