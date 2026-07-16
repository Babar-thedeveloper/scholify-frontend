"use client";

// ─────────────────────────────────────────────────────────────
// Notification bell + dropdown.
//
// Delivery model: polling. Backend has a cheap GET /unread-count
// endpoint we hit every 30s to update the red dot on the bell.
// The full list is only fetched when the dropdown opens (or after
// a mutation like mark-all-read). This keeps traffic minimal while
// UI stays live.
//
// We upgrade to Server-Sent Events (SSE) once concurrent users
// justify the infra work — API layer is designed to be a drop-in.
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  Megaphone,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/components/dashboard/dashboard.utils";
import {
  type NotificationDto,
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notifications";
import { useUser } from "@/components/auth/UserContext";

const POLL_INTERVAL_MS = 30_000;

const TYPE_ICON: Record<string, typeof Bell> = {
  application_status: CheckCircle2,
  deadline_reminder: CalendarClock,
  new_applicant: UserPlus,
  posting_published: Megaphone,
  verification: CheckCircle2,
  system: Megaphone,
};

interface Props {
  viewAllHref: string;
}

export function NotificationDropdown({ viewAllHref }: Props) {
  const { isAuthed, isLoading: authLoading } = useUser();

  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<NotificationDto[]>([]);
  const [open, setOpen] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  // ─── Poll unread count while authed ─────────────────────
  useEffect(() => {
    if (authLoading || !isAuthed) return;

    let cancelled = false;
    async function tick() {
      try {
        const c = await getUnreadCount();
        if (!cancelled) setUnread(c);
      } catch {
        /* silent — bell just doesn't tick */
      }
    }
    void tick();
    const t = setInterval(tick, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [authLoading, isAuthed]);

  // ─── Fetch list when the menu opens ─────────────────────
  const fetchList = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await listNotifications({ pageSize: 8 });
      setItems(res.items);
    } catch {
      /* silent */
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (open) void fetchList();
  }, [open, fetchList]);

  // ─── Mark actions ───────────────────────────────────────
  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
      setUnread(0);
    } catch {
      /* silent — polling will resync */
    }
  }

  async function handleItemClick(n: NotificationDto) {
    if (n.readAt) return;
    try {
      await markNotificationRead(n.id);
      setItems((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x))
      );
      setUnread((u) => Math.max(0, u - 1));
    } catch {
      /* silent — polling will resync */
    }
  }

  // Hidden entirely for guests.
  if (!isAuthed) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        >
          <Bell className="size-5" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-background" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          {unread > 0 && (
            <Button
              variant="link"
              size="xs"
              onClick={handleMarkAllRead}
              className="h-auto p-0 text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {loadingList ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="sm" />
            </div>
          ) : items.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          ) : (
            items.map((n) => {
              const Icon = TYPE_ICON[n.type] ?? Megaphone;
              const isRead = !!n.readAt;
              const content = (
                <div
                  className={cn(
                    "flex gap-3 px-4 py-3 transition-colors hover:bg-muted/60",
                    !isRead && "bg-emerald-50/40 dark:bg-emerald-500/5"
                  )}
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-foreground">
                      {n.title}
                    </p>
                    {n.subtitle && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {n.subtitle}
                      </p>
                    )}
                    <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  {!isRead && (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500" />
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
                  {content}
                </Link>
              ) : (
                <button
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className="block w-full cursor-pointer text-left"
                >
                  {content}
                </button>
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
