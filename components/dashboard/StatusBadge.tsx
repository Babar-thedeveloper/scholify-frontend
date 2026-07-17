import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatStatus } from "./dashboard.utils";
import type { ApplicationStatus } from "./dashboard.types";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  submitted: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  "under-review": "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  shortlisted: "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  interview: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  accepted: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "not-selected": "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  withdrawn: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  "external-applied":
    "bg-slate-50 text-slate-600 italic dark:bg-slate-800/60 dark:text-slate-400",
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, className, size = "sm" }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-transparent rounded-full",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        STATUS_STYLES[status],
        className
      )}
    >
      {formatStatus(status)}
    </Badge>
  );
}
