// ─────────────────────────────────────────────────────────────
// ListingHero — enhanced gradient header (heading + subheading)
// for listing pages. Copy is page-specific. Emerald-only to match
// the site hero.
// ─────────────────────────────────────────────────────────────
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
}

export function ListingHero({ title, subtitle, Icon }: Props) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 px-6 py-6 text-white shadow-sm sm:px-8 sm:py-7">
      {/* decorative glow blobs + oversized faded icon */}
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-16 size-52 rounded-full bg-white/10 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 right-28 size-48 rounded-full bg-black/10 blur-2xl" />
      <Icon aria-hidden className="pointer-events-none absolute -right-3 bottom-1 hidden size-36 text-white/10 sm:block" strokeWidth={1.25} />

      <div className="relative flex items-start gap-3.5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
          <Icon className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-emerald-50/90 sm:text-[15px]">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
