import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { DailyGame } from "@/components/daily/DailyGame";

export const metadata: Metadata = {
  title: "Daily Challenge",
  description: "Solve today's unique Sudoku puzzle — same board for everyone.",
};

export default function DailyPage() {
  return (
    <SiteShell>
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <PageHeader
          eyebrow="Daily"
          title="Today's Challenge"
          description="One puzzle per day. Everyone gets the same board — can you top the leaderboard?"
        />
        <DailyGame />
      </div>
    </SiteShell>
  );
}
