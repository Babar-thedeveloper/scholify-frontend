import { Eye, ShieldCheck, HeartHandshake } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CONTAINER } from "@/components/home/homepage.data";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Reveal } from "@/components/home/Reveal";
import { aboutValuesHeader, aboutValues } from "./about.data";

const ICONS: Record<string, LucideIcon> = {
  Eye,
  ShieldCheck,
  HeartHandshake,
};

export function AboutValues() {
  return (
    <section className="relative w-full overflow-hidden bg-emerald-50/30 py-20 dark:bg-emerald-950/10 md:py-28">
      <div
        aria-hidden="true"
        className="animate-blob pointer-events-none absolute -right-24 top-1/3 size-80 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10"
      />

      <div className={`${CONTAINER} relative z-10`}>
        <SectionHeading
          eyebrow={aboutValuesHeader.eyebrow}
          heading={aboutValuesHeader.heading}
          subtitle={aboutValuesHeader.subtitle}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {aboutValues.map((value, i) => {
            const Icon = ICONS[value.icon] ?? Eye;
            return (
              <Reveal key={value.title} delay={i * 100}>
                <div className="group glass glass-card h-full rounded-2xl p-7">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 dark:text-emerald-300">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
