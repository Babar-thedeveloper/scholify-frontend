import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CONTAINER, giveBack } from "./homepage.data";
import { Reveal } from "./Reveal";

export function GiveBackSection() {
  const c = giveBack.campaign;
  return (
    <section
      id="give-back"
      className="relative w-full scroll-mt-20 overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 py-20 text-white md:py-28"
    >
      {/* decorative animated blobs */}
      <div
        aria-hidden="true"
        className="animate-blob pointer-events-none absolute -left-20 top-10 size-80 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-blob pointer-events-none absolute -right-16 bottom-0 size-72 rounded-full bg-teal-300/20 blur-3xl"
        style={{ animationDelay: "-9s" }}
      />

      <div className={`${CONTAINER} relative z-10 max-w-4xl`}>
        <Reveal className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-200">
            {giveBack.eyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            {giveBack.headingTop}
            <br />
            {giveBack.headingAccent}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-emerald-50 md:text-lg">
            {giveBack.description}
          </p>
        </Reveal>

        {/* Live impact card — frosted glass over the gradient */}
        <Reveal delay={120} className="mx-auto mt-10 max-w-2xl">
          <div className="glass glass-card rounded-2xl p-7 text-card-foreground">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Heart className="size-4 text-emerald-600" />
              {c.label}
            </div>

            <h3 className="mt-3 text-xl font-semibold text-foreground">
              {c.title}
            </h3>

            <Progress
              value={c.percent}
              className="mt-5 h-2 bg-emerald-100 dark:bg-emerald-500/20"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
              <span className="font-medium text-foreground">
                {c.raised} raised{" "}
                <span className="font-normal text-muted-foreground">
                  · {c.goal} goal
                </span>
              </span>
              <span className="text-muted-foreground">
                {c.donors} · {c.timeLeft}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="flex-1">
                {c.primaryCta}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="flex-1 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
              >
                {c.secondaryCta}
              </Button>
            </div>
          </div>
        </Reveal>

        <p className="mt-8 text-center text-sm italic text-emerald-100">
          {giveBack.footnote}
        </p>
      </div>
    </section>
  );
}
