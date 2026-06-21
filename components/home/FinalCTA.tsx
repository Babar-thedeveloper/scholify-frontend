import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTAINER, finalCta } from "./homepage.data";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section className="sheen relative w-full overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-700 py-20 text-white md:py-28">
      <div
        aria-hidden="true"
        className="animate-blob pointer-events-none absolute -left-16 bottom-0 size-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-blob pointer-events-none absolute -right-16 top-0 size-72 rounded-full bg-emerald-900/20 blur-3xl"
        style={{ animationDelay: "-10s" }}
      />

      <div className={`${CONTAINER} relative z-10 max-w-3xl text-center`}>
        <Reveal>
          <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {finalCta.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-emerald-50 md:text-xl">
            {finalCta.subtitle}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-white text-emerald-700 shadow-lg hover:bg-emerald-50"
              asChild
            >
              <Link href={finalCta.primaryCta.href}>
                {finalCta.primaryCta.label}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass-tint border-white/40 text-white hover:bg-white/15 hover:text-white dark:border-white/40 dark:bg-transparent dark:hover:bg-white/15"
              asChild
            >
              <Link href={finalCta.secondaryCta.href}>
                {finalCta.secondaryCta.label}
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-3">
            {finalCta.bullets.map((bullet) => (
              <span
                key={bullet}
                className="glass-tint flex items-center gap-1.5 rounded-full px-3 py-1 text-sm text-white"
              >
                <Check className="size-4" />
                {bullet}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
