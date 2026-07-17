"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Bookmark, CalendarClock, ListChecks, Target } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import { ProfileCompletionBanner } from "@/components/dashboard/ProfileCompletionBanner";
import { daysUntil } from "@/components/dashboard/dashboard.utils";
import type { Application, ApplicationStatus } from "@/components/dashboard/dashboard.types";
import { listMyApplications, type ApplicationDto } from "@/lib/api/applications";
import { listSaved, type SavedItemDto } from "@/lib/api/saved";
import { getMyProfile } from "@/lib/api/users";
import { useUser } from "@/components/auth/UserContext";

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

export default function StudentOverviewPage() {
  const { user } = useUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItemDto[]>([]);
  const [profilePercent, setProfilePercent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [appsRes, savedRes, profile] = await Promise.all([
          listMyApplications({ pageSize: 5 }),
          listSaved(),
          getMyProfile(),
        ]);
        if (cancelled) return;
        setApplications(appsRes.items.map(toDashboardApplication));
        setSavedItems(savedRes.items);
        setProfilePercent(profile.completionPercent);
      } catch {
        // fall back to empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const recent = applications.slice(0, 4);
  const closingSoon = savedItems
    .filter((s) => {
      const d = daysUntil(s.deadlineAt ?? undefined);
      return d !== null && d >= 0 && d <= 30;
    })
    .slice(0, 4);

  const activeCount = applications.filter(
    (a) => a.status !== "withdrawn" && a.status !== "not-selected" && a.status !== "accepted"
  ).length;
  const closingThisWeek = savedItems.filter((s) => {
    const d = daysUntil(s.deadlineAt ?? undefined);
    return d !== null && d >= 0 && d <= 7;
  }).length;

  const firstName = user?.name?.split(" ")[0] || "there";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your applications
        </p>
      </div>

      {/* Stats */}
      <div className="dash-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard value={activeCount} label="Active applications" Icon={ListChecks} />
        <StatsCard value={savedItems.length} label="Saved items" Icon={Bookmark} accent="text-blue-600" />
        <StatsCard value={closingThisWeek} label="Closing this week" Icon={CalendarClock} accent="text-red-600" />
        <StatsCard value={`${profilePercent}%`} label="Profile complete" Icon={Target} accent="text-amber-600" />
      </div>

      {/* Two columns */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Recent applications (60%) */}
        <section className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent Applications</h2>
            <Link
              href="/dashboard/applications"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recent.length > 0 ? (
              recent.map((a) => (
                <ApplicationCard key={a.id} application={a} />
              ))
            ) : (
              <Card className="gap-0 border-border p-6 text-center">
                <p className="text-sm text-muted-foreground">No applications yet.</p>
                <Link href="/scholarships" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                  Browse scholarships →
                </Link>
              </Card>
            )}
          </div>
        </section>

        {/* Closing soon (40%) */}
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Closing soon</h2>
            <Link
              href="/scholarships"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {closingSoon.length > 0 ? (
              closingSoon.map((s) => {
                const left = daysUntil(s.deadlineAt ?? undefined) ?? 0;
                const urgent = left <= 3;
                return (
                  <Card
                    key={s.id}
                    className="gap-0 border-border p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{s.postingTitle}</h3>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.organizationName}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={
                          urgent
                            ? "text-xs font-semibold text-red-600"
                            : "text-xs font-medium text-muted-foreground"
                        }
                      >
                        {left} {left === 1 ? "day" : "days"} left
                      </span>
                      <Link
                        href={`/postings/${s.postingSlug}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Apply now →
                      </Link>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="gap-0 border-border p-6 text-center">
                <p className="text-sm text-muted-foreground">Nothing closing soon.</p>
                <Link href="/internships" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                  Browse internships →
                </Link>
              </Card>
            )}
          </div>
        </section>
      </div>

      {/* Profile completion */}
      <div className="mt-6">
        <ProfileCompletionBanner percent={profilePercent} />
      </div>
    </div>
  );
}
