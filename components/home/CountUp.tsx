"use client";

import * as React from "react";

/**
 * CountUp
 * -------
 * Animates the numeric portion of a label from 0 to its target when it first
 * scrolls into view. Preserves any prefix/suffix (e.g. "PKR ", "Cr+", "% Free")
 * and decimal precision. Respects prefers-reduced-motion.
 */
export function CountUp({
  value,
  className,
  duration = 1600,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const parsed = React.useMemo(() => {
    const m = value.match(/^(\D*)([\d.,]+)(.*)$/s);
    if (!m) return null;
    const prefix = m[1];
    const numRaw = m[2];
    const suffix = m[3];
    const decimals = numRaw.includes(".") ? numRaw.split(".")[1].length : 0;
    const target = parseFloat(numRaw.replace(/,/g, ""));
    return { prefix, suffix, decimals, target };
  }, [value]);

  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(() =>
    parsed ? `${parsed.prefix}0${parsed.decimals ? "." + "0".repeat(parsed.decimals) : ""}${parsed.suffix}` : value
  );

  React.useEffect(() => {
    if (!parsed) return;
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = (n: number) =>
      setDisplay(`${parsed.prefix}${n.toFixed(parsed.decimals)}${parsed.suffix}`);

    if (reduced || typeof IntersectionObserver === "undefined") {
      render(parsed.target);
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          render(parsed.target * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
          else render(parsed.target);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [parsed, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
