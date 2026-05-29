"use client";

export function ThemeDecorations() {
  return (
    <>
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-60" aria-hidden />
      <div
        className="theme-orb theme-orb-primary fixed top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-float"
        aria-hidden
      />
      <div
        className="theme-orb theme-orb-secondary fixed bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-float"
        style={{ animationDelay: "-3s" }}
        aria-hidden
      />
    </>
  );
}
