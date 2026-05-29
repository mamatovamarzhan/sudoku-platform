import { GRID_SIZE } from "./constants";
import type { Board, CellValue } from "./types";
import { cloneBoard, shuffle } from "./utils";
import { isValidPlacement } from "./validator";

const ALL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as CellValue[];

function findBestEmptyCell(board: Board): { row: number; col: number } | null {
  let best: { row: number; col: number } | null = null;
  let fewestCandidates = 10;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] !== 0) continue;

      let candidates = 0;
      for (const num of ALL_NUMBERS) {
        if (isValidPlacement(board, row, col, num)) candidates++;
      }

      if (candidates < fewestCandidates) {
        fewestCandidates = candidates;
        best = { row, col };
        if (candidates === 0) return best;
      }
    }
  }

  return best;
}

function solveBacktrack(
  board: Board,
  randomize: boolean,
  random: () => number = Math.random
): boolean {
  const empty = findBestEmptyCell(board);
  if (!empty) return true;

  const { row, col } = empty;
  const numbers = randomize ? shuffle(ALL_NUMBERS, random) : ALL_NUMBERS;

  for (const num of numbers) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col] = num;
      if (solveBacktrack(board, randomize, random)) return true;
      board[row][col] = 0;
    }
  }
  return false;
}

export function solve(
  board: Board,
  randomize = false,
  random: () => number = Math.random
): boolean {
  return solveBacktrack(board, randomize, random);
}

export function countSolutions(board: Board, limit = 2): number {
  const working = cloneBoard(board);
  let count = 0;

  function backtrack(): void {
    if (count >= limit) return;

    const empty = findBestEmptyCell(working);
    if (!empty) {
      count++;
      return;
    }

    const { row, col } = empty;
    for (let num = 1; num <= 9; num++) {
      const value = num as CellValue;
      if (isValidPlacement(working, row, col, value)) {
        working[row][col] = value;
        backtrack();
        working[row][col] = 0;
        if (count >= limit) return;
      }
    }
  }

  backtrack();
  return count;
}

export function hasUniqueSolution(board: Board): boolean {
  return countSolutions(board, 2) === 1;
}
