"use client";

import { SudokuCell, shouldHighlightCell } from "./SudokuCell";
import type { Board, CellPosition } from "@/lib/sudoku";

interface EvenOddBoardProps {
  board: Board;
  given: boolean[][];
  evenMask: boolean[][];
  selected: CellPosition | null;
  notes: Record<string, Set<number>>;
  getCellStatus: (row: number, col: number) => "given" | "user" | "error" | "empty";
  onSelect: (row: number, col: number) => void;
}

export function EvenOddBoard({
  board,
  given,
  evenMask,
  selected,
  notes,
  getCellStatus,
  onSelect,
}: EvenOddBoardProps) {
  const selectedValue =
    selected && board[selected.row][selected.col] !== 0
      ? board[selected.row][selected.col]
      : null;

  return (
    <div className="relative w-full max-w-[min(100vw-2rem,28rem)] sm:max-w-md animate-slide-up">
      <div
        className="absolute -inset-px rounded-[1.35rem] bg-gradient-board-glow blur-sm pointer-events-none"
        aria-hidden
      />

      <div
        className="
          relative grid grid-cols-9 gap-0
          rounded-[1.25rem] overflow-hidden
          glass-card-lg
          bg-gradient-premium
          animate-scale-in
        "
        role="grid"
        aria-label="Even/Odd Sudoku board"
      >
        <div
          className="absolute inset-0 bg-board-overlay backdrop-blur-sm pointer-events-none"
          aria-hidden
        />

        {board.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isSelected =
              selected?.row === rowIndex && selected?.col === colIndex;
            const isHighlighted = shouldHighlightCell(
              rowIndex,
              colIndex,
              selected
            );
            const isSameNumber =
              selectedValue !== null &&
              value === selectedValue &&
              !isSelected;

            return (
              <SudokuCell
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                value={value}
                status={getCellStatus(rowIndex, colIndex)}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                isSameNumber={isSameNumber}
                isGiven={given[rowIndex][colIndex]}
                onSelect={onSelect}
                selected={selected}
                notes={notes[`${rowIndex}-${colIndex}`] ?? new Set<number>()}
                className={evenMask[rowIndex][colIndex] ? "bg-even-cell" : ""}
              />
            );
          })
        )}
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-themed-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-even-cell border border-[color:var(--color-border)]" />
          Even cells
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-themed-glass border border-[color:var(--color-border)]" />
          Odd cells
        </span>
      </div>
    </div>
  );
}
