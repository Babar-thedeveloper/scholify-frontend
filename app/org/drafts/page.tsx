"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileEdit, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PostingCard } from "@/components/org/PostingCard";
import { listMyPostings, toDashboardPosting } from "@/lib/api/postings";
import type { Posting } from "@/components/dashboard/dashboard.types";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await listMyPostings();
        if (cancelled) return;
        setDrafts(
          res.items
            .map(toDashboardPosting)
            .filter((p) => p.status === "draft")
        );
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
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Drafts"
        subtitle="Postings you haven't published yet"
        action={
          <Button asChild>
            <Link href="/org/postings/new">
              <Plus className="size-4" /> New posting
            </Link>
          </Button>
        }
      />

      {drafts.length === 0 ? (
        <EmptyState
          Icon={FileEdit}
          title="No drafts"
          description="Start a posting and save it as a draft to continue later."
          actionLabel="Create a posting"
          actionHref="/org/postings/new"
        />
      ) : (
        <div className="dash-stagger flex flex-col gap-3">
          {drafts.map((p) => (
            <PostingCard key={p.id} posting={p} />
          ))}
        </div>
      )}
    </div>
  );
}
