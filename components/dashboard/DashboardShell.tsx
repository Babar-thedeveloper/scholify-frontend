"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScholifyLogo } from "@/components/scholify-logo";
import { ModeToggle } from "@/components/mode-toggle";
import { AvatarDropdown } from "@/components/shared/AvatarDropdown";
import { NotificationDropdown } from "@/components/shared/NotificationDropdown";
import {
  MOCK_NOTIFICATIONS_ORG,
  MOCK_NOTIFICATIONS_STUDENT,
} from "@/components/dashboard/dashboard.mock";

interface DashboardShellProps {
  variant: "student" | "org";
  sidebar: (props: { onNavigate?: () => void }) => React.ReactNode;
  children: React.ReactNode;
}

export function DashboardShell({ variant, sidebar, children }: DashboardShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const notifications =
    variant === "org" ? MOCK_NOTIFICATIONS_ORG : MOCK_NOTIFICATIONS_STUDENT;
  const notifHref = variant === "org" ? "/org/notifications" : "/dashboard/notifications";

  return (
    <div className="flex min-h-screen bg-emerald-50/30 dark:bg-background">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border md:block">
        {sidebar({})}
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white px-4 dark:bg-card md:hidden">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="flex size-9 items-center justify-center rounded-md text-foreground hover:bg-muted"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                {sidebar({ onNavigate: () => setOpen(false) })}
              </SheetContent>
            </Sheet>
            <Link href="/" aria-label="Scholify home">
              <ScholifyLogo className="h-7 w-auto" />
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <ModeToggle />
            <NotificationDropdown notifications={notifications} viewAllHref={notifHref} />
            <AvatarDropdown />
          </div>
        </header>

        {/* Desktop top bar (notifications + avatar) */}
        <header className="sticky top-0 z-30 hidden h-14 items-center justify-end gap-1 border-b border-border bg-white/80 px-6 backdrop-blur dark:bg-card/80 md:flex">
          <ModeToggle />
          <NotificationDropdown notifications={notifications} viewAllHref={notifHref} />
          <AvatarDropdown />
        </header>

        <main key={pathname} className="page-enter flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
