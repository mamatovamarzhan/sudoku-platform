import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { EvenOddGame } from "@/components/sudoku/EvenOddGame";

export const metadata: Metadata = {
  title: "Even/Odd Sudoku",
  description:
    "Play Even/Odd Sudoku with parity-shaded cells and real-time validation.",
};

export default function EvenOddPage() {
  return (
    <SiteShell>
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <EvenOddGame />
      </div>
    </SiteShell>
  );
}
