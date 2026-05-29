"use client";

interface GameStatsProps {
  mistakes: number;
  maxMistakes?: number;
}

export function GameStats({ mistakes, maxMistakes }: GameStatsProps) {
  return (
    <div className="glass-panel flex items-center gap-2 px-4 py-2 text-sm">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20">
        <svg
          className="h-3.5 w-3.5 text-rose-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <span className="text-themed-muted">
        <span className="font-mono font-semibold text-themed-primary">{mistakes}</span>
        {maxMistakes !== undefined && (
          <span className="opacity-60"> / {maxMistakes}</span>
        )}
        <span className="ml-1.5 hidden sm:inline opacity-80">mistakes</span>
      </span>
    </div>
  );
}
