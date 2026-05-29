import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { ThemesShowcase } from "@/components/landing/ThemesShowcase";
import { LeaderboardPreview } from "@/components/landing/LeaderboardPreview";
import { CTA } from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <SiteShell>
      <Hero />
      <Features />
      <ThemesShowcase />
      <LeaderboardPreview />
      <CTA />
    </SiteShell>
  );
}
