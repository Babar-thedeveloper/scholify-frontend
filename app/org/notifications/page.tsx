"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Bell,
  CalendarClock,
  CheckCheck,
  CheckCircle2,
  Megaphone,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { MOCK_NOTIFICATIONS_ORG } from "@/components/dashboard/dashboard.mock";
import { timeAgo } from "@/components/dashboard/dashboard.utils";
import type { AppNotification } from "@/components/dashboard/dashboard.types";

const ICONS: Record<AppNotification["type"], LucideIcon> = {
  "application-status": CheckCircle2,
  "deadline-reminder": CalendarClock,
  "new-applicant": UserPlus,
  system: Megaphone,
};

export default function OrgNotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>(
    () => MOCK_NOTIFICATIONS_ORG.map((n) => ({ ...n }))
  );

  const hasUnread = notifications.some((n) => !n.read);

  function markAllRead() {
    // TODO: API — mark all notifications read
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Notifications"
        subtitle="Updates on applicants, postings and your organization"
        action={
          notifications.length > 0 ? (
            <Button variant="outline" onClick={markAllRead} disabled={!hasUnread}>
              <CheckCheck className="size-4" /> Mark all as read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState Icon={Bell} title="You're all caught up" />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = ICONS[n.type];
            const row = (
              <div
                className={`flex items-start gap-3 rounded-xl border border-border p-4 ${
                  n.read ? "bg-white dark:bg-card" : "bg-emerald-50/40 dark:bg-emerald-950/10"
                }`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {n.subtitle} · {timeAgo(n.createdAt)}
                  </p>
                </div>
                {!n.read && (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500" />
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
