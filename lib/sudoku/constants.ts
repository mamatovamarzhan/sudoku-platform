import type { Difficulty } from "./types";

export const GRID_SIZE = 9;
export const BOX_SIZE = 3;

export const DIFFICULTY_CLUES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 40, max: 45 },
  medium: { min: 32, max: 36 },
  hard: { min: 24, max: 28 },
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};
