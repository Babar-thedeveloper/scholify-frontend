import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONTAINER, hero } from "./homepage.data";
import { HeroCarousel } from "./HeroCarousel";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-emerald-50 via-background to-background dark:from-emerald-950/20">
      {/* soft animated glow behind the hero */}
      <div
        aria-hidden="true"
        className="animate-blob pointer-events-none absolute -left-20 -top-24 size-96 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10"
      />
      <div
        aria-hidden="true"
        className="animate-blob pointer-events-none absolute -right-24 top-20 size-80 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-500/10"
        style={{ animationDelay: "-8s" }}
      />

      <div className={`${CONTAINER} relative z-10 pb-16 pt-16 md:pb-20 md:pt-24`}>
        {/* Brand header */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="glass mb-6 gap-1.5 px-3 py-1 text-xs font-medium"
          >
            <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            {hero.eyebrow}
          </Badge>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl">
            {hero.headlineTop}{" "}
            <span>{hero.headlineAccent}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href={hero.primaryCta.href}>
                {hero.primaryCta.label}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="glass" asChild>
              <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
            </Button>
          </div>
        </div>

        {/* Featured announcement carousel */}
        <div className="mx-auto mt-12 max-w-5xl">
          <HeroCarousel />
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
          {hero.trustLine}
        </p>
      </div>
    </section>
  );
}
