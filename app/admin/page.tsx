"use client";

import { useEffect, useState } from "react";
import { Building2, Users, Briefcase, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ChartCard } from "@/components/charts/ChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { TrendBarChart } from "@/components/charts/TrendBarChart";
import { toDonutData } from "@/lib/dashboard/chart-data";
import { getPlatformStats, getAdminCharts, type PlatformStats, type AdminCharts } from "@/lib/api/admin";

function StatCard({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: number | undefined;
  icon: React.ElementType;
  highlight?: boolean;
}) {
  return (
    <Card className={`p-5 gap-0 ${highlight ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-500/10" : "border-border"}`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`size-4 ${highlight ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`} />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className={`text-3xl font-bold tabular-nums ${highlight ? "text-amber-700 dark:text-amber-300" : "text-foreground"}`}>
        {value ?? "—"}
      </p>
    </Card>
  );
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [charts, setCharts] = useState<AdminCharts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlatformStats()
      .then(setStats)
      .catch((e) => setError(e?.message ?? "Failed to load stats"));
    // Charts fall back to dummy data if the endpoint isn't reachable.
    getAdminCharts().then(setCharts).catch(() => {});
  }, []);

  const usersByRole = charts ? toDonutData(charts.usersByRole) : [];
  const orgsByVerification = charts ? toDonutData(charts.orgsByVerification) : [];
  const postingsByStatus = charts ? toDonutData(charts.postingsByStatus) : [];
  const signups = charts?.signupsMonthly ?? [];
  const applications = charts?.applicationsMonthly ?? [];
  const newPostings = charts?.postingsMonthly ?? [];

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertTriangle className="size-4 shrink-0" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground">Live snapshot of Scholify platform activity.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Users" value={stats?.totalUsers} icon={Users} />
        <StatCard label="Organizations" value={stats?.totalOrgs} icon={Building2} />
        <StatCard
          label="Pending Verifications"
          value={stats?.pendingOrgVerifications}
          icon={AlertTriangle}
          highlight={(stats?.pendingOrgVerifications ?? 0) > 0}
        />
        <StatCard label="Total Postings" value={stats?.totalPostings} icon={Briefcase} />
        <StatCard label="Active Postings" value={stats?.activePostings} icon={CheckCircle2} />
        <StatCard label="Applications" value={stats?.totalApplications} icon={FileText} />
        <StatCard label="Verified Students" value={stats?.verifiedStudents} icon={Users} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Users by role" subtitle="Platform composition">
          <DonutChart data={usersByRole} centerLabel="Users" emptyMessage="No users yet" />
        </ChartCard>
        <ChartCard title="Organizations by status" subtitle="Verification pipeline">
          <DonutChart data={orgsByVerification} centerLabel="Orgs" emptyMessage="No organizations yet" />
        </ChartCard>
        <ChartCard title="Postings by status" subtitle="Platform-wide">
          <DonutChart data={postingsByStatus} centerLabel="Postings" emptyMessage="No postings yet" />
        </ChartCard>
        <ChartCard title="New signups" subtitle="Per month">
          <TrendBarChart data={signups} emptyMessage="No signups yet" />
        </ChartCard>
        <ChartCard title="Applications" subtitle="Platform-wide, per month">
          <TrendBarChart data={applications} emptyMessage="No applications yet" />
        </ChartCard>
        <ChartCard title="New postings" subtitle="Per month">
          <TrendBarChart data={newPostings} emptyMessage="No postings yet" />
        </ChartCard>
      </div>
    </div>
  );
}
