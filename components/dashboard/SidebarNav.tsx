"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScholifyLogo } from "@/components/scholify-logo";
import { useUser } from "@/components/auth/UserContext";

export interface SidebarItem {
  label: string;
  href: string;
  Icon: LucideIcon;
  badge?: string | number;
  /** Suffix text shown right-aligned, e.g. "85%" for profile completion */
  meta?: string;
  /** Match exactly instead of prefix (for index routes like /dashboard) */
  exact?: boolean;
  /** Show a golden PRO badge */
  pro?: boolean;
}

export interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

interface SidebarNavProps {
  sections: SidebarSection[];
  /** Rendered above the sections — e.g. the org "+ New posting" CTA */
  topSlot?: React.ReactNode;
  onNavigate?: () => void;
}

export function SidebarNav({ sections, topSlot, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const isOrg = user.role === "org";

  return (
    <div className="flex h-full flex-col bg-white/60 backdrop-blur-xl dark:bg-card/50">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <Link href="/" aria-label="Scholify home">
          <ScholifyLogo className="h-8 w-auto" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {topSlot && <div className="mb-4">{topSlot}</div>}

        {sections.map((section) => (
          <div key={section.label} className="mb-2">
            <p className="mb-2 mt-4 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-emerald-50 font-medium text-emerald-700 before:absolute before:-left-3 before:top-1/2 before:h-6 before:-translate-y-1/2 before:w-1 before:rounded-r-full before:bg-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300 dark:before:bg-emerald-400"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.Icon className="size-[18px] shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.pro && (
                        <span className="ml-auto rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-900 shadow-sm">
                          PRO
                        </span>
                      )}
                      {item.badge != null && (
                        <span className="ml-auto rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                          {item.badge}
                        </span>
                      )}
                      {item.meta && (
                        <span className="ml-auto text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          {item.meta}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer user card */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
              isOrg
                ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
            )}
          >
            {user.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              {isOrg &&
                (user.organization?.verified ? (
                  <BadgeCheck className="size-3.5 shrink-0 text-emerald-600" />
                ) : (
                  <Clock className="size-3.5 shrink-0 text-amber-600" />
                ))}
            </div>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
