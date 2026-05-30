"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-board-glow opacity-40 blur-3xl animate-shimmer" />
        <div className="absolute top-20 right-0 w-72 h-72 rounded-full theme-orb-primary blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full theme-orb-secondary blur-3xl animate-float" style={{ animationDelay: "-2s" }} />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-medium text-themed-muted mb-8 animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
          Premium Sudoku — Free to play
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
          <span className="gradient-text">Master the grid.</span>
          <br />
          <span className="text-themed-primary">One cell at a time.</span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-themed-muted mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          A stunning Sudoku experience with three premium themes, daily challenges,
          global leaderboards, and buttery-smooth gameplay.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Link href="/game">
            <Button variant="primary" size="lg" className="min-w-[180px]">
              Play Now
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </Link>
          <Link href="/daily">
            <Button variant="secondary" size="lg" className="min-w-[180px]">
              Daily Challenge
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto text-left animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {[
            {
              href: "/game/samurai",
              title: "Samurai Sudoku",
              description:
                "Five overlapping grids form one larger cross-shaped puzzle with shared 3x3 boxes.",
            },
            {
              href: "/game/evenodd",
              title: "Even/Odd Sudoku",
              description:
                "Use the shaded parity pattern to place even digits and keep every white cell odd.",
            },
          ].map((mode) => (
            <Link
              key={mode.href}
              href={mode.href}
              className="group relative overflow-hidden rounded-2xl glass-card-lg p-5 transition-all duration-300 hover:-translate-y-1 hover:border-themed-glow hover:shadow-glow-sm"
            >
              <div className="absolute inset-0 bg-gradient-premium opacity-50 transition-opacity duration-300 group-hover:opacity-80" aria-hidden />
              <div className="relative z-[1]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-themed-muted">
                  New variant
                </p>
                <h2 className="mt-2 text-xl font-bold gradient-text">
                  {mode.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-themed-muted">
                  {mode.description}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-themed-primary">
                  Play mode
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.35s" }}>
          {[
            { value: "3", label: "Themes" },
            { value: "∞", label: "Puzzles" },
            { value: "9×9", label: "Classic grid" },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel rounded-xl py-4 px-2">
              <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-themed-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
