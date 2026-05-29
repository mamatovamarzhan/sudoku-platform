import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { SudokuGame } from "@/components/sudoku/SudokuGame";

export const metadata: Metadata = {
  title: "Play",
  description: "Play Sudoku with real-time validation and premium themes.",
};

export default function GamePage() {
  return (
    <SiteShell>
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <SudokuGame />
      </div>
    </SiteShell>
  );
}
