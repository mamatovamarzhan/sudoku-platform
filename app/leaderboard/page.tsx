import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "See the fastest Sudoku solvers this week.",
};

export default function LeaderboardPage() {
  return (
    <SiteShell>
      <div className="py-8 sm:py-12 px-4 sm:px-6 max-w-3xl mx-auto">
        <PageHeader
          eyebrow="Rankings"
          title="Leaderboard"
          description="Top players ranked by solve time and accuracy. Updated weekly."
        />
        <LeaderboardTable />
      </div>
    </SiteShell>
  );
}
