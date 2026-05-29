export type ThemeId = "neon-cyberpunk" | "ocean" | "emerald-luxury";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  description: string;
  preview: [string, string, string];
}
