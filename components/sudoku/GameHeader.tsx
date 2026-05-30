"use client";

import { Timer } from "./Timer";
import { GameStats } from "./GameStats";
import { DifficultySelector } from "./DifficultySelector";
import { Button } from "@/components/ui/Button";
import type { Difficulty } from "@/lib/sudoku";

interface GameHeaderProps {
  time: string;
  mistakes: number;
  difficulty: Difficulty;
  isPaused: boolean;
  onDifficultyChange: (d: Difficulty) => void;
  onNewGame: () => void;
  onRestart: () => void;
  gameActive: boolean;
  title?: string;
  subtitle?: string;
  lockDifficulty?: boolean;
}

export function GameHeader({
  time,
  mistakes,
  difficulty,
  isPaused,
  onDifficultyChange,
  onNewGame,
  onRestart,
  title = "Sudoku",
  subtitle = "Classic mode",
  lockDifficulty = false,
}: GameHeaderProps) {
  return (
    <header className="w-full space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight gradient-text">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-themed-muted mt-0.5">{subtitle}</p>
        </div>
        <Timer time={time} isPaused={isPaused} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <GameStats mistakes={mistakes} />
        {!lockDifficulty && (
          <DifficultySelector
            value={difficulty}
            onChange={onDifficultyChange}
            disabled={false}
          />
        )}
        {lockDifficulty && (
          <span className="glass-panel px-3 py-1.5 text-xs font-semibold text-themed-muted uppercase tracking-wider">
            Medium
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="primary" size="md" onClick={onNewGame} className="flex-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Game
        </Button>
        <Button variant="secondary" size="md" onClick={onRestart} className="flex-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
          Restart
        </Button>
      </div>
    </header>
  );
}
