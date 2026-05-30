"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface GameMode {
  id: "classic" | "samurai" | "evenodd";
  label: string;
  title: string;
  description: string;
  href: string;
  modalTitle: string;
  rules: string[];
  actionLabel: string;
}

const GAME_MODES: GameMode[] = [
  {
    id: "classic",
    label: "CLASSIC",
    title: "Classic Sudoku",
    description:
      "The original 9×9 grid. Fill every row, column, and 3×3 box with digits 1–9. No repeats allowed.",
    href: "/game",
    modalTitle: "How to play Classic Sudoku",
    rules: [
      "Fill the 9×9 grid so every row contains digits 1–9",
      "Every column must also contain digits 1–9",
      "Every 3×3 box must contain digits 1–9",
      "No digit can repeat in any row, column, or box",
      "Gray cells are given — you cannot change them",
      "Use Notes mode to write candidates in empty cells",
      "Use Hints if you get stuck (3 per game)",
    ],
    actionLabel: "Play Classic →",
  },
  {
    id: "samurai",
    label: "SAMURAI",
    title: "Samurai Sudoku",
    description:
      "Five overlapping grids form one larger cross-shaped puzzle with shared 3×3 boxes.",
    href: "/game/samurai",
    modalTitle: "How to play Samurai Sudoku",
    rules: [
      "Five 9×9 grids overlap at their corner 3×3 boxes",
      "Solve all five grids simultaneously",
      "Each grid follows classic Sudoku rules",
      "The overlapping boxes are shared between two grids",
      "Start from the center grid and work outward",
      "Much harder than classic — recommended for advanced players",
    ],
    actionLabel: "Play Samurai →",
  },
  {
    id: "evenodd",
    label: "EVEN/ODD",
    title: "Even/Odd Sudoku",
    description:
      "Use the shaded parity pattern to place even digits and keep every white cell odd.",
    href: "/game/evenodd",
    modalTitle: "How to play Even/Odd Sudoku",
    rules: [
      "Standard 9×9 Sudoku rules apply",
      "Shaded cells must contain EVEN numbers: 2, 4, 6, 8",
      "White cells must contain ODD numbers: 1, 3, 5, 7, 9",
      "The even/odd pattern is fixed and shown on the board",
      "If you place a wrong parity digit the cell turns red",
      "Use this constraint as a strategy to solve faster",
    ],
    actionLabel: "Play Even/Odd →",
  },
];

export function Hero() {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  useEffect(() => {
    if (!selectedMode) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedMode(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMode]);

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

        <div className="mt-12 grid gap-4 md:grid-cols-3 max-w-5xl mx-auto text-left animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {GAME_MODES.map((mode) => (
            <article
              key={mode.id}
              className="group relative overflow-hidden rounded-2xl glass-card-lg p-5 transition-all duration-300 hover:-translate-y-1 hover:border-themed-glow hover:shadow-glow-sm"
            >
              <div className="absolute inset-0 bg-gradient-premium opacity-50 transition-opacity duration-300 group-hover:opacity-80" aria-hidden />
              <div className="relative z-[1] flex h-full flex-col">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-themed-muted">
                  {mode.label}
                </p>
                <h2 className="mt-2 text-xl font-bold gradient-text">
                  {mode.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-themed-muted">
                  {mode.description}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedMode(mode)}
                  className="
                    mt-4 inline-flex items-center self-start text-sm font-semibold text-themed-primary
                    transition-colors hover:text-accent-hover
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                    focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-lg
                  "
                >
                  Play mode
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </article>
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

      {selectedMode && (
        <GameModeModal
          mode={selectedMode}
          onClose={() => setSelectedMode(null)}
        />
      )}
    </section>
  );
}

function GameModeModal({
  mode,
  onClose,
}: {
  mode: GameMode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${mode.id}-rules-title`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl glass-card-lg bg-gradient-premium p-6 sm:p-8 text-left"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-0 rounded-3xl bg-card-overlay pointer-events-none" aria-hidden />

        <div className="relative z-[1]">
          <button
            type="button"
            onClick={onClose}
            className="
              absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-xl glass-panel
              text-themed-muted transition-colors hover:text-themed-primary hover:bg-themed-glass-hover
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
            "
            aria-label="Close rules modal"
          >
            X
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-themed-muted">
            {mode.label}
          </p>
          <h2
            id={`${mode.id}-rules-title`}
            className="mt-2 pr-12 text-2xl sm:text-3xl font-bold gradient-text"
          >
            {mode.modalTitle}
          </h2>

          <ul className="mt-6 space-y-3">
            {mode.rules.map((rule) => (
              <li key={rule} className="glass-panel flex gap-3 px-4 py-3 text-sm text-themed-muted">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-themed-primary">
                  ✓
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex justify-end">
            <Link
              href={mode.href}
              onClick={onClose}
              className="
                btn-glow inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5
                bg-gradient-accent bg-[length:200%_200%] text-base font-semibold text-white
                border border-white/20 shadow-btn-primary animate-gradient-shift
                transition-all duration-300 ease-out hover:shadow-glow hover:border-white/30
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-[0.96]
              "
            >
              {mode.actionLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
