import { Users } from "lucide-react";
import { ApplicantRow } from "./ApplicantRow";
import type { Applicant } from "@/components/dashboard/dashboard.types";

interface ApplicantTableProps {
  applicants: Applicant[];
  showPosting?: boolean;
}

export function ApplicantTable({ applicants, showPosting = false }: ApplicantTableProps) {
  if (applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white py-16 text-center dark:bg-card">
        <Users className="size-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">No applicants yet</p>
        <p className="text-sm text-muted-foreground">
          Applicants will appear here once students apply.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white dark:bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">University</th>
              {showPosting && <th className="hidden px-4 py-3 lg:table-cell">Posting</th>}
              <th className="px-4 py-3">GPA</th>
              <th className="hidden px-4 py-3 sm:table-cell">Applied</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a) => (
              <ApplicantRow key={a.id} applicant={a} showPosting={showPosting} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
