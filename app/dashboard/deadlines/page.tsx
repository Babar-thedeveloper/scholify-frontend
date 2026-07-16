"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { daysUntil, formatDeadline } from "@/components/dashboard/dashboard.utils";
import { cn } from "@/lib/utils";
import { listSaved, type SavedItemDto } from "@/lib/api/saved";
import { listMyApplications, type ApplicationDto } from "@/lib/api/applications";

interface DeadlineRow {
  key: string;
  title: string;
  org: string;
  deadlineAt: string;
}

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<DeadlineRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [savedRes, appsRes] = await Promise.all([
          listSaved(),
          listMyApplications({ pageSize: 50 }),
        ]);
        if (cancelled) return;

        const rows: DeadlineRow[] = [];

        for (const item of savedRes.items) {
          if (item.deadlineAt) {
            rows.push({
              key: `saved-${item.id}`,
              title: item.postingTitle,
              org: item.organizationName,
              deadlineAt: item.deadlineAt,
            });
          }
        }

        for (const app of appsRes.items) {
          if (app.deadlineAt) {
            rows.push({
              key: `app-${app.publicId}`,
              title: app.postingTitle,
              org: app.organizationName,
              deadlineAt: app.deadlineAt,
            });
          }
        }

        const filtered = rows
          .filter((row) => {
            const left = daysUntil(row.deadlineAt);
            return left !== null && left >= 0;
          })
          .sort(
            (a, b) => (daysUntil(a.deadlineAt) ?? 0) - (daysUntil(b.deadlineAt) ?? 0)
          );

        setDeadlines(filtered);
      } catch {
        // empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Deadlines" subtitle="Stay ahead of every closing date" />

      {deadlines.length === 0 ? (
        <EmptyState Icon={CalendarDays} title="No upcoming deadlines" />
      ) : (
        <div className="dash-stagger flex flex-col gap-3">
          {deadlines.map((row) => {
            const left = daysUntil(row.deadlineAt) ?? 0;
            const badgeClass =
              left <= 3
                ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                : left <= 7
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                  : "bg-muted text-muted-foreground";

            return (
              <div
                key={row.key}
                className="dash-card flex items-center justify-between gap-4 rounded-xl border border-border bg-white p-5 dark:bg-card"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-medium text-foreground">{row.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{row.org}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDeadline(row.deadlineAt)}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                    badgeClass
                  )}
                >
                  {left === 0
                    ? "Today"
                    : `${left} ${left === 1 ? "day" : "days"} left`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
