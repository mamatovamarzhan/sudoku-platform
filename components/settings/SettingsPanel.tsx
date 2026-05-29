"use client";

import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { THEMES } from "@/lib/themes";
import { useTheme } from "@/components/theme/theme-context";

export function SettingsPanel() {
  const { theme } = useTheme();
  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div className="space-y-6">
      <section className="glass-card p-6">
        <h2 className="text-lg font-semibold text-themed-primary mb-1">Appearance</h2>
        <p className="text-sm text-themed-muted mb-5">
          Choose a theme. Your preference is saved automatically.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 overflow-hidden rounded-xl ring-1 ring-themed-border">
              {active.preview.map((color) => (
                <span key={color} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </span>
            <div>
              <p className="font-medium text-themed-primary">{active.label}</p>
              <p className="text-sm text-themed-muted">{active.description}</p>
            </div>
          </div>
          <ThemeSwitcher />
        </div>
      </section>

      <section className="glass-card p-6">
        <h2 className="text-lg font-semibold text-themed-primary mb-1">Gameplay</h2>
        <p className="text-sm text-themed-muted mb-4">
          Additional settings coming soon — sound effects, mistake limits, and hints.
        </p>
        <ul className="space-y-3 text-sm text-themed-muted">
          <li className="flex items-center justify-between glass-panel px-4 py-3 rounded-xl">
            <span>Sound effects</span>
            <span className="text-xs uppercase tracking-wider text-themed-muted/60">Soon</span>
          </li>
          <li className="flex items-center justify-between glass-panel px-4 py-3 rounded-xl">
            <span>Show timer</span>
            <span className="text-xs uppercase tracking-wider text-accent">On</span>
          </li>
          <li className="flex items-center justify-between glass-panel px-4 py-3 rounded-xl">
            <span>Highlight conflicts</span>
            <span className="text-xs uppercase tracking-wider text-accent">On</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
