"use client";

import { useMemo } from "react";
import { SudokuGame } from "@/components/sudoku/SudokuGame";
import { getDailyPuzzle, getDailyPuzzleDate } from "@/lib/daily/get-daily-puzzle";

export function DailyGame() {
  const puzzle = useMemo(() => getDailyPuzzle(), []);
  const dateLabel = useMemo(() => getDailyPuzzleDate(), []);

  return (
    <SudokuGame
      initialPuzzle={puzzle}
      mode="daily"
      dailyLabel={dateLabel}
    />
  );
}
