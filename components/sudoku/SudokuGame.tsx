"use client";

import { useCallback, useEffect } from "react";
import { useSudokuGame } from "@/hooks/useSudokuGame";
import { useTimer } from "@/hooks/useTimer";
import { DIFFICULTY_LABELS } from "@/lib/sudoku";
import type { CellValue, Puzzle } from "@/lib/sudoku";
import { GameHeader } from "./GameHeader";
import { SudokuBoard } from "./SudokuBoard";
import { NumberPad } from "./NumberPad";
import { WinModal } from "./WinModal";

interface SudokuGameProps {
  initialPuzzle?: Puzzle;
  mode?: "classic" | "daily";
  dailyLabel?: string;
}

export function SudokuGame({
  initialPuzzle,
  mode = "classic",
  dailyLabel,
}: SudokuGameProps) {
  const {
    difficulty,
    current,
    given,
    selected,
    mistakes,
    isWon,
    showWinModal,
    validMoves,
    hasStarted,
    gameKey,
    loadPuzzle,
    startNewGame,
    restartGame,
    selectCell,
    setCellValue,
    clearCell,
    dismissWinModal,
    getCellStatus,
  } = useSudokuGame();

  const timerActive = hasStarted && !isWon;
  const { formatted, reset: resetTimer, pause } = useTimer(timerActive);
  const isDaily = mode === "daily";

  useEffect(() => {
    if (initialPuzzle) {
      loadPuzzle(initialPuzzle);
    } else {
      startNewGame("medium");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    resetTimer();
  }, [gameKey, resetTimer]);

  useEffect(() => {
    if (isWon) pause();
  }, [isWon, pause]);

  const handleNewGame = useCallback(() => {
    if (isDaily && initialPuzzle) {
      loadPuzzle(initialPuzzle);
    } else {
      startNewGame(difficulty);
    }
  }, [isDaily, initialPuzzle, loadPuzzle, startNewGame, difficulty]);

  const handleDifficultyChange = useCallback(
    (d: typeof difficulty) => {
      if (!hasStarted || isWon) {
        startNewGame(d);
      }
    },
    [hasStarted, isWon, startNewGame]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selected || isWon) return;

      const key = e.key;
      if (key >= "1" && key <= "9") {
        setCellValue(parseInt(key, 10) as CellValue);
      } else if (key === "Backspace" || key === "Delete" || key === "0") {
        clearCell();
      } else if (key === "ArrowUp" && selected.row > 0) {
        selectCell(selected.row - 1, selected.col);
      } else if (key === "ArrowDown" && selected.row < 8) {
        selectCell(selected.row + 1, selected.col);
      } else if (key === "ArrowLeft" && selected.col > 0) {
        selectCell(selected.row, selected.col - 1);
      } else if (key === "ArrowRight" && selected.col < 8) {
        selectCell(selected.row, selected.col + 1);
      }
    },
    [selected, isWon, setCellValue, clearCell, selectCell]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative glass-card-lg p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 bg-gradient-premium">
        <div className="absolute inset-0 rounded-3xl bg-card-overlay pointer-events-none" aria-hidden />

        <div className="relative z-[1] space-y-6 sm:space-y-8">
          <GameHeader
            time={formatted}
            mistakes={mistakes}
            difficulty={difficulty}
            isPaused={!timerActive}
            onDifficultyChange={handleDifficultyChange}
            onNewGame={handleNewGame}
            onRestart={restartGame}
            gameActive={hasStarted && !isWon}
            title={isDaily ? "Daily Challenge" : "Sudoku"}
            subtitle={isDaily ? dailyLabel ?? "Today's puzzle" : "Classic mode"}
            lockDifficulty={isDaily}
          />

          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <SudokuBoard
              board={current}
              given={given}
              selected={selected}
              getCellStatus={getCellStatus}
              onSelect={selectCell}
            />

            <NumberPad
              onInput={setCellValue}
              onClear={clearCell}
              validMoves={selected && !given[selected.row][selected.col] ? validMoves : undefined}
              disabled={!selected || isWon || (selected && given[selected.row][selected.col])}
            />
          </div>
        </div>
      </div>

      <WinModal
        isOpen={showWinModal}
        time={formatted}
        mistakes={mistakes}
        difficulty={isDaily ? "Daily" : DIFFICULTY_LABELS[difficulty]}
        onNewGame={handleNewGame}
        onClose={dismissWinModal}
      />
    </div>
  );
}
