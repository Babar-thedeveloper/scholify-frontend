import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTAINER, finalCta } from "./homepage.data";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section className="w-full bg-emerald-600 py-20 text-white md:py-28">
      <div className={`${CONTAINER} max-w-3xl text-center`}>
        <Reveal>
          <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {finalCta.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-emerald-50 md:text-xl">
            {finalCta.subtitle}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-white text-emerald-700 hover:bg-emerald-50"
              asChild
            >
              <Link href={finalCta.primaryCta.href}>
                {finalCta.primaryCta.label}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white/10 hover:text-white dark:border-white dark:bg-transparent dark:hover:bg-white/10"
              asChild
            >
              <Link href={finalCta.secondaryCta.href}>
                {finalCta.secondaryCta.label}
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-emerald-100 sm:flex-row sm:gap-6">
            {finalCta.bullets.map((bullet) => (
              <span key={bullet} className="flex items-center gap-1.5">
                <Check className="size-4" />
                {bullet}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
