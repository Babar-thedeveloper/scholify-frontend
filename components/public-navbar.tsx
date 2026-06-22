"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

export function PublicNavbar() {
  const pathname = usePathname();
  const isRoot = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full rounded-none",
        isRoot
          ? "glass"
          : "border-b border-border bg-background"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:max-w-8xl 2xl:max-w-screen-2xl">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg shadow-[0_6px_20px_-6px_rgba(5,150,105,0.7)]">
            S
          </span>
          <span>Scholify</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/scholarships" className={cn("transition-colors", pathname.startsWith("/scholarships") ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground")}>
            Scholarships
          </Link>
          <Link href="/internships" className={cn("transition-colors", pathname.startsWith("/internships") ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground")}>
            Internships
          </Link>
          <Link href="/ai-cv" className={cn("inline-flex items-center gap-1.5 transition-colors", pathname.startsWith("/ai-cv") ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground")}>
            AI CV
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">Soon</span>
          </Link>
          <Link href="/about" className={cn("transition-colors", pathname.startsWith("/about") ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground")}>
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
