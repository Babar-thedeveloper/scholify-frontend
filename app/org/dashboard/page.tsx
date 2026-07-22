"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ShieldAlert, Sparkles, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { TrendBarChart } from "@/components/charts/TrendBarChart";
import { toDonutData } from "@/lib/dashboard/chart-data";
import { PostingCard } from "@/components/org/PostingCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { timeAgo } from "@/components/dashboard/dashboard.utils";
import type { Posting, ApplicationStatus } from "@/components/dashboard/dashboard.types";
import { listMyPostings, toDashboardPosting } from "@/lib/api/postings";
import { listOrgApplicants, type ApplicationStatusKey } from "@/lib/api/applications";
import { getMyOrg, getOrgCharts, type OrgProfileDto, type OrgCharts } from "@/lib/api/organizations";

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

interface RecentApplicant {
  id: string;
  name: string;
  initials: string;
  postingTitle: string;
  appliedAt: string;
  status: ApplicationStatus;
}

export default function OrgDashboardPage() {
  const [postings, setPostings] = useState<Posting[]>([]);
  const [applicants, setApplicants] = useState<RecentApplicant[]>([]);
  const [org, setOrg] = useState<OrgProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [charts, setCharts] = useState<OrgCharts | null>(null);

  // Charts fall back to dummy data if the endpoint is unreachable.
  useEffect(() => {
    getOrgCharts().then(setCharts).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [postingsRes, applicantsRes, orgProfile] = await Promise.all([
          listMyPostings(),
          listOrgApplicants({ pageSize: 5, sort: "recent" }),
          getMyOrg(),
        ]);
        if (cancelled) return;
        setPostings(postingsRes.items.map(toDashboardPosting));
        setApplicants(
          applicantsRes.items.map((a) => ({
            id: a.publicId,
            name: a.student.fullName || a.student.email,
            initials: a.student.initials,
            postingTitle: a.postingTitle,
            appliedAt: a.submittedAt ?? a.createdAt,
            status: STATUS_MAP[a.status] ?? "submitted",
          }))
        );
        setOrg(orgProfile);
      } catch {
        // empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const activePostings = postings.filter((p) => p.status === "active");
  const totalApplicants = postings.reduce((sum, p) => sum + p.applicantCount, 0);
  const newThisWeek = postings.reduce((sum, p) => sum + p.newApplicantCount, 0);
  const shortlisted = applicants.filter((a) => a.status === "shortlisted" || a.status === "interview").length;

  const orgName = org?.name ?? "Organization";
  const orgVerified = org?.verified ?? true;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome, {orgName} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your postings
        </p>
      </div>

      {!orgVerified && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-200 border-l-4 border-l-amber-400 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-200">
                Your organization is pending verification
              </p>
              <p className="text-sm text-amber-800/80 dark:text-amber-200/70">
                You can create draft postings but they won&apos;t be public until approved.
              </p>
            </div>
          </div>
          <Button asChild className="shrink-0 gap-1.5 bg-amber-500 hover:bg-amber-600">
            <Link href="/org/profile">
              Speed up verification <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="dash-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard value={activePostings.length} label="Active postings" Icon={BriefcaseBusiness} featured />
        <StatsCard value={totalApplicants} label="Total applicants" Icon={Users} accent="text-blue-600" />
        <StatsCard value={newThisWeek} label="New this week" Icon={UserPlus} accent="text-violet-600" />
        <StatsCard value={shortlisted} label="Shortlisted" Icon={Sparkles} accent="text-purple-600" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Applicants by status" subtitle="Across all your postings">
          <DonutChart
            data={charts ? toDonutData(charts.applicantsByStatus) : []}
            centerLabel="Applicants"
            emptyMessage="No applicants yet"
          />
        </ChartCard>
        <ChartCard title="Postings by status" subtitle="Your current postings">
          <DonutChart
            data={charts ? toDonutData(charts.postingsByStatus) : []}
            centerLabel="Postings"
            emptyMessage="No postings yet"
          />
        </ChartCard>
        <ChartCard title="Applications received" subtitle="Per month">
          <TrendBarChart data={charts?.applicationsMonthly ?? []} emptyMessage="No applications yet" />
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Recent postings */}
        <section className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent postings</h2>
            <Link href="/org/postings" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {activePostings.length > 0 ? (
              activePostings.slice(0, 3).map((p) => (
                <PostingCard key={p.id} posting={p} />
              ))
            ) : (
              <Card className="border-border gap-0 p-6 text-center">
                <p className="text-sm text-muted-foreground">No active postings yet.</p>
                <Link href="/org/postings/new" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                  Create a posting →
                </Link>
              </Card>
            )}
          </div>
        </section>

        {/* Recent applicants */}
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent applicants</h2>
            <Link href="/org/applicants" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <Card className="border-border gap-0">
            {applicants.length > 0 ? (
              applicants.map((a) => (
                <Link
                  key={a.id}
                  href={`/org/applicants/${a.id}`}
                  className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-muted/40"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                    {a.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{a.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.postingTitle} · {timeAgo(a.appliedAt)}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </Link>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground">No applicants yet.</p>
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}
