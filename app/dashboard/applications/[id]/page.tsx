"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  CalendarClock,
  Check,
  Copy,
  Download,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ApplicationTimeline } from "@/components/dashboard/ApplicationTimeline";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { MOCK_APPLICATIONS } from "@/components/dashboard/dashboard.mock";
import { STATUS_FLOW, formatDate, formatStatus, statusStepIndex } from "@/components/dashboard/dashboard.utils";
import { FileQuestion } from "lucide-react";

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const application = MOCK_APPLICATIONS.find((a) => a.id === params.id);
  const [copied, setCopied] = useState(false);

  if (!application) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          Icon={FileQuestion}
          title="Application not found"
          description="This application doesn't exist or has been removed."
          actionLabel="Back to applications"
          actionHref="/dashboard/applications"
        />
      </div>
    );
  }

  const a = application;
  const currentStep = statusStepIndex(a.status);
  const rejected = a.status === "not-selected";

  function copyId() {
    navigator.clipboard.writeText(a.id);
    setCopied(true);
    toast.success("Application ID copied");
    setTimeout(() => setCopied(false), 1500);
  }

  function withdraw() {
    // TODO: PATCH /applications/:id { status: 'withdrawn' }
    toast.success("Application withdrawn");
    router.push("/dashboard/applications");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/applications"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to applications
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold text-foreground">{a.itemTitle}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{a.organizationName}</p>
              </div>
              <StatusBadge status={a.status} size="md" />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{a.id}</span>
              <button
                onClick={copyId}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Copy application ID"
              >
                {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              </button>
            </div>

            {/* Status stepper */}
            {!a.isExternal && (
              <div className="mt-6 flex items-center">
                {STATUS_FLOW.map((s, i) => {
                  const done = currentStep > i;
                  const current = currentStep === i;
                  return (
                    <div key={s} className="flex flex-1 items-center last:flex-none">
                      <div className="flex flex-col items-center gap-1.5">
                        <span
                          className={cn(
                            "flex size-7 items-center justify-center rounded-full text-xs font-semibold",
                            done && "bg-emerald-600 text-white",
                            current && !rejected && "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-600 dark:bg-emerald-500/20",
                            current && rejected && "bg-red-100 text-red-700 ring-2 ring-red-500",
                            !done && !current && "bg-muted text-muted-foreground"
                          )}
                        >
                          {done ? <Check className="size-4" /> : i + 1}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {i === 3 && rejected ? "Decision" : formatStatus(s)}
                        </span>
                      </div>
                      {i < STATUS_FLOW.length - 1 && (
                        <div className={cn("mx-1 h-0.5 flex-1", done ? "bg-emerald-600" : "bg-border")} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="mt-6 rounded-xl border border-border bg-white p-6 dark:bg-card">
            <h2 className="mb-4 font-semibold text-foreground">Timeline</h2>
            <ApplicationTimeline events={a.timeline} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-5 dark:bg-card">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Quick info</h2>
            <dl className="space-y-3 text-sm">
              {a.deadlineAt && (
                <div className="flex items-center gap-2.5">
                  <CalendarClock className="size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Deadline</dt>
                    <dd className="text-foreground">{formatDate(a.deadlineAt)}</dd>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <CalendarClock className="size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">Applied</dt>
                  <dd className="text-foreground">{formatDate(a.appliedAt)}</dd>
                </div>
              </div>
              {a.fundingAmount && (
                <div className="flex items-center gap-2.5">
                  <Banknote className="size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Funding</dt>
                    <dd className="text-foreground">{a.fundingAmount}</dd>
                  </div>
                </div>
              )}
              {a.location && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Location</dt>
                    <dd className="text-foreground">{a.location}</dd>
                  </div>
                </div>
              )}
            </dl>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="outline" size="lg" className="w-full">
              <Download className="size-4" /> Download application PDF
            </Button>
            {!["withdrawn", "not-selected", "accepted"].includes(a.status) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="lg" className="w-full">
                    Withdraw application
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Withdraw this application?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will withdraw your application for &ldquo;{a.itemTitle}&rdquo;. This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={withdraw}>Withdraw</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
