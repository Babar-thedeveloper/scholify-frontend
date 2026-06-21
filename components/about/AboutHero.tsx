import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CONTAINER } from "@/components/home/homepage.data";
import { Reveal } from "@/components/home/Reveal";
import { CountUp } from "@/components/home/CountUp";
import { aboutHero } from "./about.data";

export function AboutHero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-emerald-50 via-background to-background dark:from-emerald-950/20">
      <div
        aria-hidden="true"
        className="animate-blob pointer-events-none absolute -left-24 -top-20 size-96 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10"
      />
      <div
        aria-hidden="true"
        className="animate-blob pointer-events-none absolute -right-20 top-24 size-80 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-500/10"
        style={{ animationDelay: "-8s" }}
      />

      <div className={`${CONTAINER} relative z-10 pb-16 pt-20 text-center md:pb-20 md:pt-28`}>
        <Reveal className="mx-auto max-w-3xl">
          <Badge
            variant="secondary"
            className="glass mb-6 gap-1.5 px-3 py-1 text-xs font-medium"
          >
            <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            {aboutHero.eyebrow}
          </Badge>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl">
            {aboutHero.headingTop}{" "}
            <span>{aboutHero.headingAccent}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {aboutHero.intro}
          </p>
        </Reveal>

        <Reveal
          delay={120}
          className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4"
        >
          {aboutHero.stats.map((s) => (
            <div key={s.label} className="glass glass-card rounded-2xl p-5">
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 md:text-3xl">
                <CountUp value={s.value} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
