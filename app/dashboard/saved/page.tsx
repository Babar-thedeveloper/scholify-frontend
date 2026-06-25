"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  GraduationCap,
  Briefcase,
  MapPin,
  CalendarClock,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { MOCK_SAVED_ITEMS } from "@/components/dashboard/dashboard.mock";
import { daysUntil, formatDeadline } from "@/components/dashboard/dashboard.utils";
import type { SavedItem } from "@/components/dashboard/dashboard.types";

type Filter = "all" | "scholarship" | "internship";

const CHIPS: { key: Filter; label: string }[] = [
  { key: "all", label: "All saved" },
  { key: "scholarship", label: "Scholarships" },
  { key: "internship", label: "Internships" },
];

export default function SavedItemsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [items, setItems] = useState<SavedItem[]>(MOCK_SAVED_ITEMS);

  const filtered =
    filter === "all" ? items : items.filter((s) => s.type === filter);

  function unsave(id: string) {
    setItems((prev) => prev.filter((s) => s.id !== id));
    // TODO: DELETE /saved/:id when the API exists.
    toast.success("Removed from saved items");
  }

  return (
    <div className="mx-auto max-w-5xl">
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

      {filtered.length === 0 ? (
        <EmptyState
          Icon={Bookmark}
          title="Nothing saved yet"
          description="Browse scholarships and internships, and bookmark the ones you like."
          actionLabel="Browse scholarships"
          actionHref="/scholarships"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const left = daysUntil(item.deadlineAt);
            const urgent = left !== null && left >= 0 && left <= 3;
            return (
              <div
                key={item.id}
                className="group relative rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-sm dark:bg-card"
              >
                {/* Bookmark toggle */}
                <button
                  onClick={() => unsave(item.id)}
                  className="absolute right-3 top-3 rounded-md p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                  aria-label="Remove from saved"
                >
                  <Bookmark className="size-4 fill-current" />
                </button>

                {/* Type badge */}
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {item.type === "scholarship" ? (
                    <GraduationCap className="size-3" />
                  ) : (
                    <Briefcase className="size-3" />
                  )}
                  {item.type === "scholarship" ? "Scholarship" : "Internship"}
                </span>

                <h3 className="mt-3 pr-6 text-sm font-semibold leading-snug text-foreground">
                  {item.title}
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
                  {(item.fundingAmount || item.stipend) && (
                    <span className="font-medium text-foreground">
                      {item.fundingAmount || item.stipend}
                    </span>
                  )}
                </div>

                {/* Deadline + reminder */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium",
                      urgent
                        ? "text-red-600"
                        : "text-muted-foreground"
                    )}
                  >
                    <CalendarClock className="size-3" />
                    {item.deadlineAt ? formatDeadline(item.deadlineAt) : "No deadline"}
                  </span>
                  {item.reminderSet && (
                    <Bell
                      className="size-3.5 text-emerald-600 dark:text-emerald-400"
                      aria-label="Reminder set"
                    />
                  )}
                </div>

                {/* Apply link */}
                <Link
                  href="/scholarships"
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
