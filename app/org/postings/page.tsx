"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PostingCard } from "@/components/org/PostingCard";
import { MOCK_POSTINGS } from "@/components/dashboard/dashboard.mock";
import type { PostingStatus } from "@/components/dashboard/dashboard.types";

const TABS: { key: string; label: string; match: (s: PostingStatus) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "active", label: "Active", match: (s) => s === "active" },
  { key: "draft", label: "Draft", match: (s) => s === "draft" },
  { key: "closed", label: "Closed", match: (s) => s === "closed" || s === "paused" },
];

export default function OrgPostingsPage() {
  const [active, setActive] = useState("all");
  const tab = TABS.find((t) => t.key === active)!;
  const filtered = MOCK_POSTINGS.filter((p) => tab.match(p.status));

  return (
    <div className="mx-auto max-w-4xl">
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
          const count = MOCK_POSTINGS.filter((p) => t.match(p.status)).length;
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

      {filtered.length === 0 ? (
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
