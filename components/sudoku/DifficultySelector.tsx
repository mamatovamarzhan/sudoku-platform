"use client";

import { DIFFICULTY_LABELS, type Difficulty } from "@/lib/sudoku";

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export function DifficultySelector({
  value,
  onChange,
  disabled = false,
}: DifficultySelectorProps) {
  return (
    <div
      className="flex rounded-xl glass-panel p-1"
      role="radiogroup"
      aria-label="Difficulty"
    >
      {difficulties.map((d) => (
        <button
          key={d}
          type="button"
          role="radio"
          aria-checked={value === d}
          disabled={disabled}
          onClick={() => onChange(d)}
          className={`
            relative px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg
            transition-all duration-300 ease-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
            disabled:opacity-40 disabled:cursor-not-allowed
            ${
              value === d
                ? "bg-gradient-accent text-white shadow-glow-sm border border-white/20"
                : "text-themed-muted hover:text-themed-primary hover:bg-themed-glass-hover"
            }
          `}
        >
          {DIFFICULTY_LABELS[d]}
        </button>
      ))}
    </div>
  );
}
