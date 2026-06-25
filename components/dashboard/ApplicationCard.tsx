import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { formatDeadline, timeAgo } from "./dashboard.utils";
import type { Application } from "./dashboard.types";

export function ApplicationCard({ application }: { application: Application }) {
  const a = application;
  const external = a.isExternal;

  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4 transition-shadow hover:shadow-sm dark:bg-card sm:p-5",
        external ? "border-dashed border-border/80" : "border-border"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-foreground">{a.itemTitle}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {a.organizationName}
            {a.location ? ` · ${a.location}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <StatusBadge status={a.status} />
          {external && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Applied externally
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        <span className="font-mono">{a.id}</span> · Applied {timeAgo(a.appliedAt)}
      </p>

      {a.deadlineAt && (
        <p className="mt-1 text-xs text-muted-foreground">
          Deadline: {formatDeadline(a.deadlineAt)}
        </p>
      )}

      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-sm">
        <Link
          href={`/dashboard/applications/${a.id}`}
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          View details <ArrowRight className="size-3.5" />
        </Link>
        {external && a.externalUrl && (
          <a
            href={a.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            View on official site <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
