"use client";

import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { THEMES } from "@/lib/themes";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";

export function ThemesShowcase() {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <Section id="themes">
      <div ref={ref} className={cn("transition-all duration-700", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-3">Themes</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-themed-primary mb-4">
            Three stunning worlds
          </h2>
          <p className="text-themed-muted max-w-xl mx-auto">
            Pick your vibe. Every theme transforms the entire experience with custom colors and glow effects.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {THEMES.map((theme, i) => (
            <div
              key={theme.id}
              className="glass-card-lg overflow-hidden group hover:shadow-glow transition-all duration-300"
              style={{ transitionDelay: isInView ? `${i * 80}ms` : "0ms" }}
            >
              <div className="h-32 flex" aria-hidden>
                {theme.preview.map((color) => (
                  <div key={color} className="flex-1 transition-transform group-hover:scale-105" style={{ backgroundColor: color }} />
                ))}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-themed-primary mb-1">{theme.label}</h3>
                <p className="text-sm text-themed-muted mb-4">{theme.description}</p>
                <div className="flex gap-2">
                  {theme.preview.map((color) => (
                    <span
                      key={color}
                      className="h-6 w-6 rounded-full ring-2 ring-[color:var(--color-glass-border)]"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/settings">
            <Button variant="secondary" size="md">
              Customize in Settings
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
