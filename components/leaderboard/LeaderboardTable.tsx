import { LEADERBOARD_ENTRIES } from "@/lib/leaderboard/data";
import { cn } from "@/lib/utils/cn";

export function LeaderboardTable() {
  return (
    <div className="glass-card-lg overflow-hidden">
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-themed-muted border-b border-[color:var(--color-glass-border)]">
        <span>Rank</span>
        <span>Player</span>
        <span className="hidden md:block">Difficulty</span>
        <span className="hidden sm:block">Mistakes</span>
        <span>Time</span>
      </div>
      {LEADERBOARD_ENTRIES.map((entry) => (
        <div
          key={entry.rank}
          className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-[color:var(--color-glass-border)] last:border-0 hover:bg-themed-glass-hover transition-colors"
        >
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold",
              entry.rank <= 3 ? "bg-gradient-accent text-white shadow-glow-sm" : "glass-panel text-themed-muted"
            )}
          >
            {entry.rank}
          </span>
          <div>
            <p className="font-semibold text-themed-primary">{entry.name}</p>
            <p className="text-xs text-themed-muted md:hidden">{entry.difficulty}</p>
          </div>
          <span className="hidden md:block text-sm text-themed-muted">{entry.difficulty}</span>
          <span className="hidden sm:block text-sm text-themed-muted font-mono">{entry.mistakes}</span>
          <span className="font-mono font-semibold text-themed-primary">{entry.time}</span>
        </div>
      ))}
    </div>
  );
}
