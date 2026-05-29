import Link from "next/link";

const SOCIAL_LINKS = [
  { label: "Twitter", href: "https://twitter.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Discord", href: "https://discord.com" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--color-glass-border)] mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <Link href="/" className="text-lg font-bold gradient-text">
              Sudoku
            </Link>
            <p className="text-sm text-themed-muted mt-1">
              Premium puzzles. Zero friction.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-themed-muted hover:text-themed-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[color:var(--color-glass-border)] text-center">
          <p className="text-xs text-themed-muted">
            © {year} Sudoku. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
