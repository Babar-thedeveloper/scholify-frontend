"use client";

import Link from "next/link";
import { FileEdit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PostingCard } from "@/components/org/PostingCard";
import { MOCK_POSTINGS } from "@/components/dashboard/dashboard.mock";

export default function DraftsPage() {
  const drafts = MOCK_POSTINGS.filter((p) => p.status === "draft");

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
