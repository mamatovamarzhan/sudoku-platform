import { SiteShell } from "@/components/layout/SiteShell";
import { AICoachPage } from "@/components/coach/AICoachPage";

export default function CoachPage() {
  return (
    <SiteShell>
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <AICoachPage />
      </div>
    </SiteShell>
  );
}
