"use client";

import { Button } from "@/components/ui/Button";

interface WinModalProps {
  isOpen: boolean;
  time: string;
  mistakes: number;
  difficulty: string;
  onNewGame: () => void;
  onClose: () => void;
}

export function WinModal({
  isOpen,
  time,
  mistakes,
  difficulty,
  onNewGame,
  onClose,
}: WinModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full modal-orb-primary blur-3xl animate-shimmer" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full modal-orb-secondary blur-3xl animate-shimmer" style={{ animationDelay: "-1.5s" }} />
      </div>

      <div
        className="
          relative z-10 w-full max-w-sm
          glass-card-lg p-8
          animate-scale-in text-center
        "
      >
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-accent shadow-glow text-3xl"
          aria-hidden
        >
          ✓
        </div>

        <h2 id="win-title" className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
          Puzzle Complete!
        </h2>
        <p className="text-themed-muted text-sm mb-8">
          You mastered the {difficulty.toLowerCase()} challenge
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="glass-panel p-4 rounded-xl">
            <p className="text-[10px] text-themed-muted uppercase tracking-[0.15em] font-semibold mb-1.5">
              Time
            </p>
            <p className="font-mono text-2xl font-bold text-themed-primary tracking-wider">{time}</p>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <p className="text-[10px] text-themed-muted uppercase tracking-[0.15em] font-semibold mb-1.5">
              Mistakes
            </p>
            <p className="font-mono text-2xl font-bold text-themed-primary">{mistakes}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Button variant="primary" size="lg" onClick={onNewGame} className="w-full">
            Play Again
          </Button>
          <Button variant="ghost" size="md" onClick={onClose} className="w-full">
            Keep viewing
          </Button>
        </div>
      </div>
    </div>
  );
}
