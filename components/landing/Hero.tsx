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
