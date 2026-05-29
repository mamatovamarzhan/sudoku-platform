"use client";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeDecorations } from "@/components/theme/ThemeDecorations";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeDecorations />
      {children}
    </ThemeProvider>
  );
}
