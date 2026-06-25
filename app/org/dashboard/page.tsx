import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ShieldAlert, Sparkles, UserPlus, Users } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PostingCard } from "@/components/org/PostingCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MOCK_APPLICANTS, MOCK_POSTINGS } from "@/components/dashboard/dashboard.mock";
import { timeAgo } from "@/components/dashboard/dashboard.utils";

// Flip to false to preview the pending-verification banner.
const ORG_VERIFIED = true;

export default function OrgDashboardPage() {
  const recentPostings = MOCK_POSTINGS.filter((p) => p.status === "active").slice(0, 3);
  const recentApplicants = MOCK_APPLICANTS.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome, Daraz 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your postings
        </p>
      </div>

      {!ORG_VERIFIED && (
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
          <Link
            href="/org/profile"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Speed up verification <ArrowRight className="size-4" />
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard value={5} label="Active postings" Icon={BriefcaseBusiness} />
        <StatsCard value={142} label="Total applicants" Icon={Users} accent="text-blue-600" />
        <StatsCard value={23} label="New this week" Icon={UserPlus} accent="text-violet-600" />
        <StatsCard value={3} label="Shortlisted" Icon={Sparkles} accent="text-purple-600" />
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
            {recentPostings.map((p) => (
              <PostingCard key={p.id} posting={p} />
            ))}
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
          <div className="rounded-xl border border-border bg-white dark:bg-card">
            {recentApplicants.map((a) => (
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
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
