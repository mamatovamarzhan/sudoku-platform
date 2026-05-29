export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Board = CellValue[][];

export type Difficulty = "easy" | "medium" | "hard";

export interface Puzzle {
  puzzle: Board;
  solution: Board;
  difficulty: Difficulty;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface GameStats {
  mistakes: number;
  elapsedSeconds: number;
}
