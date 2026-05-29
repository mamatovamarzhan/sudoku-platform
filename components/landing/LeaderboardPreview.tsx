"use client";

import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { LEADERBOARD_ENTRIES } from "@/lib/leaderboard/data";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";

export function LeaderboardPreview() {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const top = LEADERBOARD_ENTRIES.slice(0, 5);

  return (
    <Section id="leaderboard" className="bg-themed-glass/30">
      <div ref={ref} className={cn("transition-all duration-700", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-3">Leaderboard</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-themed-primary mb-3">
              Top solvers this week
            </h2>
            <p className="text-themed-muted max-w-md">
              Climb the ranks with fast, clean solves. Fewer mistakes mean higher placement.
            </p>
          </div>
          <Link href="/leaderboard">
            <Button variant="secondary" size="md">View full leaderboard</Button>
          </Link>
        </div>

        <div className="glass-card-lg overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-themed-muted border-b border-[color:var(--color-glass-border)]">
            <span>Rank</span>
            <span>Player</span>
            <span className="hidden sm:block">Difficulty</span>
            <span>Time</span>
          </div>
          {top.map((entry) => (
            <div
              key={entry.rank}
              className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-5 py-4 border-b border-[color:var(--color-glass-border)] last:border-0 hover:bg-themed-glass-hover transition-colors"
            >
              <span className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
                entry.rank === 1 ? "bg-gradient-accent text-white" : "glass-panel text-themed-muted"
              )}>
                {entry.rank}
              </span>
              <span className="font-medium text-themed-primary">{entry.name}</span>
              <span className="hidden sm:block text-sm text-themed-muted">{entry.difficulty}</span>
              <span className="font-mono font-semibold text-themed-primary">{entry.time}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
