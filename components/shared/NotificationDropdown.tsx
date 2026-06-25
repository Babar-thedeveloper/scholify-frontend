"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  UserPlus,
  Megaphone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/components/dashboard/dashboard.utils";
import type { AppNotification } from "@/components/dashboard/dashboard.types";

const TYPE_ICON = {
  "application-status": CheckCircle2,
  "deadline-reminder": CalendarClock,
  "new-applicant": UserPlus,
  system: Megaphone,
} as const;

interface NotificationDropdownProps {
  notifications: AppNotification[];
  viewAllHref: string;
}

export function NotificationDropdown({
  notifications,
  viewAllHref,
}: NotificationDropdownProps) {
  const [items, setItems] = useState(notifications);
  const unread = items.filter((n) => !n.read).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        >
          <Bell className="size-5" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-background" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-medium text-primary hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {items.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          ) : (
            items.map((n) => {
              const Icon = TYPE_ICON[n.type];
              const content = (
                <div
                  className={cn(
                    "flex gap-3 px-4 py-3 transition-colors hover:bg-muted/60",
                    !n.read && "bg-emerald-50/40 dark:bg-emerald-500/5"
                  )}
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-foreground">
                      {n.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {n.subtitle}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                </div>
              );
              return n.link ? (
                <Link key={n.id} href={n.link} className="block">
                  {content}
                </Link>
              ) : (
                <div key={n.id}>{content}</div>
              );
            })
          )}
        </div>

        <div className="border-t border-border p-2">
          <Link
            href={viewAllHref}
            className="block rounded-lg py-2 text-center text-sm font-medium text-primary hover:bg-muted"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
