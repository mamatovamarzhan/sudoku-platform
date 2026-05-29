"use client";

import { Section } from "@/components/ui/Section";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils/cn";

const FEATURES = [
  {
    title: "Smart validation",
    description: "Real-time move checking blocks invalid entries and highlights conflicts instantly.",
    icon: "✓",
  },
  {
    title: "Daily challenges",
    description: "One unique puzzle per day — same board for everyone, fresh every midnight.",
    icon: "📅",
  },
  {
    title: "Three difficulties",
    description: "Easy, Medium, and Hard puzzles generated with guaranteed unique solutions.",
    icon: "◎",
  },
  {
    title: "Premium themes",
    description: "Neon Cyberpunk, Ocean, and Emerald Luxury — switch anytime, saved automatically.",
    icon: "◈",
  },
  {
    title: "Leaderboards",
    description: "Track your best times and compete with players around the world.",
    icon: "🏆",
  },
  {
    title: "Keyboard & touch",
    description: "Full keyboard navigation on desktop and an optimized number pad on mobile.",
    icon: "⌨",
  },
];

export function Features() {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <Section id="features" className="bg-themed-glass/30">
      <div ref={ref} className={cn("transition-all duration-700", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-themed-primary mb-4">
            Built for serious solvers
          </h2>
          <p className="text-themed-muted max-w-xl mx-auto">
            Everything you need for the perfect Sudoku session, wrapped in a premium interface.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="glass-card p-6 hover:shadow-glow-sm transition-all duration-300 hover:-translate-y-1"
              style={{ transitionDelay: isInView ? `${i * 50}ms` : "0ms" }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-lg mb-4">
                {feature.icon}
              </span>
              <h3 className="text-lg font-semibold text-themed-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-themed-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
