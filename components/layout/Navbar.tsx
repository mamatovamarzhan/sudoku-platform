"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/daily", label: "Daily" },
  { href: "/coach", label: "AI Coach 🤖" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/settings", label: "Settings" },
];

const PLAY_LINKS = [
  {
    href: "/game",
    icon: "🎯",
    name: "Classic",
    description: "The original 9×9 grid",
  },
  {
    href: "/game/samurai",
    icon: "⚔️",
    name: "Samurai",
    description: "Five overlapping grids",
  },
  {
    href: "/game/evenodd",
    icon: "⚡",
    name: "Even/Odd",
    description: "Parity challenge",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [playOpen, setPlayOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const playActive =
    pathname === "/game" ||
    pathname === "/game/samurai" ||
    pathname === "/game/evenodd";

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setPlayOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-[color:var(--color-glass-border)] bg-[color:var(--color-surface)]/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-accent text-sm font-bold text-white shadow-glow-sm transition-transform group-hover:scale-105">
            S
          </span>
          <span className="text-lg font-bold gradient-text hidden sm:block">Sudoku</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          <NavLink href="/" label="Home" active={pathname === "/"} />

          <div
            className="relative"
            onMouseEnter={() => setPlayOpen(true)}
            onMouseLeave={() => setPlayOpen(false)}
          >
            <button
              type="button"
              onClick={() => setPlayOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={playOpen}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${playActive
                  ? "text-themed-primary bg-themed-glass-hover"
                  : "text-themed-muted hover:text-themed-primary hover:bg-themed-glass-hover"
                }
              `}
            >
              <span className="inline-flex items-center gap-1">
                Play
                <span className={`text-[10px] transition-transform ${playOpen ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </span>
            </button>

            {playOpen && (
              <PlayDropdown
                className="absolute left-0 top-full mt-2 w-80"
                onNavigate={() => setPlayOpen(false)}
              />
            )}
          </div>

          {NAV_LINKS.slice(1).map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={pathname === link.href}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitcher />
          <Link href="/game" className="hidden sm:block">
            <Button variant="primary" size="sm">
              Play Now
            </Button>
          </Link>
          <Link href="/#pricing" className="hidden lg:block">
            <Button
              variant="primary"
              size="sm"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 shadow-[0_0_18px_rgba(251,191,36,0.35)] hover:shadow-[0_0_28px_rgba(251,146,60,0.5)]"
            >
              <span aria-hidden>👑</span>
              Upgrade to Pro
            </Button>
          </Link>
          <Link href="/game" className="sm:hidden">
            <Button variant="primary" size="sm" aria-label="Play Now">
              Play
            </Button>
          </Link>
          <Link href="/#pricing" className="sm:hidden">
            <Button
              variant="primary"
              size="sm"
              aria-label="Upgrade to Pro"
              className="bg-gradient-to-r from-yellow-400 to-orange-500"
            >
              👑
            </Button>
          </Link>
        </div>
      </div>

      <nav
        className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-3 -mt-1"
        aria-label="Mobile"
      >
        <MobileNavLink href="/" label="Home" active={pathname === "/"} />
        <button
          type="button"
          onClick={() => setPlayOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={playOpen}
          className={`
            shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${playActive ? "text-themed-primary bg-themed-glass-hover" : "text-themed-muted"}
          `}
        >
          Play <span aria-hidden>▾</span>
        </button>
        {NAV_LINKS.slice(1).map((link) => (
          <MobileNavLink
            key={link.href}
            href={link.href}
            label={link.label}
            active={pathname === link.href}
          />
        ))}
      </nav>

      {playOpen && (
        <div className="md:hidden px-4 pb-4">
          <PlayDropdown onNavigate={() => setPlayOpen(false)} />
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${active
          ? "text-themed-primary bg-themed-glass-hover"
          : "text-themed-muted hover:text-themed-primary hover:bg-themed-glass-hover"
        }
      `}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
        ${active ? "text-themed-primary bg-themed-glass-hover" : "text-themed-muted"}
      `}
    >
      {label}
    </Link>
  );
}

function PlayDropdown({
  className = "",
  onNavigate,
}: {
  className?: string;
  onNavigate: () => void;
}) {
  return (
    <div
      className={`glass-panel p-2 shadow-glass-lg animate-fade-in ${className}`}
      role="menu"
      aria-label="Play game modes"
    >
      {PLAY_LINKS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="
            flex items-center gap-3 rounded-xl px-3 py-3 text-left
            transition-all duration-200
            hover:bg-themed-glass-hover hover:text-themed-primary
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
          "
          role="menuitem"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-lg">
            {item.icon}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-themed-primary">
              {item.name}
            </span>
            <span className="block text-xs text-themed-muted">
              {item.description}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
