import { Search, Bell, Briefcase, FileText, Users, Heart, Sparkles } from "lucide-react";
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
  Sparkles,
};

export function FeatureGrid() {
  return (
    <section
      id="features"
      className="relative w-full scroll-mt-20 overflow-hidden bg-emerald-50/30 py-20 dark:bg-emerald-950/10 md:py-28"
    >
      {/* decorative animated blobs */}
      <div
        aria-hidden="true"
        className="animate-blob pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10"
      />
      <div
        aria-hidden="true"
        className="animate-blob pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-500/10"
        style={{ animationDelay: "-7s" }}
      />

      <div className={`${CONTAINER} relative z-10`}>
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
                <div className="group glass glass-card h-full rounded-2xl p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 dark:text-emerald-300">
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
