"use client";

import { useState, useRef, useEffect } from "react";
import { THEMES } from "@/lib/themes";
import { useTheme } from "./theme-context";

export function ThemeSwitcher() {
  const { theme, setTheme, isTransitioning } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Change theme"
        disabled={isTransitioning}
        className="
          glass-panel flex items-center gap-2 px-3 py-2
          text-sm font-medium text-themed-muted
          transition-all duration-300
          hover:text-themed-primary hover:shadow-glow-sm
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
          disabled:opacity-60
        "
      >
        <span
          className="flex h-5 w-5 overflow-hidden rounded-md ring-1 ring-themed-border"
          aria-hidden
        >
          {active?.preview.map((color) => (
            <span key={color} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </span>
        <span className="hidden sm:inline max-w-[7rem] truncate">
          {active?.label ?? "Theme"}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select theme"
          className="
            absolute right-0 top-full z-50 mt-2 w-72 sm:w-80
            glass-card-lg p-2 animate-scale-in
          "
        >
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-themed-muted">
            Appearance
          </p>
          <div className="space-y-1">
            {THEMES.map((t) => {
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setTheme(t.id);
                    setOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left
                    transition-all duration-300
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                    ${
                      isActive
                        ? "bg-accent-soft border border-themed-glow shadow-glow-sm"
                        : "border border-transparent hover:bg-themed-glass-hover"
                    }
                  `}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-themed-border shadow-glow-sm"
                    aria-hidden
                  >
                    {t.preview.map((color) => (
                      <span key={color} className="flex-1" style={{ backgroundColor: color }} />
                    ))}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-themed-primary">
                      {t.label}
                    </span>
                    <span className="block text-xs text-themed-muted truncate">
                      {t.description}
                    </span>
                  </span>
                  {isActive && (
                    <svg
                      className="h-5 w-5 shrink-0 text-accent"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.895 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
