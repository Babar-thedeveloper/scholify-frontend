"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { ScholifyLogo } from "@/components/scholify-logo";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/auth/UserContext";
import { AvatarDropdown } from "@/components/shared/AvatarDropdown";
import { NotificationDropdown } from "@/components/shared/NotificationDropdown";
import { CvEntryModal } from "@/components/cv/CvEntryModal";

interface NavLink {
  href: string;
  label: string;
}

const GUEST_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/internships", label: "Internships" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact us" },
];

const STUDENT_LINKS: NavLink[] = [
  { href: "/scholarships", label: "Scholarships" },
  { href: "/internships", label: "Internships" },
  { href: "/dashboard/applications", label: "My Applications" },
];

const ORG_LINKS: NavLink[] = [
  { href: "/org/dashboard", label: "Dashboard" },
  { href: "/org/postings", label: "My Postings" },
  { href: "/org/applicants", label: "Applicants" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useUser();
  const isRoot = pathname === "/";
  const [cvModalOpen, setCvModalOpen] = useState(false);

  const links =
    role === "student" ? STUDENT_LINKS : role === "org" ? ORG_LINKS : GUEST_LINKS;

  function handleCvBuilderClick() {
    if (role === "student") {
      setCvModalOpen(true);
    } else {
      router.push("/login?next=/dashboard/cv");
    }
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

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {links.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "transition-colors",
                    active
                      ? "font-semibold text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              );
            })}

            {/* CV Builder- shown for students and guests, hidden for orgs */}
            {role !== "org" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCvBuilderClick}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Sparkles className="size-3.5 text-emerald-500" />
                <span>CV Builder</span>
              </Button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />

            {role === "guest" && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
              </>
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
          </div>
        </div>
      </header>

      <CvEntryModal open={cvModalOpen} onClose={() => setCvModalOpen(false)} />
    </>
  );
}
