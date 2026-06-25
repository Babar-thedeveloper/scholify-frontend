"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  CalendarClock,
  UserPlus,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { MOCK_NOTIFICATIONS_STUDENT } from "@/components/dashboard/dashboard.mock";
import type { AppNotification } from "@/components/dashboard/dashboard.types";
import { timeAgo } from "@/components/dashboard/dashboard.utils";
import { cn } from "@/lib/utils";

const ICONS: Record<AppNotification["type"], LucideIcon> = {
  "application-status": CheckCircle2,
  "deadline-reminder": CalendarClock,
  "new-applicant": UserPlus,
  system: Megaphone,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>(
    MOCK_NOTIFICATIONS_STUDENT
  );

  function markAllAsRead() {
    // TODO: wire to API
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Notifications"
        action={
          <Button variant="outline" onClick={markAllAsRead} disabled={!hasUnread}>
            Mark all as read
          </Button>
        }
      />

      {notifications.length === 0 ? (
        <EmptyState Icon={Bell} title="You're all caught up" />
      ) : (
        <div className="dash-stagger flex flex-col gap-3">
          {notifications.map((n) => {
            const Icon = ICONS[n.type];
            const row = (
              <div
                className={cn(
                  "dash-card flex items-start gap-4 rounded-xl border border-border bg-white p-5 dark:bg-card",
                  !n.read && "bg-emerald-50/40 dark:bg-emerald-500/5"
                )}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.subtitle}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
                {!n.read && (
                  <span
                    className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500"
                    aria-label="Unread"
                  />
                )}
              </div>
            );

            return n.link ? (
              <Link key={n.id} href={n.link} className="block">
                {row}
              </Link>
            ) : (
              <div key={n.id}>{row}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
