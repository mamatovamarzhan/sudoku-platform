import { generatePuzzleWithSeed, getValidNumbersForCell } from "./generator";
import type { Board, CellValue, Difficulty, Puzzle } from "./types";

export interface EvenOddPuzzle extends Puzzle {
  evenMask: boolean[][];
}

export function generateEvenOddPuzzle(difficulty: Difficulty): EvenOddPuzzle {
  return generateEvenOddPuzzleWithSeed(difficulty, Math.random);
}

export function generateEvenOddPuzzleWithSeed(
  difficulty: Difficulty,
  seedOrRandom: number | (() => number)
): EvenOddPuzzle {
  const puzzle = generatePuzzleWithSeed(difficulty, seedOrRandom);

  return {
    ...puzzle,
    evenMask: createEvenMask(puzzle.solution),
  };
}

export function createEvenMask(solution: Board): boolean[][] {
  return solution.map((row) => row.map((value) => value !== 0 && value % 2 === 0));
}

export function isEvenOddValueAllowed(value: CellValue, isEvenCell: boolean): boolean {
  if (value === 0) return true;
  return isEvenCell ? value % 2 === 0 : value % 2 === 1;
}

export function getEvenOddCellStatus(
  current: Board,
  solution: Board,
  given: boolean[][],
  evenMask: boolean[][],
  row: number,
  col: number
): "given" | "user" | "error" | "empty" {
  const value = current[row][col];
  if (value === 0) return "empty";
  if (given[row][col]) return "given";
  if (!isEvenOddValueAllowed(value, evenMask[row][col])) return "error";
  if (solution[row][col] !== value) return "error";
  return "user";
}

export function getClassicValidMoves(board: Board, row: number, col: number): CellValue[] {
  return getValidNumbersForCell(board, row, col);
}
