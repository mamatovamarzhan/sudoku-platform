import type { ThemeId, ThemeMeta } from "./types";

export const THEMES: ThemeMeta[] = [
  {
    id: "neon-cyberpunk",
    label: "Neon Cyberpunk",
    description: "Purple & blue neon glow",
    preview: ["#a855f7", "#3b82f6", "#0f0a1a"],
  },
  {
    id: "ocean",
    label: "Ocean",
    description: "Deep blue & aqua calm",
    preview: ["#0ea5e9", "#22d3ee", "#041020"],
  },
  {
    id: "emerald-luxury",
    label: "Emerald Luxury",
    description: "Elegant green accents",
    preview: ["#10b981", "#34d399", "#050a08"],
  },
];

export function getThemeMeta(id: string): ThemeMeta | undefined {
  return THEMES.find((t) => t.id === id);
}

export function isValidThemeId(id: string): id is ThemeId {
  return THEMES.some((t) => t.id === id);
}
