"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  type ThemeId,
  isValidThemeId,
} from "@/lib/themes";
import { ThemeContext } from "./theme-context";

function readStoredTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isValidThemeId(stored)) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

function applyThemeToDocument(theme: ThemeId) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const stored = readStoredTheme();
    setThemeState(stored);
    applyThemeToDocument(stored);
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    setIsTransitioning(true);
    document.documentElement.classList.add("theme-transitioning");

    setThemeState(next);
    applyThemeToDocument(next);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }

    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
      setIsTransitioning(false);
    }, 600);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, isTransitioning }),
    [theme, setTheme, isTransitioning]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
