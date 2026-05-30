import { DIFFICULTY_CLUES } from "./constants";
import { solve } from "./solver";
import type { Board, CellValue, Difficulty } from "./types";
import { cloneBoard, createEmptyBoard, shuffle } from "./utils";

export type SamuraiCell = CellValue | null;
export type SamuraiBoard = SamuraiCell[][];
export type SamuraiGridId =
  | "topLeft"
  | "topRight"
  | "center"
  | "bottomLeft"
  | "bottomRight";

export interface SamuraiGridDefinition {
  id: SamuraiGridId;
  label: string;
  rowOffset: number;
  colOffset: number;
}

export interface SamuraiPuzzle {
  puzzle: SamuraiBoard;
  solution: SamuraiBoard;
  difficulty: Difficulty;
}

export const SAMURAI_SIZE = 21;

export const SAMURAI_GRIDS: SamuraiGridDefinition[] = [
  { id: "topLeft", label: "Top-left", rowOffset: 0, colOffset: 0 },
  { id: "topRight", label: "Top-right", rowOffset: 0, colOffset: 12 },
  { id: "center", label: "Center", rowOffset: 6, colOffset: 6 },
  { id: "bottomLeft", label: "Bottom-left", rowOffset: 12, colOffset: 0 },
  { id: "bottomRight", label: "Bottom-right", rowOffset: 12, colOffset: 12 },
];

export function generateSamuraiPuzzle(difficulty: Difficulty): SamuraiPuzzle {
  return generateSamuraiPuzzleWithSeed(difficulty, Math.random);
}

export function generateSamuraiPuzzleWithSeed(
  difficulty: Difficulty,
  seedOrRandom: number | (() => number)
): SamuraiPuzzle {
  const random = normalizeRandom(seedOrRandom);
  const center = generateSolvedGrid(random);

  const grids: Record<SamuraiGridId, Board> = {
    center,
    topLeft: generateGridWithFixedBox(2, 2, readBox(center, 0, 0), random),
    topRight: generateGridWithFixedBox(2, 0, readBox(center, 0, 2), random),
    bottomLeft: generateGridWithFixedBox(0, 2, readBox(center, 2, 0), random),
    bottomRight: generateGridWithFixedBox(0, 0, readBox(center, 2, 2), random),
  };

  const solution = assembleSamuraiBoard(grids);
  const puzzle = createSamuraiPuzzleFromSolution(solution, difficulty, random);

  return { puzzle, solution, difficulty };
}

export function createEmptySamuraiBoard(fillActiveWith: CellValue = 0): SamuraiBoard {
  return Array.from({ length: SAMURAI_SIZE }, (_, row) =>
    Array.from({ length: SAMURAI_SIZE }, (_, col) =>
      isSamuraiCellActive(row, col) ? fillActiveWith : null
    )
  );
}

export function cloneSamuraiBoard(board: SamuraiBoard): SamuraiBoard {
  return board.map((row) => [...row]);
}

export function isSamuraiCellActive(row: number, col: number): boolean {
  return getSamuraiCellGrids(row, col).length > 0;
}

export function getSamuraiCellGrids(row: number, col: number): SamuraiGridDefinition[] {
  return SAMURAI_GRIDS.filter(
    (grid) =>
      row >= grid.rowOffset &&
      row < grid.rowOffset + 9 &&
      col >= grid.colOffset &&
      col < grid.colOffset + 9
  );
}

export function getSamuraiValidMoves(
  board: SamuraiBoard,
  row: number,
  col: number
): CellValue[] {
  const valid: CellValue[] = [];
  for (let value = 1; value <= 9; value++) {
    const cellValue = value as CellValue;
    if (isValidSamuraiPlacement(board, row, col, cellValue)) {
      valid.push(cellValue);
    }
  }
  return valid;
}

