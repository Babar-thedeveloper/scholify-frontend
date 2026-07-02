"use client";

import { useEffect, useState } from "react";
import { Building2, Users, Briefcase, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getPlatformStats, type PlatformStats } from "@/lib/api/admin";

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
    <div className={`rounded-xl border p-5 ${highlight ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-500/10" : "border-border bg-white dark:bg-card"}`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`size-4 ${highlight ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`} />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className={`text-3xl font-bold tabular-nums ${highlight ? "text-amber-700 dark:text-amber-300" : "text-foreground"}`}>
        {value ?? "—"}
      </p>
    </div>
  );
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlatformStats()
      .then(setStats)
      .catch((e) => setError(e?.message ?? "Failed to load stats"));
  }, []);

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
    </div>
  );
}
