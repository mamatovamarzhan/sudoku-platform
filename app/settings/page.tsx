import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

export const metadata: Metadata = {
  title: "Settings",
  description: "Customize your Sudoku experience.",
};

export default function SettingsPage() {
  return (
    <SiteShell>
      <div className="py-8 sm:py-12 px-4 sm:px-6 max-w-2xl mx-auto">
        <PageHeader
          eyebrow="Preferences"
          title="Settings"
          description="Personalize themes and gameplay options."
        />
        <SettingsPanel />
      </div>
    </SiteShell>
  );
}
