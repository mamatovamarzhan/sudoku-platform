"use client";

import { memo } from "react";
import { isInSameBox } from "@/lib/sudoku";
import type { CellPosition } from "@/lib/sudoku";

interface SudokuCellProps {
  row: number;
  col: number;
  value: number;
  status: "given" | "user" | "error" | "empty";
  isSelected: boolean;
  isHighlighted: boolean;
  isSameNumber: boolean;
  isGiven: boolean;
  onSelect: (row: number, col: number) => void;
  selected: CellPosition | null;
  notes?: Set<number>;
  className?: string;
}

function SudokuCellComponent({
  row,
  col,
  value,
  status,
  isSelected,
  isHighlighted,
  isSameNumber,
  isGiven,
  onSelect,
  notes = new Set<number>(),
  className = "",
}: SudokuCellProps) {
  const thickRight = col === 2 || col === 5;
  const thickBottom = row === 2 || row === 5;
  const thickLeft = col === 0 || col === 3 || col === 6;
  const thickTop = row === 0 || row === 3 || row === 6;

  return (
    <button
      type="button"
      onClick={() => onSelect(row, col)}
      className={`
        group relative flex items-center justify-center
        aspect-square w-full
        text-base sm:text-lg md:text-xl
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:z-10
        focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60
        border-[color:var(--color-border)]
        ${thickRight ? "border-r-2 border-r-[color:var(--color-border-strong)]" : "border-r"}
        ${thickBottom ? "border-b-2 border-b-[color:var(--color-border-strong)]" : "border-b"}
        ${thickLeft ? "border-l-2 border-l-[color:var(--color-border-strong)]" : ""}
        ${thickTop ? "border-t-2 border-t-[color:var(--color-border-strong)]" : ""}
        ${className}
        ${isSelected ? "bg-cell-selected z-[2] shadow-cell-selected animate-pulse-glow" : ""}
        ${!isSelected && isHighlighted ? "bg-cell-highlight" : ""}
        ${!isSelected && !isHighlighted && isSameNumber ? "bg-cell-same" : ""}
        ${!isSelected && !isHighlighted && !isSameNumber ? "hover:bg-themed-glass-hover" : ""}
        ${status === "given" ? "text-cell-given" : ""}
        ${status === "user" ? "text-cell-user" : ""}
        ${status === "error" ? "text-cell-error" : ""}
        ${status === "empty" ? "text-transparent" : ""}
      `}
      aria-label={`Row ${row + 1}, column ${col + 1}${value ? `, value ${value}` : ", empty"}`}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <span
          className="absolute inset-0 rounded-sm ring-1 ring-inset ring-[color:var(--color-ring-selected)] pointer-events-none"
          aria-hidden
        />
      )}

      {value !== 0 && (
        <span
          className={`
            relative z-[1] animate-fade-in
            ${isGiven ? "font-semibold tracking-tight" : "font-medium"}
            ${status === "user" ? "user-cell-glow" : ""}
            ${status === "error" ? "line-through decoration-rose-400/70" : ""}
            ${isSelected ? "scale-110 transition-transform duration-200" : "group-hover:scale-105 transition-transform duration-150"}
          `}
        >
          {value}
        </span>
      )}

      {value === 0 && notes.size > 0 && (
        <span className="grid grid-cols-3 gap-0.5 w-full px-1 text-[0.45rem] sm:text-[0.55rem] leading-none text-themed-muted opacity-80">
          {Array.from({ length: 9 }, (_, index) => {
            const note = index + 1;
            return (
              <span key={note} className="h-2 sm:h-2.5 flex items-center justify-center">
                {notes.has(note) ? note : ""}
              </span>
            );
          })}
        </span>
      )}
    </button>
  );
}

export const SudokuCell = memo(SudokuCellComponent);

export function shouldHighlightCell(
  row: number,
  col: number,
  selected: CellPosition | null
): boolean {
  if (!selected) return false;
  if (row === selected.row && col === selected.col) return false;
  if (row === selected.row || col === selected.col) return true;
  return isInSameBox(row, col, selected.row, selected.col);
}
