import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { SamuraiGame } from "@/components/sudoku/SamuraiGame";

export const metadata: Metadata = {
  title: "Samurai Sudoku",
  description:
    "Play Samurai Sudoku with five overlapping grids in a single linked puzzle.",
};

export default function SamuraiPage() {
  return (
    <SiteShell>
      <div className="py-8 sm:py-12 px-3 sm:px-6">
        <SamuraiGame />
      </div>
    </SiteShell>
  );
}
