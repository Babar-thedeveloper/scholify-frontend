"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PostingCard } from "@/components/org/PostingCard";
import type { Posting, PostingStatus } from "@/components/dashboard/dashboard.types";
import { listMyPostings, toDashboardPosting } from "@/lib/api/postings";
import { ApiError } from "@/lib/api/client";

const TABS: { key: string; label: string; match: (s: PostingStatus) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "active", label: "Active", match: (s) => s === "active" },
  { key: "draft", label: "Draft", match: (s) => s === "draft" },
  { key: "closed", label: "Closed", match: (s) => s === "closed" || s === "paused" },
];

export default function OrgPostingsPage() {
  const [active, setActive] = useState("all");
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await listMyPostings();
        if (cancelled) return;
        setPostings(res.items.map(toDashboardPosting));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Couldn't load your postings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const tab = TABS.find((t) => t.key === active)!;
  const filtered = postings.filter((p) => tab.match(p.status));

  return (
    <div>
      <PageHeader
        title="My Postings"
        subtitle="Manage your scholarships and internships"
        action={
          <Button asChild>
            <Link href="/org/postings/new">
              <Plus className="size-4" /> Create new posting
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const count = postings.filter((p) => t.match(p.status)).length;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active === t.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-muted-foreground hover:text-foreground dark:bg-card"
              )}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-medium">Couldn&apos;t load your postings</p>
          <p className="mt-1 text-destructive/80">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          Icon={FileText}
          title="No postings here"
          description="Create your first posting to start receiving applicants."
          actionLabel="Create posting"
          actionHref="/org/postings/new"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p) => (
            <PostingCard key={p.id} posting={p} />
          ))}
        </div>
      )}
    </div>
  );
}
