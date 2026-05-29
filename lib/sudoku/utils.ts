import { BOX_SIZE, GRID_SIZE } from "./constants";
import type { Board, CellValue } from "./types";

export function createEmptyBoard(): Board {
  return Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(0) as CellValue[]
  );
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]) as Board;
}

export function getBoxIndex(row: number, col: number): number {
  return Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(col / BOX_SIZE);
}

export function isInSameBox(
  row1: number,
  col1: number,
  row2: number,
  col2: number
): boolean {
  return getBoxIndex(row1, col1) === getBoxIndex(row2, col2);
}

export function shuffle<T>(array: T[], random: () => number = Math.random): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function boardToFlat(board: Board): CellValue[] {
  return board.flat();
}

export function countFilledCells(board: Board): number {
  return boardToFlat(board).filter((v) => v !== 0).length;
}
