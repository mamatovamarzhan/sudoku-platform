import type { Board, CellPosition, CellValue, Difficulty, Puzzle } from "./types";
import { cloneBoard } from "./utils";
import { isValidPlacement, boardsMatch } from "./validator";
import { getValidNumbersForCell } from "./generator";

export interface GameSnapshot {
  puzzle: Board;
  solution: Board;
  current: Board;
  given: boolean[][];
  difficulty: Difficulty;
}

export interface MoveResult {
  accepted: boolean;
  board: Board;
  isMistake: boolean;
  isWon: boolean;
}

export function createGameSnapshot(puzzle: Puzzle): GameSnapshot {
  return {
    puzzle: cloneBoard(puzzle.puzzle),
    solution: cloneBoard(puzzle.solution),
    current: cloneBoard(puzzle.puzzle),
    given: puzzle.puzzle.map((row) => row.map((cell) => cell !== 0)),
    difficulty: puzzle.difficulty,
  };
}

export function resetToPuzzle(snapshot: GameSnapshot): Board {
  return cloneBoard(snapshot.puzzle);
}

export function isGameWon(current: Board, solution: Board): boolean {
  return boardsMatch(current, solution);
}

export function canEditCell(given: boolean[][], row: number, col: number): boolean {
  return !given[row][col];
}

export function getValidMoves(board: Board, row: number, col: number): CellValue[] {
  return getValidNumbersForCell(board, row, col);
}

export function applyMove(
  snapshot: Pick<GameSnapshot, "current" | "solution" | "given">,
  position: CellPosition,
  value: CellValue
): MoveResult {
  const { row, col } = position;

  if (!canEditCell(snapshot.given, row, col)) {
    return { accepted: false, board: snapshot.current, isMistake: false, isWon: false };
  }

  if (value === 0) {
    const board = cloneBoard(snapshot.current);
    board[row][col] = 0;
    return { accepted: true, board, isMistake: false, isWon: false };
  }

  if (!isValidPlacement(snapshot.current, row, col, value)) {
    return { accepted: false, board: snapshot.current, isMistake: false, isWon: false };
  }

  const board = cloneBoard(snapshot.current);
  board[row][col] = value;
  const isMistake = snapshot.solution[row][col] !== value;
  const isWon = !isMistake && isGameWon(board, snapshot.solution);

  return { accepted: true, board, isMistake, isWon };
}

export function getCellStatus(
  current: Board,
  solution: Board,
  given: boolean[][],
  row: number,
  col: number
): "given" | "user" | "error" | "empty" {
  const val = current[row][col];
  if (val === 0) return "empty";
  if (given[row][col]) return "given";
  if (solution[row][col] !== val) return "error";
  return "user";
}
