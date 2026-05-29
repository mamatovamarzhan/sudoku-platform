import { BOX_SIZE, GRID_SIZE } from "./constants";
import type { Board, CellValue } from "./types";

export function isValidPlacement(
  board: Board,
  row: number,
  col: number,
  value: CellValue
): boolean {
  if (value === 0) return true;

  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col && board[row][c] === value) return false;
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row && board[r][col] === value) return false;
  }

  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
      if (r !== row && c !== col && board[r][c] === value) return false;
    }
  }

  return true;
}

export function isBoardValid(board: Board): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const value = board[row][col];
      if (value !== 0 && !isValidPlacement(board, row, col, value)) {
        return false;
      }
    }
  }
  return true;
}

export function isBoardComplete(board: Board): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 0) return false;
    }
  }
  return isBoardValid(board);
}

export function boardsMatch(a: Board, b: Board): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (a[row][col] !== b[row][col]) return false;
    }
  }
  return true;
}
