"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONTAINER, hero } from "./homepage.data";

/* Floating mockup card used in the hero visual stack (desktop only). */
function MockCard({
  card,
  className,
}: {
  card: (typeof hero.mockCards)[number];
  className?: string;
}) {
  const Icon = card.kind === "internship" ? Briefcase : GraduationCap;
  return (
    <div
      className={`w-72 rounded-2xl border border-border/60 bg-card shadow-xl shadow-emerald-950/5 ${card.rotate} ${className ?? ""}`}
    >
      <div className="h-1.5 rounded-t-2xl bg-primary" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Icon className="size-4" />
          </span>
          <Badge variant="secondary" className="shrink-0">
            {card.badge}
          </Badge>
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          {card.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{card.meta}</p>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-emerald-50 via-background to-background dark:from-emerald-950/20">
      <div className={`${CONTAINER} pb-16 pt-20 md:pb-20 md:pt-28`}>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — text content */}
          <div className="text-center lg:text-left">
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 px-3 py-1 text-xs font-medium"
            >
              <span className="inline-flex size-1.5 rounded-full bg-emerald-500" />
              {hero.eyebrow}
            </Badge>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl">
              {hero.headlineTop}
              <br />
              <span className="text-primary">{hero.headlineAccent}</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl lg:mx-0">
              {hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button size="lg" asChild>
                <Link href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                </Link>
              </Button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              {hero.trustLine}
            </p>
          </div>

          {/* Right — floating card stack (hidden on mobile) */}
          <div
            aria-hidden="true"
            className="relative hidden h-[420px] lg:block"
          >
            <div className="absolute right-6 top-2 animate-[float_6s_ease-in-out_infinite]">
              <MockCard card={hero.mockCards[0]} />
            </div>
            <div className="absolute right-24 top-32 animate-[float_7s_ease-in-out_infinite_0.6s]">
              <MockCard card={hero.mockCards[1]} />
            </div>
            <div className="absolute right-2 top-64 animate-[float_6.5s_ease-in-out_infinite_1.2s]">
              <MockCard card={hero.mockCards[2]} />
            </div>
          </div>
        </div>
      </div>

      {/* Local keyframes for the gentle floating motion. */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[float_6s_ease-in-out_infinite\\],
          .animate-\\[float_7s_ease-in-out_infinite_0\\.6s\\],
          .animate-\\[float_6\\.5s_ease-in-out_infinite_1\\.2s\\] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