export function isValidSamuraiPlacement(
  board: SamuraiBoard,
  row: number,
  col: number,
  value: CellValue
): boolean {
  if (value === 0) return true;
  if (!isSamuraiCellActive(row, col)) return false;

  return getSamuraiCellGrids(row, col).every((grid) => {
    const localRow = row - grid.rowOffset;
    const localCol = col - grid.colOffset;

    for (let c = 0; c < 9; c++) {
      const globalCol = grid.colOffset + c;
      if (globalCol !== col && board[row][globalCol] === value) return false;
    }

    for (let r = 0; r < 9; r++) {
      const globalRow = grid.rowOffset + r;
      if (globalRow !== row && board[globalRow][col] === value) return false;
    }

    const boxRow = Math.floor(localRow / 3) * 3;
    const boxCol = Math.floor(localCol / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        const globalRow = grid.rowOffset + r;
        const globalCol = grid.colOffset + c;
        const isSameCell = globalRow === row && globalCol === col;
        if (!isSameCell && board[globalRow][globalCol] === value) return false;
      }
    }

    return true;
  });
}

export function getSamuraiCellStatus(
  current: SamuraiBoard,
  solution: SamuraiBoard,
  given: boolean[][],
  row: number,
  col: number
): "given" | "user" | "error" | "empty" {
  const value = current[row][col];
  if (value === null || value === 0) return "empty";
  if (given[row][col]) return "given";
  if (solution[row][col] !== value) return "error";
  return "user";
}

export function isSamuraiSolved(current: SamuraiBoard, solution: SamuraiBoard): boolean {
  for (let row = 0; row < SAMURAI_SIZE; row++) {
    for (let col = 0; col < SAMURAI_SIZE; col++) {
      if (!isSamuraiCellActive(row, col)) continue;
      if (current[row][col] !== solution[row][col]) return false;
    }
  }
  return true;
}

function normalizeRandom(seedOrRandom: number | (() => number)): () => number {
  if (typeof seedOrRandom !== "number") return seedOrRandom;

  let seed = seedOrRandom >>> 0;
  return () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateSolvedGrid(random: () => number): Board {
  const board = createEmptyBoard();
  solve(board, true, random);
  return board;
}

function generateGridWithFixedBox(
  boxRow: number,
  boxCol: number,
  values: CellValue[][],
  random: () => number
): Board {
  for (let attempt = 0; attempt < 20; attempt++) {
    const board = createEmptyBoard();
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        board[boxRow * 3 + row][boxCol * 3 + col] = values[row][col];
      }
    }

    if (solve(board, true, random)) return board;
  }

  throw new Error("Unable to generate linked Samurai grid");
}

function readBox(board: Board, boxRow: number, boxCol: number): CellValue[][] {
  return Array.from({ length: 3 }, (_, row) =>
    Array.from({ length: 3 }, (_, col) => board[boxRow * 3 + row][boxCol * 3 + col])
  );
}

function assembleSamuraiBoard(grids: Record<SamuraiGridId, Board>): SamuraiBoard {
  const board = createEmptySamuraiBoard();

  for (const grid of SAMURAI_GRIDS) {
    const source = grids[grid.id];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const globalRow = grid.rowOffset + row;
        const globalCol = grid.colOffset + col;
        board[globalRow][globalCol] = source[row][col];
      }
    }
  }

  return board;
}

function createSamuraiPuzzleFromSolution(
  solution: SamuraiBoard,
  difficulty: Difficulty,
  random: () => number
): SamuraiBoard {
  const puzzle = cloneSamuraiBoard(solution);
  const targetClues = getTargetClues(difficulty, random);
  const clueCounts = new Map<SamuraiGridId, number>(
    SAMURAI_GRIDS.map((grid) => [grid.id, 81])
  );
  const positions = shuffle(getActivePositions(), random);

  for (const { row, col } of positions) {
    const grids = getSamuraiCellGrids(row, col);
    const canRemove = grids.every((grid) => (clueCounts.get(grid.id) ?? 0) > targetClues);

    if (!canRemove) continue;

    puzzle[row][col] = 0;
    for (const grid of grids) {
      clueCounts.set(grid.id, (clueCounts.get(grid.id) ?? 0) - 1);
    }
  }

  return puzzle;
}

function getTargetClues(difficulty: Difficulty, random: () => number): number {
  const { min, max } = DIFFICULTY_CLUES[difficulty];
  return min + Math.floor(random() * (max - min + 1));
}

function getActivePositions(): { row: number; col: number }[] {
  const positions: { row: number; col: number }[] = [];
  for (let row = 0; row < SAMURAI_SIZE; row++) {
    for (let col = 0; col < SAMURAI_SIZE; col++) {
      if (isSamuraiCellActive(row, col)) positions.push({ row, col });
    }
  }
  return positions;
}
