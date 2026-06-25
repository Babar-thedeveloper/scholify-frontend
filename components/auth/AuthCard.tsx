import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScholifyLogo } from "@/components/scholify-logo";

interface AuthCardProps {
  children: React.ReactNode;
  /** Width of the white form half — wider for the multi-field signup form */
  size?: "sm" | "md";
  aside: {
    title: string;
    text: string;
    switchPrompt: string;
    switchLabel: string;
    switchHref: string;
  };
}

export function AuthCard({ children, size = "sm", aside }: AuthCardProps) {
  return (
    <div
      className={`mx-auto flex w-full ${
        size === "sm" ? "max-w-[760px]" : "max-w-[880px]"
      } max-h-[calc(100vh-4rem)] overflow-hidden rounded-3xl border border-border/40 bg-white shadow-2xl shadow-emerald-900/10 duration-500 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 dark:bg-card dark:shadow-black/40`}
    >
      <div className="grid w-full grid-cols-1 md:grid-cols-[40%_60%]">

        {/* ── GREEN BRANDING HALF (fixed, never scrolls) ── */}
        <aside className="group relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 p-7 text-white md:p-8">
          {/* animated decorative shapes */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-125" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-teal-400/20 transition-transform duration-700 group-hover:scale-110" />
          <div className="pointer-events-none absolute right-6 top-1/3 size-3 rotate-45 rounded-sm bg-white/20 motion-safe:animate-pulse" />
          <div className="pointer-events-none absolute left-10 bottom-1/3 size-2 rounded-full bg-white/25 motion-safe:animate-pulse [animation-delay:600ms]" />
          {/* sheen sweep */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 w-fit transition-opacity hover:opacity-80"
            aria-label="Scholify home"
          >
            <ScholifyLogo className="h-7 w-auto" variant="white" />
          </Link>

          {/* Welcome message + switch CTA */}
          <div className="relative z-10 my-8 duration-700 animate-in fade-in-0 slide-in-from-left-4 md:my-0">
            <h2 className="text-2xl font-bold leading-tight md:text-[1.7rem]">
              {aside.title}
            </h2>
            <p className="mt-3 max-w-[15rem] text-sm leading-relaxed text-emerald-50/90">
              {aside.text}
            </p>

            <p className="mt-6 text-xs text-emerald-100/80">{aside.switchPrompt}</p>
            <Button
              asChild
              variant="outline"
              className="mt-2 h-9 rounded-full border-white/70 bg-transparent px-7 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-white hover:text-emerald-700 hover:shadow-lg"
            >
              <Link href={aside.switchHref}>{aside.switchLabel}</Link>
            </Button>
          </div>

          {/* Footer flag line */}
          <p className="relative z-10 hidden text-[11px] text-emerald-100/70 md:block">
            Proudly made in Pakistan 🇵🇰
          </p>
        </aside>

        {/* ── WHITE FORM HALF (scrolls internally) ── */}
        <div className="auth-scroll overflow-y-auto px-6 py-7 sm:px-8 sm:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
