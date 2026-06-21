import { Quote } from "lucide-react";
import {
  CONTAINER,
  testimonialHeader,
  testimonials,
  testimonialFootnote,
} from "./homepage.data";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function Testimonials() {
  return (
    <section className="w-full bg-emerald-50/30 py-20 dark:bg-emerald-950/10 md:py-28">
      <div className={CONTAINER}>
        <SectionHeading
          eyebrow={testimonialHeader.eyebrow}
          heading={testimonialHeader.heading}
          subtitle={testimonialHeader.subtitle}
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-2xl border border-border/50 bg-card p-7">
                <Quote className="size-8 text-emerald-200 dark:text-emerald-500/40" />
                <blockquote className="mt-2 text-base leading-relaxed text-foreground/85 md:text-lg">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                  <span className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    {t.initials}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {t.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.credential}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-sm italic text-muted-foreground">
          {testimonialFootnote}
        </p>
      </div>
    </section>
  );
}
