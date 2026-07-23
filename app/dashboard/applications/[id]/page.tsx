"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  CalendarClock,
  Check,
  Copy,
  FileQuestion,
  Loader2,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ApplicationTimeline } from "@/components/dashboard/ApplicationTimeline";
import { EmptyState } from "@/components/dashboard/EmptyState";
import type {
  ApplicationStatus,
  ApplicationTimelineEvent,
} from "@/components/dashboard/dashboard.types";
import { STATUS_FLOW, formatDate, formatStatus, statusStepIndex } from "@/components/dashboard/dashboard.utils";
import {
  type ApplicationDetailDto,
  type ApplicationStatusKey,
  getApplicationDetail,
  withdrawApplication,
} from "@/lib/api/applications";
import { ApiError } from "@/lib/api/client";
import { handleApiError } from "@/lib/api/handle-error";

// Backend uses snake_case, the dashboard UI types use kebab-case.
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

const EVENT_TYPE_MAP: Record<string, ApplicationTimelineEvent["type"]> = {
  submission: "submission",
  status_change: "status-change",
  note: "note",
  message: "message",
  attachment: "note",   // no dedicated icon- reuse "note"
  view: "note",
};

const ACTOR_MAP: Record<string, ApplicationTimelineEvent["actor"]> = {
  student: "student",
  organization: "organization",
  system: "system",
};

function mapStatus(k: ApplicationStatusKey | null): ApplicationStatus | undefined {
  return k ? STATUS_MAP[k] : undefined;
}

function toTimeline(events: ApplicationDetailDto["timeline"]): ApplicationTimelineEvent[] {
  // Newest first- matches the mock we replaced.
  return [...events].reverse().map((e) => ({
    timestamp: e.occurredAt,
    type: EVENT_TYPE_MAP[e.eventType] ?? "note",
    description: e.description ?? "",
    fromStatus: mapStatus(e.fromStatus),
    toStatus: mapStatus(e.toStatus),
    actor: ACTOR_MAP[e.actorKind] ?? "system",
  }));
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [detail, setDetail] = useState<ApplicationDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await getApplicationDetail(id);
        if (!cancelled) setDetail(d);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
        else handleApiError(err, "Couldn't load application");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  function copyId() {
    if (!detail) return;
    navigator.clipboard.writeText(detail.publicId);
    setCopied(true);
    toast.success("Application ID copied");
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleWithdraw() {
    setBusy(true);
    try {
      const { message } = await withdrawApplication(id);
      toast.success(message);
      router.push("/dashboard/applications");
    } catch (err) {
      handleApiError(err, "Couldn't withdraw.");
      setBusy(false);
    }
  }

  // ─── States ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Spinner size="md" />
      </div>
    );
  }

  if (notFound || !detail) {
    return (
      <div>
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

  const uiStatus = STATUS_MAP[detail.status] ?? "submitted";
  const currentStep = statusStepIndex(uiStatus);
  const rejected = uiStatus === "not-selected";
  const canWithdraw = !["withdrawn", "not-selected"].includes(uiStatus);
  const timelineEvents = toTimeline(detail.timeline);

  return (
    <div>
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
                <h1 className="text-xl font-semibold text-foreground">{detail.postingTitle}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{detail.organizationName}</p>
              </div>
              <StatusBadge status={uiStatus} size="md" />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{detail.publicId}</span>
              <button
                onClick={copyId}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Copy application ID"
              >
                {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              </button>
            </div>

            {/* Status stepper */}
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
          </div>

          {/* Timeline */}
          <div className="mt-6 rounded-xl border border-border bg-white p-6 dark:bg-card">
            <h2 className="mb-4 font-semibold text-foreground">Timeline</h2>
            {timelineEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events yet.</p>
            ) : (
              <ApplicationTimeline events={timelineEvents} />
            )}
          </div>

          {/* Cover letter (if student wrote one) */}
          {detail.coverLetter && (
            <div className="mt-6 rounded-xl border border-border bg-white p-6 dark:bg-card">
              <h2 className="mb-3 font-semibold text-foreground">Your cover letter</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {detail.coverLetter}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-5 dark:bg-card">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Quick info</h2>
            <dl className="space-y-3 text-sm">
              {detail.deadlineAt && (
                <div className="flex items-center gap-2.5">
                  <CalendarClock className="size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Deadline</dt>
                    <dd className="text-foreground">{formatDate(detail.deadlineAt)}</dd>
                  </div>
                </div>
              )}
              {detail.submittedAt && (
                <div className="flex items-center gap-2.5">
                  <CalendarClock className="size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Applied</dt>
                    <dd className="text-foreground">{formatDate(detail.submittedAt)}</dd>
                  </div>
                </div>
              )}
              {detail.fundingAmount && (
                <div className="flex items-center gap-2.5">
                  <Banknote className="size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Funding</dt>
                    <dd className="text-foreground">{detail.fundingAmount}</dd>
                  </div>
                </div>
              )}
              {detail.stipendAmount && (
                <div className="flex items-center gap-2.5">
                  <Banknote className="size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Stipend</dt>
                    <dd className="text-foreground">
                      PKR {Number(detail.stipendAmount).toLocaleString()} / month
                    </dd>
                  </div>
                </div>
              )}
              {detail.location && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Location</dt>
                    <dd className="text-foreground">{detail.location}</dd>
                  </div>
                </div>
              )}
            </dl>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="outline" size="lg" asChild className="w-full">
              <Link href={`/postings/${detail.postingSlug}`}>View posting</Link>
            </Button>
            {canWithdraw && (
              <ConfirmModal
                trigger={
                  <Button variant="destructive" size="lg" className="w-full" disabled={busy}>
                    Withdraw application
                  </Button>
                }
                title="Withdraw this application?"
                description={`This will withdraw your application for "${detail.postingTitle}". This action cannot be undone.`}
                confirmText={busy ? "Withdrawing…" : "Withdraw"}
                onConfirm={handleWithdraw}
                busy={busy}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
