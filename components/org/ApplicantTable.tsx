import { Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <TableHead>Student</TableHead>
            <TableHead>University</TableHead>
            {showPosting && <TableHead className="hidden lg:table-cell">Posting</TableHead>}
            <TableHead>GPA</TableHead>
            <TableHead className="hidden sm:table-cell">Applied</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map((a) => (
            <ApplicantRow key={a.id} applicant={a} showPosting={showPosting} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
