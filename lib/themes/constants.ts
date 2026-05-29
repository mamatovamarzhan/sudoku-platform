import type { ThemeId } from "./types";

export const THEME_STORAGE_KEY = "sudoku-theme";

export const DEFAULT_THEME: ThemeId = "neon-cyberpunk";

export const THEME_IDS: ThemeId[] = [
  "neon-cyberpunk",
  "ocean",
  "emerald-luxury",
];

export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var d=${JSON.stringify(DEFAULT_THEME)};var v=${JSON.stringify(THEME_IDS)};var t=localStorage.getItem(k);if(!t||v.indexOf(t)===-1)t=d;document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme",${JSON.stringify(DEFAULT_THEME)});}})();`;
