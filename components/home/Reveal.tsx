"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends React.ComponentProps<"div"> {
  /** Stagger delay in milliseconds. */
  delay?: number;
}

/**
 * Reveal
 * ------
 * Subtle on-scroll fade-up. Plays once when the element enters the viewport.
 * Uses IntersectionObserver (no animation library) to stay consistent with
 * the project's CSS-driven motion approach. Respects prefers-reduced-motion.
 */
export function Reveal({ children, className, delay = 0, ...props }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback for environments without IntersectionObserver: reveal on the
    // next frame (deferred so we don't setState synchronously in the effect).
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none",
        shown
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
