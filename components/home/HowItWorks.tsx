import { CONTAINER, howItWorksHeader, steps } from "./homepage.data";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full scroll-mt-20 bg-background py-20 md:py-28"
    >
      <div className={CONTAINER}>
        <SectionHeading
          eyebrow={howItWorksHeader.eyebrow}
          heading={howItWorksHeader.heading}
          subtitle={howItWorksHeader.subtitle}
        />

        <div className="relative mt-14">
          {/* Dashed connector line (desktop only, behind the cards) */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[42px] hidden border-t-2 border-dashed border-emerald-300 dark:border-emerald-500/30 md:block"
          />

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 120}>
                <div className="glass glass-card relative h-full rounded-2xl p-6 text-center">
                  <div className="mx-auto flex size-[42px] items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white shadow-lg shadow-emerald-600/30">
                    {i + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
