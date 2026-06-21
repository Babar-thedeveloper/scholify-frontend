import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  subtitle?: string;
  className?: string;
}

/**
 * SectionHeading
 * --------------
 * Centered eyebrow + heading + subtitle block shared across content sections
 * (Features, How it works, Testimonials, FAQ) for consistent vertical rhythm.
 */
export function SectionHeading({
  eyebrow,
  heading,
  subtitle,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn("mx-auto max-w-2xl text-center", className)}>
      <p className="text-sm font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {heading}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
