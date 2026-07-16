"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import {
  Bookmark,
  Briefcase,
  CalendarClock,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { daysUntil, formatDeadline } from "@/components/dashboard/dashboard.utils";
import { listSaved, unsavePosting, type SavedItemDto } from "@/lib/api/saved";
import { ApiError } from "@/lib/api/client";
import { handleApiError } from "@/lib/api/handle-error";

type Filter = "all" | "scholarship" | "internship";

const CHIPS: { key: Filter; label: string }[] = [
  { key: "all", label: "All saved" },
  { key: "scholarship", label: "Scholarships" },
  { key: "internship", label: "Internships" },
];

export default function SavedItemsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [items, setItems] = useState<SavedItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await listSaved();
      setItems(res.items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load saved items");
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

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((s) => s.type === filter)),
    [items, filter]
  );

  async function unsave(postingId: string) {
    // Optimistic removal — undo on failure.
    const prev = items;
    setItems((p) => p.filter((s) => s.postingId !== postingId));
    try {
      await unsavePosting(postingId);
      toast.success("Removed from saved items");
    } catch (err) {
      setItems(prev);
      handleApiError(err, "Couldn't remove.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Saved Items"
        subtitle="Scholarships and internships you've bookmarked for later"
      />

      {/* Filter chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CHIPS.map((c) => {
          const count =
            c.key === "all"
              ? items.length
              : items.filter((s) => s.type === c.key).length;
          return (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                filter === c.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-muted-foreground hover:text-foreground dark:bg-card"
              )}
            >
              {c.label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Spinner size="md" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-medium">Couldn&apos;t load saved items</p>
          <p className="mt-1 text-destructive/80">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          Icon={Bookmark}
          title={items.length === 0 ? "Nothing saved yet" : "No items match this filter"}
          description={
            items.length === 0
              ? "Browse scholarships and internships, and bookmark the ones you like."
              : undefined
          }
          actionLabel={items.length === 0 ? "Browse internships" : undefined}
          actionHref={items.length === 0 ? "/internships" : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const left = daysUntil(item.deadlineAt ?? undefined);
            const urgent = left !== null && left >= 0 && left <= 3;
            const money =
              item.type === "scholarship"
                ? item.fundingAmount
                : item.stipendAmount
                  ? `PKR ${Number(item.stipendAmount).toLocaleString()}/month`
                  : null;
            return (
              <div
                key={item.postingId}
                className="group relative rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-sm dark:bg-card"
              >
                {/* Bookmark toggle */}
                <button
                  onClick={() => unsave(item.postingId)}
                  className="absolute right-3 top-3 rounded-md p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                  aria-label="Remove from saved"
                >
                  <Bookmark className="size-4 fill-current" />
                </button>

                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {item.type === "scholarship" ? (
                    <GraduationCap className="size-3" />
                  ) : (
                    <Briefcase className="size-3" />
                  )}
                  {item.type === "scholarship" ? "Scholarship" : "Internship"}
                </span>

                <h3 className="mt-3 pr-6 text-sm font-semibold leading-snug text-foreground">
                  {item.postingTitle}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.organizationName}
                </p>

                <div className="mt-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
                  {item.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3 shrink-0" /> {item.location}
                    </span>
                  )}
                  {money && (
                    <span className="font-medium text-foreground">{money}</span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium",
                      urgent ? "text-red-600" : "text-muted-foreground"
                    )}
                  >
                    <CalendarClock className="size-3" />
                    {item.deadlineAt ? formatDeadline(item.deadlineAt) : "No deadline"}
                  </span>
                </div>

                <Link
                  href={`/postings/${item.postingSlug}`}
                  className="mt-3 block text-center text-xs font-medium text-primary hover:underline"
                >
                  View details →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
