import Link from "next/link";
import { ArrowRight, Bell, Bookmark, CalendarClock, ListChecks, Target } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import { ProfileCompletionBanner } from "@/components/dashboard/ProfileCompletionBanner";
import { MOCK_APPLICATIONS, MOCK_SAVED_ITEMS } from "@/components/dashboard/dashboard.mock";
import { daysUntil } from "@/components/dashboard/dashboard.utils";

export default function StudentOverviewPage() {
  const recent = MOCK_APPLICATIONS.filter((a) => a.status !== "withdrawn").slice(0, 4);
  const closingSoon = MOCK_SAVED_ITEMS.filter((s) => {
    const d = daysUntil(s.deadlineAt);
    return d !== null && d >= 0 && d <= 30;
  }).slice(0, 4);

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back, Ayesha 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your applications
        </p>
      </div>

      {/* Stats */}
      <div className="dash-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard value={3} label="Active applications" Icon={ListChecks} />
        <StatsCard value={12} label="Saved items" Icon={Bookmark} accent="text-blue-600" />
        <StatsCard value={2} label="Closing this week" Icon={CalendarClock} accent="text-red-600" />
        <StatsCard value="85%" label="Profile complete" Icon={Target} accent="text-amber-600" />
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
            {recent.map((a) => (
              <ApplicationCard key={a.id} application={a} />
            ))}
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
            {closingSoon.map((s) => {
              const left = daysUntil(s.deadlineAt) ?? 0;
              const urgent = left <= 3;
              return (
                <div
                  key={s.id}
                  className="rounded-xl border border-border bg-white p-4 dark:bg-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                    {s.reminderSet && (
                      <Bell className="size-4 shrink-0 text-emerald-600" aria-label="Reminder set" />
                    )}
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
                      href="/scholarships"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Apply now →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Profile completion */}
      <div className="mt-6">
        <ProfileCompletionBanner percent={85} />
      </div>
    </div>
  );
}
