"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Globe,
  Briefcase,
  FileText,
  HeartHandshake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  announcements,
  type AnnouncementTheme,
} from "./announcements.data";

const ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Globe,
  Briefcase,
  FileText,
  HeartHandshake,
};

const THEMES: Record<
  AnnouncementTheme,
  { gradient: string; ctaText: string; chip: string }
> = {
  emerald: {
    gradient: "from-emerald-500 via-emerald-600 to-emerald-800",
    ctaText: "text-emerald-700",
    chip: "bg-white/15 text-emerald-50",
  },
  blue: {
    gradient: "from-sky-500 via-blue-600 to-indigo-800",
    ctaText: "text-blue-700",
    chip: "bg-white/15 text-sky-50",
  },
  violet: {
    gradient: "from-violet-500 via-purple-600 to-fuchsia-800",
    ctaText: "text-violet-700",
    chip: "bg-white/15 text-violet-50",
  },
  amber: {
    gradient: "from-amber-500 via-orange-500 to-rose-600",
    ctaText: "text-orange-700",
    chip: "bg-white/15 text-amber-50",
  },
  rose: {
    gradient: "from-rose-500 via-pink-600 to-purple-700",
    ctaText: "text-rose-700",
    chip: "bg-white/15 text-rose-50",
  },
};

const DURATION = 6000;

export function HeroCarousel() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const count = announcements.length;

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    if (paused || reduced) return;
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % count),
      DURATION
    );
    return () => window.clearTimeout(id);
  }, [index, paused, reduced, count]);

  const goTo = (i: number) => setIndex(((i % count) + count) % count);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Platform announcements"
    >
      <div className="relative h-[480px] overflow-hidden rounded-3xl border border-border/50 shadow-2xl shadow-emerald-950/10 sm:h-[400px] md:h-[360px]">
        {announcements.map((a, i) => {
          const theme = THEMES[a.theme];
          const Icon = ICONS[a.icon] ?? GraduationCap;
          const active = i === index;
          return (
            <div
              key={i}
              aria-hidden={!active}
              className={cn(
                "absolute inset-0 bg-gradient-to-br text-white transition-all duration-700 ease-out",
                theme.gradient,
                active
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none translate-x-4 opacity-0"
              )}
            >
              {/* decorative glow blobs */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-white/10 blur-2xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 right-24 size-64 rounded-full bg-black/10 blur-2xl"
              />

              {/* oversized accent icon */}
              <Icon
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 bottom-2 hidden size-64 text-white/10 sm:block"
                strokeWidth={1.25}
              />

              <div className="relative flex h-full flex-col justify-center p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                    <span className="size-1.5 rounded-full bg-white" />
                    {a.tag}
                  </span>
                  {a.highlight ? (
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm",
                        theme.chip
                      )}
                    >
                      {a.highlight}
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-4 max-w-xl text-2xl font-bold leading-tight tracking-tight md:text-4xl">
                  {a.title}
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/90 md:text-base">
                  {a.description}
                </p>

                <div className="mt-6">
                  <Button
                    size="lg"
                    className={cn(
                      "bg-white shadow-lg hover:bg-white/90",
                      theme.ctaText
                    )}
                    asChild
                  >
                    <Link href={a.cta.href}>
                      {a.cta.label}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {/* prev / next arrows */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prev}
          aria-label="Previous announcement"
          className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/35 md:flex"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={next}
          aria-label="Next announcement"
          className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/35 md:flex"
        >
          <ChevronRight className="size-5" />
        </Button>

        {/* indicators */}
        <div className="absolute bottom-5 left-8 z-10 flex items-center gap-2 md:bottom-6">
          {announcements.map((a, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to announcement ${i + 1}: ${a.tag}`}
                aria-current={active}
                className={cn(
                  "h-1.5 overflow-hidden rounded-full bg-white/40 transition-all duration-300",
                  active ? "w-8" : "w-3 hover:bg-white/60"
                )}
              >
                {active && !reduced ? (
                  <span
                    key={`${index}-${paused}`}
                    className="block h-full rounded-full bg-white"
                    style={{
                      animation: `hero-progress ${DURATION}ms linear forwards`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                ) : active ? (
                  <span className="block h-full w-full rounded-full bg-white" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes hero-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
