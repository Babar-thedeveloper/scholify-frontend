import { Search, Bell, Briefcase, FileText, Users, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CONTAINER, featureHeader, features } from "./homepage.data";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const ICONS: Record<string, LucideIcon> = {
  Search,
  Bell,
  Briefcase,
  FileText,
  Users,
  Heart,
};

export function FeatureGrid() {
  return (
    <section className="w-full bg-emerald-50/30 py-20 dark:bg-emerald-950/10 md:py-28">
      <div className={CONTAINER}>
        <SectionHeading
          eyebrow={featureHeader.eyebrow}
          heading={featureHeader.heading}
          subtitle={featureHeader.subtitle}
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = ICONS[feature.icon] ?? Search;
            return (
              <Reveal key={feature.title} delay={(i % 3) * 90}>
                <div className="group h-full rounded-2xl border border-border/50 bg-card p-6 transition-all duration-200 hover:border-emerald-300 hover:shadow-md dark:hover:border-emerald-500/40">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
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
