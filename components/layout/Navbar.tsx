"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/daily", label: "Daily" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/settings", label: "Settings" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-glass-border)] bg-[color:var(--color-surface)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-accent text-sm font-bold text-white shadow-glow-sm transition-transform group-hover:scale-105">
            S
          </span>
          <span className="text-lg font-bold gradient-text hidden sm:block">Sudoku</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${active
                    ? "text-themed-primary bg-themed-glass-hover"
                    : "text-themed-muted hover:text-themed-primary hover:bg-themed-glass-hover"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitcher />
          <Link href="/game" className="hidden sm:block">
            <Button variant="primary" size="sm">
              Play Now
            </Button>
          </Link>
          <Link href="/game" className="sm:hidden">
            <Button variant="primary" size="sm" aria-label="Play Now">
              Play
            </Button>
          </Link>
        </div>
      </div>

      <nav
        className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-3 -mt-1"
        aria-label="Mobile"
      >
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${active ? "text-themed-primary bg-themed-glass-hover" : "text-themed-muted"}
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
