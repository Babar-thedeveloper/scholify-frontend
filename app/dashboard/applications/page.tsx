"use client";

import { useState } from "react";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { MOCK_APPLICATIONS } from "@/components/dashboard/dashboard.mock";
import type { ApplicationStatus } from "@/components/dashboard/dashboard.types";

type Tab = { key: string; label: string; match: (s: ApplicationStatus) => boolean };

const TABS: Tab[] = [
  { key: "all", label: "All", match: () => true },
  { key: "submitted", label: "Submitted", match: (s) => s === "submitted" || s === "external-applied" },
  { key: "under-review", label: "Under Review", match: (s) => s === "under-review" },
  { key: "shortlisted", label: "Shortlisted", match: (s) => s === "shortlisted" || s === "interview" },
  { key: "accepted", label: "Accepted", match: (s) => s === "accepted" },
  { key: "closed", label: "Closed", match: (s) => s === "not-selected" || s === "withdrawn" },
];

export default function ApplicationsPage() {
  const [active, setActive] = useState("all");
  const tab = TABS.find((t) => t.key === active)!;
  const filtered = MOCK_APPLICATIONS.filter((a) => tab.match(a.status));

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="My Applications"
        subtitle="Track all your scholarship and internship applications in one place"
      />

      {/* Status tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const count = MOCK_APPLICATIONS.filter((a) => t.match(a.status)).length;
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
          Icon={Briefcase}
          title="No applications yet"
          description="When you apply to scholarships or internships, they'll show up here."
          actionLabel="Browse scholarships"
          actionHref="/scholarships"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((a) => (
            <ApplicationCard key={a.id} application={a} />
          ))}
        </div>
      )}
    </div>
  );
}
