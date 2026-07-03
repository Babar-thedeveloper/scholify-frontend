import Link from "next/link";
import { Mail } from "lucide-react";
import { CONTAINER, footer, type FooterLink } from "./homepage.data";

/* lucide-react (this version) ships no brand glyphs, so inline minimal SVGs. */
function BrandIcon({ name }: { name: NonNullable<FooterLink["icon"]> }) {
  const common = "size-4 shrink-0";
  if (name === "mail") return <Mail className={common} />;
  if (name === "whatsapp")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.115zm5.392-6.262c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    );
  if (name === "instagram")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  if (name === "linkedin")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    );
  return null;
}

function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <ul>
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="flex items-center gap-2 py-1.5 text-sm text-slate-400 transition-colors hover:text-white"
          >
            {link.icon ? <BrandIcon name={link.icon} /> : null}
            <span>{link.label}</span>
            {link.badge ? (
              <span className="ml-1 rounded bg-emerald-900 px-2 py-0.5 text-xs text-emerald-200">
                {link.badge}
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-slate-900 pb-8 pt-16 text-slate-300">
      <div className={CONTAINER}>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                S
              </span>
              Scholify
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              {footer.tagline}
            </p>
            <p className="mt-3 text-sm text-slate-400">
              {footer.madeIn} <span aria-hidden="true">🇵🇰</span>
            </p>
          </div>

          {/* Link columns */}
          {footer.columns.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-4 text-sm font-semibold text-white">
                {col.heading}
              </h3>
              <FooterLinks links={col.links} />
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-400 md:flex-row">
          <p>© 2026 Scholify. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            {footer.legal.map((item, i) => (
              <span key={item.label} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden="true">·</span> : null}
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </span>
            ))}
          </div>
          <p>
            Proudly Pakistani <span aria-hidden="true">🇵🇰</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
