"use client";

import type { CellValue } from "@/lib/sudoku";

interface NumberPadProps {
  onInput: (value: CellValue) => void;
  onClear: () => void;
  validMoves?: CellValue[];
  disabled?: boolean;
}

const numbers: CellValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function NumberPad({
  onInput,
  onClear,
  validMoves,
  disabled = false,
}: NumberPadProps) {
  const hasSelection = validMoves !== undefined;

  return (
    <div className="flex flex-col gap-3 w-full animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
        {numbers.map((num) => {
          const isInvalid = hasSelection && !validMoves.includes(num);
          const isDisabled = disabled || isInvalid;

          return (
            <button
              key={num}
              type="button"
              disabled={isDisabled}
              onClick={() => onInput(num)}
              aria-label={`Enter ${num}${isInvalid ? " (invalid)" : ""}`}
              className={`
                group relative aspect-square flex items-center justify-center
                rounded-xl text-sm sm:text-base font-semibold
                transition-all duration-200 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                active:scale-90
                ${
                  isInvalid
                    ? "glass-panel opacity-30 text-themed-muted cursor-not-allowed"
                    : `
                      glass-panel text-themed-primary/80
                      hover:text-themed-primary hover:border-themed-glow
                      hover:bg-themed-glass-hover hover:shadow-glow-sm
                      hover:scale-105
                    `
                }
                disabled:opacity-30 disabled:pointer-events-none disabled:scale-100
              `}
            >
              <span className="relative z-[1]">{num}</span>
              {!isInvalid && !disabled && (
                <span
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 numberpad-hover-gradient transition-opacity duration-300 pointer-events-none"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onClear}
        className="
          py-3 rounded-xl glass-panel
          text-sm font-medium text-themed-muted
          transition-all duration-200
          hover:text-themed-primary hover:bg-themed-glass-hover
          active:scale-[0.98]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
          disabled:opacity-30 disabled:pointer-events-none
        "
      >
        Clear cell
      </button>
    </div>
  );
}
