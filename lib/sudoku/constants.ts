import type { Difficulty } from "./types";

export const GRID_SIZE = 9;
export const BOX_SIZE = 3;

export const DIFFICULTY_CLUES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 34, max: 36 },
  medium: { min: 26, max: 28 },
  hard: { min: 21, max: 23 },
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};
