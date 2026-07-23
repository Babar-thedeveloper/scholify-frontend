"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Bell,
  CalendarClock,
  CheckCheck,
  CheckCircle2,
  Loader2,
  Megaphone,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { timeAgo } from "@/components/dashboard/dashboard.utils";
import { cn } from "@/lib/utils";
import {
  type NotificationDto,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notifications";
import { ApiError } from "@/lib/api/client";

const ICONS: Record<string, LucideIcon> = {
  application_status: CheckCircle2,
  deadline_reminder: CalendarClock,
  new_applicant: UserPlus,
  posting_published: Megaphone,
  verification: CheckCircle2,
  system: Megaphone,
};

interface Props {
  /** Slot rendered above the list- the parent's PageHeader. */
  header: (opts: {
    hasUnread: boolean;
    onMarkAllRead: () => void;
    marking: boolean;
  }) => React.ReactNode;
}

export function NotificationsList({ header }: Props) {
  const [items, setItems] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await listNotifications({ pageSize: 50 });
      setItems(res.items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await load();
      if (cancelled) setItems([]);
    })();
    return () => { cancelled = true; };
  }, [load]);

  const hasUnread = items.some((n) => !n.readAt);

  async function handleMarkAllRead() {
    setMarking(true);
    try {
      const res = await markAllNotificationsRead();
      const now = new Date().toISOString();
      setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? now })));
      toast.success(res.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't mark all read");
    } finally {
      setMarking(false);
    }
  }

  async function handleItemClick(n: NotificationDto) {
    if (n.readAt) return;
    try {
      await markNotificationRead(n.id);
      setItems((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x))
      );
    } catch {
      /* silent */
    }
  }

  return (
    <>
      {header({ hasUnread, onMarkAllRead: handleMarkAllRead, marking })}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Spinner size="md" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-medium">Couldn&apos;t load notifications</p>
          <p className="mt-1 text-destructive/80">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState Icon={Bell} title="You're all caught up" />
      ) : (
        <div className="dash-stagger flex flex-col gap-3">
          {items.map((n) => {
            const Icon = ICONS[n.type] ?? Megaphone;
            const isRead = !!n.readAt;
            const row = (
              <div
                className={cn(
                  "dash-card flex items-start gap-4 rounded-xl border border-border bg-white p-5 dark:bg-card",
                  !isRead && "bg-emerald-50/40 dark:bg-emerald-500/5"
                )}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{n.title}</p>
                  {n.subtitle && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.subtitle}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
                {!isRead && (
                  <span
                    className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500"
                    aria-label="Unread"
                  />
                )}
              </div>
            );

            return n.link ? (
              <Link
                key={n.id}
                href={n.link}
                className="block"
                onClick={() => handleItemClick(n)}
              >
                {row}
              </Link>
            ) : (
              <button
                key={n.id}
                onClick={() => handleItemClick(n)}
                className="block w-full text-left"
              >
                {row}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

/** Convenience: the standard "Mark all as read" action button. */
export function MarkAllReadButton({
  hasUnread,
  onClick,
  marking,
}: {
  hasUnread: boolean;
  onClick: () => void;
  marking: boolean;
}) {
  return (
    <Button variant="outline" onClick={onClick} disabled={!hasUnread || marking}>
      {marking ? <Spinner size="sm" /> : <CheckCheck className="size-4" />}
      Mark all as read
    </Button>
  );
}
