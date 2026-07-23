"use client";

import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import type { Application, ApplicationStatus } from "@/components/dashboard/dashboard.types";
import { listMyApplications, type ApplicationDto } from "@/lib/api/applications";
import { ApiError } from "@/lib/api/client";

type Tab = { key: string; label: string; match: (s: ApplicationStatus) => boolean };

const TABS: Tab[] = [
  { key: "all",          label: "All",          match: () => true },
  { key: "submitted",    label: "Submitted",    match: (s) => s === "submitted" },
  { key: "under-review", label: "Under Review", match: (s) => s === "under-review" },
  { key: "shortlisted",  label: "Shortlisted",  match: (s) => s === "shortlisted" || s === "interview" },
  { key: "accepted",     label: "Accepted",     match: (s) => s === "accepted" },
  { key: "closed",       label: "Closed",       match: (s) => s === "not-selected" || s === "withdrawn" },
];

// Backend uses snake_case status keys; the dashboard's Application type
// uses kebab-case (established earlier). Translate at the boundary.
const STATUS_MAP: Record<string, ApplicationStatus> = {
  draft: "draft",
  submitted: "submitted",
  under_review: "under-review",
  shortlisted: "shortlisted",
  interview: "interview",
  accepted: "accepted",
  not_selected: "not-selected",
  withdrawn: "withdrawn",
};

function toDashboardApplication(dto: ApplicationDto): Application {
  return {
    id: dto.publicId,
    type: dto.type,
    status: STATUS_MAP[dto.status] ?? "submitted",
    isExternal: false,
    studentId: "",
    itemId: dto.postingId,
    itemTitle: dto.postingTitle,
    organizationName: dto.organizationName,
    location: dto.location ?? undefined,
    fundingAmount: dto.fundingAmount ?? undefined,
    appliedAt: dto.submittedAt ?? dto.createdAt,
    deadlineAt: dto.deadlineAt ?? undefined,
    lastStatusChangeAt: dto.lastStatusChangeAt,
    timeline: [],
  };
}

export default function ApplicationsPage() {
  const [active, setActive] = useState("all");
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await listMyApplications({ pageSize: 50 });
        if (cancelled) return;
        setItems(res.items.map(toDashboardApplication));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Couldn't load your applications");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const tab = TABS.find((t) => t.key === active)!;
  const filtered = useMemo(() => items.filter((a) => tab.match(a.status)), [items, tab]);

  return (
    <div>
      <PageHeader
        title="My Applications"
        subtitle="Track all your scholarship and internship applications in one place"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const count = items.filter((a) => t.match(a.status)).length;
          return (
            <Button
              key={t.key}
              variant={active === t.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActive(t.key)}
              className="rounded-full"
            >
              {t.label} ({count})
            </Button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Spinner size="md" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-medium">Couldn&apos;t load your applications</p>
          <p className="mt-1 text-destructive/80">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          Icon={Briefcase}
          title={items.length === 0 ? "No applications yet" : "No applications match this filter"}
          description={
            items.length === 0
              ? "When you apply to scholarships or internships, they'll show up here."
              : undefined
          }
          actionLabel={items.length === 0 ? "Browse internships" : undefined}
          actionHref={items.length === 0 ? "/internships" : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((a) => (
            <ApplicationCard key={a.id} application={a} />
          ))}
        </div>
      )}
    </div>
  );
}
