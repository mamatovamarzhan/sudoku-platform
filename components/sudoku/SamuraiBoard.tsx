"use client";

import type { CellPosition, CellValue, SamuraiBoard as SamuraiBoardData } from "@/lib/sudoku";
import {
  getSamuraiCellGrids,
  isSamuraiCellActive,
  SAMURAI_SIZE,
} from "@/lib/sudoku";

interface SamuraiBoardProps {
  board: SamuraiBoardData;
  given: boolean[][];
  selected: CellPosition | null;
  notes: Record<string, CellValue[]>;
  getCellStatus: (row: number, col: number) => "given" | "user" | "error" | "empty";
  onSelect: (row: number, col: number) => void;
}

export function SamuraiBoard({
  board,
  given,
  selected,
  notes,
  getCellStatus,
  onSelect,
}: SamuraiBoardProps) {
  const selectedValue =
    selected && board[selected.row][selected.col] !== 0
      ? board[selected.row][selected.col]
      : null;

  return (
    <div className="relative w-full max-w-[min(100vw-1rem,52rem)] animate-slide-up">
      <div
        className="absolute -inset-px rounded-[1.35rem] bg-gradient-board-glow blur-sm pointer-events-none"
        aria-hidden
      />

      <div
        className="
          relative grid gap-0
          rounded-[1.25rem] overflow-hidden
          glass-card-lg bg-gradient-premium animate-scale-in p-1
        "
        style={{ gridTemplateColumns: `repeat(${SAMURAI_SIZE}, minmax(0, 1fr))` }}
        role="grid"
        aria-label="Samurai Sudoku board"
      >
        <div
          className="absolute inset-0 bg-board-overlay backdrop-blur-sm pointer-events-none"
          aria-hidden
        />

        {board.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            if (!isSamuraiCellActive(rowIndex, colIndex)) {
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="relative aspect-square"
                  aria-hidden
                />
              );
            }

            const isSelected =
              selected?.row === rowIndex && selected?.col === colIndex;
            const isHighlighted = shouldHighlightSamuraiCell(
              rowIndex,
              colIndex,
              selected
            );
            const isSameNumber =
              selectedValue !== null &&
              value === selectedValue &&
              !isSelected;
            const status = getCellStatus(rowIndex, colIndex);

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                onClick={() => onSelect(rowIndex, colIndex)}
                className={`
                  group relative flex aspect-square w-full items-center justify-center
                  text-[0.62rem] sm:text-xs md:text-sm
                  transition-all duration-200 ease-out
                  focus-visible:outline-none focus-visible:z-10
                  focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60
                  border-[color:var(--color-border)]
                  ${getSamuraiBorderClasses(rowIndex, colIndex)}
                  ${isSelected ? "bg-cell-selected z-[2] shadow-cell-selected animate-pulse-glow" : ""}
                  ${!isSelected && isHighlighted ? "bg-cell-highlight" : ""}
                  ${!isSelected && !isHighlighted && isSameNumber ? "bg-cell-same" : ""}
                  ${!isSelected && !isHighlighted && !isSameNumber ? "hover:bg-themed-glass-hover" : ""}
                  ${status === "given" ? "text-cell-given" : ""}
                  ${status === "user" ? "text-cell-user" : ""}
                  ${status === "error" ? "text-cell-error" : ""}
                  ${status === "empty" ? "text-transparent" : ""}
                `}
                aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}${
                  value ? `, value ${value}` : ", empty"
                }`}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <span
                    className="absolute inset-0 rounded-sm ring-1 ring-inset ring-[color:var(--color-ring-selected)] pointer-events-none"
                    aria-hidden
                  />
                )}

                {value !== null && value !== 0 && (
                  <span
                    className={`
                      relative z-[1] animate-fade-in
                      ${given[rowIndex][colIndex] ? "font-semibold tracking-tight" : "font-medium"}
                      ${status === "user" ? "user-cell-glow" : ""}
                      ${status === "error" ? "line-through decoration-rose-400/70" : ""}
                      ${isSelected ? "scale-110 transition-transform duration-200" : "group-hover:scale-105 transition-transform duration-150"}
                    `}
                  >
                    {value}
                  </span>
                )}

                {(value === 0 || value === null) &&
                  (notes[`${rowIndex}-${colIndex}`]?.length ?? 0) > 0 && (
                    <span className="grid grid-cols-3 gap-px w-full px-0.5 text-[0.35rem] sm:text-[0.42rem] leading-none text-themed-muted/80">
                      {Array.from({ length: 9 }, (_, index) => {
                        const note = index + 1;
                        return (
                          <span key={note} className="h-1.5 sm:h-2 flex items-center justify-center">
                            {notes[`${rowIndex}-${colIndex}`]?.includes(note as CellValue)
                              ? note
                              : ""}
                          </span>
                        );
                      })}
                    </span>
                  )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function shouldHighlightSamuraiCell(
  row: number,
  col: number,
  selected: CellPosition | null
): boolean {
  if (!selected) return false;
  if (row === selected.row && col === selected.col) return false;

  const cellGrids = getSamuraiCellGrids(row, col);
  const selectedGrids = getSamuraiCellGrids(selected.row, selected.col);

  return cellGrids.some((grid) => {
    if (!selectedGrids.some((selectedGrid) => selectedGrid.id === grid.id)) {
      return false;
    }

    const localRow = row - grid.rowOffset;
    const localCol = col - grid.colOffset;
    const selectedLocalRow = selected.row - grid.rowOffset;
    const selectedLocalCol = selected.col - grid.colOffset;

    if (localRow === selectedLocalRow || localCol === selectedLocalCol) {
      return true;
    }

    return (
      Math.floor(localRow / 3) === Math.floor(selectedLocalRow / 3) &&
      Math.floor(localCol / 3) === Math.floor(selectedLocalCol / 3)
    );
  });
}

function getSamuraiBorderClasses(row: number, col: number): string {
  const grids = getSamuraiCellGrids(row, col);
  const thickLeft = grids.some((grid) => {
    const localCol = col - grid.colOffset;
    return localCol === 0 || localCol === 3 || localCol === 6;
  });
  const thickTop = grids.some((grid) => {
    const localRow = row - grid.rowOffset;
    return localRow === 0 || localRow === 3 || localRow === 6;
  });
  const thickRight = grids.some((grid) => {
    const localCol = col - grid.colOffset;
    return localCol === 2 || localCol === 5 || localCol === 8;
  });
  const thickBottom = grids.some((grid) => {
    const localRow = row - grid.rowOffset;
    return localRow === 2 || localRow === 5 || localRow === 8;
  });

  return [
    thickLeft ? "border-l-2 border-l-[color:var(--color-border-strong)]" : "border-l",
    thickTop ? "border-t-2 border-t-[color:var(--color-border-strong)]" : "border-t",
    thickRight ? "border-r-2 border-r-[color:var(--color-border-strong)]" : "border-r",
    thickBottom ? "border-b-2 border-b-[color:var(--color-border-strong)]" : "border-b",
  ].join(" ");
}
