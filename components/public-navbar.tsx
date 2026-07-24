"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { ScholifyLogo } from "@/components/scholify-logo";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/auth/UserContext";
import { AvatarDropdown } from "@/components/shared/AvatarDropdown";
import { NotificationDropdown } from "@/components/shared/NotificationDropdown";
import { CvEntryModal } from "@/components/cv/CvEntryModal";

interface NavItem {
  label: string;
  href?: string;        // regular link
  action?: "cv";        // special (opens CV builder flow)
  gold?: boolean;       // golden sparkle icon (premium)
}

const GUEST_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/internships", label: "Internships" },
  { action: "cv", label: "CV Builder", gold: true },
  { href: "/ai-finder", label: "AI Opportunity Finder", gold: true },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact us" },
];

const STUDENT_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/internships", label: "Internships" },
  { action: "cv", label: "CV Builder", gold: true },
  { href: "/ai-finder", label: "AI Opportunity Finder", gold: true },
  { href: "/dashboard/applications", label: "My Applications" },
];

const ORG_ITEMS: NavItem[] = [
  { href: "/org/dashboard", label: "Dashboard" },
  { href: "/org/postings", label: "My Postings" },
  { href: "/org/applicants", label: "Applicants" },
];

function GoldSparkle() {
  return (
    <Sparkles className="size-3.5 shrink-0 text-amber-400 [fill:currentColor] drop-shadow-[0_0_6px_rgba(251,191,36,0.45)]" />
  );
}

export function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useUser();
  const isRoot = pathname === "/";
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = role === "student" ? STUDENT_ITEMS : role === "org" ? ORG_ITEMS : GUEST_ITEMS;

  function handleCvBuilderClick() {
    setMobileOpen(false);
    if (role === "student") setCvModalOpen(true);
    else router.push("/login?next=/dashboard/cv");
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  function renderItem(item: NavItem, mobile: boolean) {
    const content = (
      <>
        {item.gold && <GoldSparkle />}
        <span>{item.label}</span>
      </>
    );

    if (item.action === "cv") {
      return (
        <button
          key="cv"
          type="button"
          onClick={handleCvBuilderClick}
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium transition-colors",
            mobile
              ? "w-full rounded-lg px-3 py-2.5 text-foreground hover:bg-muted"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {content}
        </button>
      );
    }

    const active = isActive(item.href!);
    return (
      <Link
        key={item.href}
        href={item.href!}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex items-center gap-1.5 text-sm font-medium transition-colors",
          mobile
            ? active
              ? "rounded-lg bg-emerald-50 px-3 py-2.5 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "rounded-lg px-3 py-2.5 text-foreground hover:bg-muted"
            : active
              ? "font-semibold text-primary"
              : "text-muted-foreground hover:text-foreground"
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full rounded-none",
          isRoot ? "glass" : "border-b border-border bg-background"
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:max-w-8xl 2xl:max-w-screen-2xl">
          <Link href="/" className="flex items-center" aria-label="Scholify home">
            <ScholifyLogo className="h-10 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 lg:flex">
            {items.map((it) => renderItem(it, false))}
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />

            {role === "guest" && (
              <div className="hidden items-center gap-2 sm:flex">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
              </div>
            )}

            {role === "student" && (
              <>
                <NotificationDropdown viewAllHref="/dashboard/notifications" />
                <AvatarDropdown />
              </>
            )}

            {role === "org" && (
              <>
                <Button size="sm" className="hidden sm:inline-flex" asChild>
                  <Link href="/org/postings/new">
                    <Plus className="size-4" />
                    Post opportunity
                  </Link>
                </Button>
                <NotificationDropdown viewAllHref="/org/notifications" />
                <AvatarDropdown />
              </>
            )}

            {/* Hamburger- mobile / tablet */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="border-t border-border bg-background px-3 py-3 lg:hidden">
            <nav className="flex flex-col gap-0.5">
              {items.map((it) => renderItem(it, true))}
            </nav>

            {role === "guest" && (
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                <Button variant="outline" asChild>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>Get started</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      <CvEntryModal open={cvModalOpen} onClose={() => setCvModalOpen(false)} />
    </>
  );
}
