"use client";

import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
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
import type { Applicant, ApplicationStatus } from "@/components/dashboard/dashboard.types";
import {
  type ApplicationStatusKey,
  type ListOrgApplicantsParams,
  type OrgApplicantDto,
  listOrgApplicants,
} from "@/lib/api/applications";
import { listMyPostings, type MyPostingDto } from "@/lib/api/postings";
import { ApiError } from "@/lib/api/client";

type SortKey = NonNullable<ListOrgApplicantsParams["sort"]>;

// backend key → UI label
const STATUS_LABEL: Record<ApplicationStatusKey, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  shortlisted: "Shortlisted",
  interview: "Interview",
  accepted: "Accepted",
  not_selected: "Not selected",
  withdrawn: "Withdrawn",
};

// backend snake_case → dashboard kebab-case (for the ApplicantTable component).
const STATUS_MAP: Record<ApplicationStatusKey, ApplicationStatus> = {
  draft: "draft",
  submitted: "submitted",
  under_review: "under-review",
  shortlisted: "shortlisted",
  interview: "interview",
  accepted: "accepted",
  not_selected: "not-selected",
  withdrawn: "withdrawn",
};

function toApplicant(dto: OrgApplicantDto): Applicant {
  return {
    id: dto.publicId,
    applicationId: dto.publicId,
    postingId: dto.postingId,
    postingTitle: dto.postingTitle,
    name: dto.student.fullName || dto.student.email,
    initials: dto.student.initials,
    email: dto.student.email,
    university: dto.student.university ?? "—",
    degreeLevel: dto.student.degreeLevel ?? "—",
    fieldOfStudy: dto.student.fieldOfStudy ?? "—",
    gpa: dto.student.cgpa ?? "—",
    city: "",
    appliedAt: dto.submittedAt ?? dto.createdAt,
    status: STATUS_MAP[dto.status] ?? "submitted",
    coverLetter: dto.coverLetter ?? undefined,
  };
}

export default function ApplicantsPage() {
  const [posting, setPosting] = useState("all");
  const [status, setStatus] = useState<"all" | ApplicationStatusKey>("all");
  const [university, setUniversity] = useState("all");
  const [sort, setSort] = useState<SortKey>("recent");

  const [postings, setPostings] = useState<MyPostingDto[]>([]);
  const [applicants, setApplicants] = useState<OrgApplicantDto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posting list once for the dropdown.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await listMyPostings();
        if (!cancelled) setPostings(res.items);
      } catch {
        /* silent — dropdown gracefully degrades to "All postings" only */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Fetch applicants whenever filters change (server-side filter).
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const params: ListOrgApplicantsParams = {
          postingId: posting !== "all" ? posting : undefined,
          status: status !== "all" ? status : undefined,
          university: university !== "all" ? university : undefined,
          sort,
          pageSize: 50,
        };
        const res = await listOrgApplicants(params);
        if (cancelled) return;
        setApplicants(res.items);
        setTotal(res.total);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Couldn't load applicants");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [posting, status, university, sort]);

  const universities = useMemo(
    () =>
      Array.from(
        new Set(applicants.map((a) => a.student.university).filter((u): u is string => !!u))
      ).sort(),
    [applicants]
  );

  const rows = useMemo(() => applicants.map(toApplicant), [applicants]);

  return (
    <div>
      <PageHeader title="Applicants" subtitle="Everyone who applied to your postings" />

      <div className="mb-4 flex flex-wrap gap-3">
        <Select value={posting} onValueChange={setPosting}>
          <SelectTrigger className="h-9 w-[220px] text-sm">
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

        <Select
          value={status}
          onValueChange={(v) => setStatus(v as "all" | ApplicationStatusKey)}
        >
          <SelectTrigger className="h-9 w-[180px] text-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(STATUS_LABEL) as ApplicationStatusKey[])
              .filter((k) => k !== "draft" && k !== "withdrawn")
              .map((k) => (
                <SelectItem key={k} value={k}>
                  {STATUS_LABEL[k]}
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
            <SelectItem value="gpa_desc">GPA (highest)</SelectItem>
            <SelectItem value="name_asc">Name (A–Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">
        {total} {total === 1 ? "applicant" : "applicants"}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Spinner size="md" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-medium">Couldn&apos;t load applicants</p>
          <p className="mt-1 text-destructive/80">{error}</p>
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          Icon={Users}
          title="No applicants match these filters"
          description="Try adjusting or clearing your filters to see more applicants."
        />
      ) : (
        <ApplicantTable applicants={rows} showPosting />
      )}
    </div>
  );
}
