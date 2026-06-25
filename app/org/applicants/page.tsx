"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ApplicantTable } from "@/components/org/ApplicantTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_APPLICANTS, MOCK_POSTINGS } from "@/components/dashboard/dashboard.mock";
import { formatStatus, ORG_STATUS_OPTIONS } from "@/components/dashboard/dashboard.utils";
import type { ApplicationStatus } from "@/components/dashboard/dashboard.types";

type SortKey = "recent" | "oldest" | "gpa" | "name";

export default function ApplicantsPage() {
  const [posting, setPosting] = useState("all");
  const [status, setStatus] = useState("all");
  const [university, setUniversity] = useState("all");
  const [sort, setSort] = useState<SortKey>("recent");

  const postings = useMemo(() => {
    const seen = new Set<string>();
    return MOCK_POSTINGS.filter((p) => {
      if (seen.has(p.title)) return false;
      seen.add(p.title);
      return true;
    });
  }, []);

  const universities = useMemo(
    () => Array.from(new Set(MOCK_APPLICANTS.map((a) => a.university))).sort(),
    []
  );

  const result = useMemo(() => {
    const list = MOCK_APPLICANTS.filter((a) => {
      if (posting !== "all" && a.postingId !== posting) return false;
      if (status !== "all" && a.status !== status) return false;
      if (university !== "all" && a.university !== university) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case "recent":
          return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
        case "oldest":
          return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
        case "gpa":
          return parseFloat(b.gpa) - parseFloat(a.gpa);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [posting, status, university, sort]);

  return (
    <div>
      <PageHeader title="Applicants" subtitle="Everyone who applied to your postings" />

      <div className="mb-4 flex flex-wrap gap-3">
        <Select value={posting} onValueChange={setPosting}>
          <SelectTrigger className="h-9 w-[200px] text-sm">
            <SelectValue placeholder="All postings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All postings</SelectItem>
            {postings.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-[180px] text-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORG_STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {formatStatus(s as ApplicationStatus)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={university} onValueChange={setUniversity}>
          <SelectTrigger className="h-9 w-[200px] text-sm">
            <SelectValue placeholder="All universities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All universities</SelectItem>
            {universities.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="h-9 w-[180px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="gpa">GPA (highest)</SelectItem>
            <SelectItem value="name">Name (A–Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">
        {result.length} {result.length === 1 ? "applicant" : "applicants"}
      </p>

      {result.length === 0 ? (
        <EmptyState
          Icon={Users}
          title="No applicants match these filters"
          description="Try adjusting or clearing your filters to see more applicants."
        />
      ) : (
        <ApplicantTable applicants={result} showPosting />
      )}
    </div>
  );
}
