"use client";

interface TimerProps {
  time: string;
  isPaused?: boolean;
}

export function Timer({ time, isPaused = false }: TimerProps) {
  return (
    <div className="glass-panel flex items-center gap-2.5 px-4 py-2 font-mono text-lg tabular-nums">
      <div className="relative flex items-center justify-center">
        <svg
          className={`h-5 w-5 text-accent ${isPaused ? "animate-pulse-soft" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 7v5l3 2" />
        </svg>
        {!isPaused && (
          <span
            className="absolute inset-0 rounded-full bg-accent-ping animate-ping opacity-30"
            aria-hidden
          />
        )}
      </div>
      <span className="min-w-[3.5rem] font-semibold tracking-wider text-themed-primary">
        {time}
      </span>
    </div>
  );
}
