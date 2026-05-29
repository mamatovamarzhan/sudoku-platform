import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <Section className="pb-24">
      <div className="relative glass-card-lg p-10 sm:p-14 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-premium opacity-50 pointer-events-none" aria-hidden />
        <div className="relative z-[1]">
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">
            Ready to solve?
          </h2>
          <p className="text-themed-muted max-w-md mx-auto mb-8">
            Jump into a fresh puzzle or take on today&apos;s daily challenge.
          </p>
          <Link href="/game">
            <Button variant="primary" size="lg">
              Start Playing
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
