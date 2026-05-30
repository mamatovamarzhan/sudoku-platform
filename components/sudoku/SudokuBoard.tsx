"use client";

import { SudokuCell, shouldHighlightCell } from "./SudokuCell";
import type { Board, CellPosition } from "@/lib/sudoku";

interface SudokuBoardProps {
  board: Board;
  given: boolean[][];
  selected: CellPosition | null;
  notes: Record<string, Set<number>>;
  getCellStatus: (row: number, col: number) => "given" | "user" | "error" | "empty";
  onSelect: (row: number, col: number) => void;
}

export function SudokuBoard({
  board,
  given,
  selected,
  notes,
  getCellStatus,
  onSelect,
}: SudokuBoardProps) {
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
        aria-label="Sudoku board"
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
                notes={notes[`${rowIndex}-${colIndex}`] ?? new Set()}
                onSelect={onSelect}
                selected={selected}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
