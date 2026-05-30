import { DIFFICULTY_CLUES } from "./constants";
import type { Board, CellValue, Difficulty, Puzzle } from "./types";
import { cloneBoard, createEmptyBoard, shuffle } from "./utils";
import { hasUniqueSolution, solve } from "./solver";
import { isValidPlacement } from "./validator";

function generateFullBoard(random: () => number = Math.random): Board {
  const board = createEmptyBoard();
  solve(board, true, random);
  return board;
}

function getTargetClues(
  difficulty: Difficulty,
  random: () => number = Math.random
): number {
  const { min, max } = DIFFICULTY_CLUES[difficulty];
  return min + Math.floor(random() * (max - min + 1));
}

function createPuzzleFromSolution(
  solution: Board,
  difficulty: Difficulty,
  random: () => number = Math.random
): Board {
  const targetClues = getTargetClues(difficulty, random);
  const cellsToRemove = 81 - targetClues;
  const attempts = difficulty === "hard" ? 8 : difficulty === "medium" ? 4 : 2;
  let bestPuzzle = cloneBoard(solution);
  let bestClueCount = 81;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const puzzle = cloneBoard(solution);
    const positions = shuffle(
      Array.from({ length: 81 }, (_, i) => ({
        row: Math.floor(i / 9),
        col: i % 9,
      })),
      random
    );

    let removed = 0;
    for (const { row, col } of positions) {
      if (removed >= cellsToRemove) break;

      const backup = puzzle[row][col];
      puzzle[row][col] = 0;

      if (hasUniqueSolution(puzzle)) {
        removed++;
      } else {
        puzzle[row][col] = backup;
      }
    }

    const clueCount = 81 - removed;
    if (clueCount < bestClueCount) {
      bestPuzzle = puzzle;
      bestClueCount = clueCount;
    }

    if (removed >= cellsToRemove) return puzzle;
  }

  return bestPuzzle;
}

export function generatePuzzle(difficulty: Difficulty): Puzzle {
  return generatePuzzleWithSeed(difficulty, Math.random);
}

export function generatePuzzleWithSeed(
  difficulty: Difficulty,
  seedOrRandom: number | (() => number)
): Puzzle {
  const random =
    typeof seedOrRandom === "number"
      ? (() => {
          let s = seedOrRandom >>> 0;
          return () => {
            s = (s + 0x6d2b79f5) >>> 0;
            let t = Math.imul(s ^ (s >>> 15), 1 | s);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
          };
        })()
      : seedOrRandom;

  const solution = generateFullBoard(random);
  const puzzle = createPuzzleFromSolution(solution, difficulty, random);

  return {
    puzzle,
    solution: cloneBoard(solution),
    difficulty,
  };
}

export function getValidNumbersForCell(
  board: Board,
  row: number,
  col: number
): CellValue[] {
  const valid: CellValue[] = [];
  for (let num = 1; num <= 9; num++) {
    const value = num as CellValue;
    if (isValidPlacement(board, row, col, value)) {
      valid.push(value);
    }
  }
  return valid;
}
