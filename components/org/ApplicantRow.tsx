import Link from "next/link";
import { TableRow, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { timeAgo } from "@/components/dashboard/dashboard.utils";
import type { Applicant } from "@/components/dashboard/dashboard.types";

export function ApplicantRow({ applicant, showPosting = false }: { applicant: Applicant; showPosting?: boolean }) {
  const a = applicant;
  return (
    <TableRow>
      <TableCell>
        <Link href={`/org/applicants/${a.id}`} className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
            {a.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-foreground hover:text-primary">
              {a.name}
            </span>
            <span className="block truncate text-xs text-muted-foreground">{a.fieldOfStudy}</span>
          </span>
        </Link>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{a.university}</TableCell>
      {showPosting && (
        <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
          {a.postingTitle}
        </TableCell>
      )}
      <TableCell className="text-sm text-foreground">{a.gpa}</TableCell>
      <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
        {timeAgo(a.appliedAt)}
      </TableCell>
      <TableCell>
        <StatusBadge status={a.status} />
      </TableCell>
    </TableRow>
  );
}
