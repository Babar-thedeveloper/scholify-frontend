import Link from "next/link";
import { Eye, MoreHorizontal, Pause, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDeadline, timeAgo } from "@/components/dashboard/dashboard.utils";
import type { Posting } from "@/components/dashboard/dashboard.types";

const POSTING_STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  closed: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  paused: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
} as const;

export function PostingCard({ posting }: { posting: Posting }) {
  const p = posting;
  const meta =
    p.type === "internship"
      ? [
          "Internship",
          p.duration,
          p.workMode ? `${p.workMode}${p.city ? ` ${p.city}` : ""}` : undefined,
        ]
      : ["Scholarship", p.fundingAmount, p.countryScope];

  return (
    <Card hover className="gap-0 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/org/postings/${p.id}`}
            className="font-semibold text-foreground hover:text-primary hover:underline"
          >
            {p.title}
          </Link>
          <p className="mt-0.5 text-sm capitalize text-muted-foreground">
            {meta.filter(Boolean).join(" · ")}
          </p>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            "shrink-0 rounded-full border-transparent capitalize",
            POSTING_STATUS_STYLES[p.status]
          )}
        >
          {p.status}
        </Badge>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{p.applicantCount}</span> applicants
        {p.newApplicantCount > 0 && (
          <Badge size="xs" className="ml-1.5 rounded-full border-transparent bg-emerald-100 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            {p.newApplicantCount} new
          </Badge>
        )}
        {" · "}Posted {timeAgo(p.postedAt)}
      </p>
      {p.deadlineAt && (
        <p className="mt-1 text-sm text-muted-foreground">Closes: {formatDeadline(p.deadlineAt)}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <Button size="sm" variant="outline" asChild>
          <Link href={`/org/postings/${p.id}`}>
            <Eye className="size-3.5" /> View applicants
          </Link>
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/org/postings/${p.id}`}>
            <Pencil className="size-3.5" /> Edit
          </Link>
        </Button>
        <Button size="sm" variant="ghost">
          <Pause className="size-3.5" /> Pause
        </Button>
        <Button size="icon-sm" variant="ghost" className="ml-auto" aria-label="More actions">
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
