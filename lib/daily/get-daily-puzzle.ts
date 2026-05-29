import { generatePuzzleWithSeed } from "@/lib/sudoku/generator";
import { dateToSeed } from "@/lib/utils/seeded-random";

export function getDailyPuzzleDate(date: Date = new Date()) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getDailyPuzzle(date: Date = new Date()) {
  const seed = dateToSeed(date);
  return generatePuzzleWithSeed("medium", seed);
}
