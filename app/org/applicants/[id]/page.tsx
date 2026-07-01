"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, Loader2, Mail, UserX } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  StatusChangeControl,
  type StatusChangePayload,
} from "@/components/org/StatusChangeControl";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/components/dashboard/dashboard.utils";
import type { ApplicationStatus } from "@/components/dashboard/dashboard.types";
import {
  type ApplicationStatusKey,
  type OrgApplicantDto,
  type OrgTargetStatus,
  changeApplicantStatus,
  getApplicantForOrg,
} from "@/lib/api/applications";
import { ApiError } from "@/lib/api/client";

// backend key → dashboard kebab-case key
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

// kebab-case (dashboard) → snake_case (backend). Only the transitions
// an org is allowed to trigger.
const REVERSE_STATUS_MAP: Partial<Record<ApplicationStatus, OrgTargetStatus>> = {
  "under-review": "under_review",
  shortlisted: "shortlisted",
  interview: "interview",
  accepted: "accepted",
  "not-selected": "not_selected",
};

export default function ApplicantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [applicant, setApplicant] = useState<OrgApplicantDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const a = await getApplicantForOrg(id);
        if (!cancelled) setApplicant(a);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
        else toast.error(err instanceof Error ? err.message : "Couldn't load applicant");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  async function handleStatusChange(payload: StatusChangePayload) {
    if (!applicant) return;
    const backendStatus = REVERSE_STATUS_MAP[payload.nextStatus];
    if (!backendStatus) {
      toast.error("This status transition isn't allowed.");
      throw new Error("bad transition");
    }
    try {
      const { applicant: updated, message } = await changeApplicantStatus(applicant.publicId, {
        status: backendStatus,
        studentNote: payload.studentNote || undefined,
        notifyByEmail: payload.notifyByEmail,
      });
      setApplicant(updated);
      toast.success(message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update status.");
      throw err;
    }
  }

  // ─── States ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  if (notFound || !applicant) {
    return (
      <EmptyState
        Icon={UserX}
        title="Applicant not found"
        description="This applicant may have been removed or the link is incorrect."
        actionLabel="Back to applicants"
        actionHref="/org/applicants"
      />
    );
  }

  const displayName = applicant.student.fullName || applicant.student.email;
  const uiStatus = STATUS_MAP[applicant.status] ?? "submitted";

  return (
    <div>
      <Link
        href="/org/applicants"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to applicants
      </Link>

      <PageHeader title={displayName} subtitle={applicant.postingTitle} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Profile card */}
          <div className="rounded-xl border border-border bg-white p-5 dark:bg-card">
            <div className="flex items-start gap-4">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                {applicant.student.initials}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
                  {applicant.student.isVerifiedStudent && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      Verified student
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {applicant.student.university ?? "—"} · {applicant.student.degreeLevel ?? "—"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  GPA
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {applicant.student.cgpa ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Field of study
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {applicant.student.fieldOfStudy ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Email
                </p>
                <p className="mt-1 truncate text-sm font-medium text-foreground">
                  {applicant.student.email}
                </p>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => toast("CV download will be enabled once the applicant uploads one.")}>
                <Download className="size-4" />
                Download CV
              </Button>
              <Button variant="outline" asChild>
                <a href={`mailto:${applicant.student.email}`}>
                  <Mail className="size-4" />
                  Contact
                </a>
              </Button>
            </div>
          </div>

          {/* Application card */}
          <div className="rounded-xl border border-border bg-white p-5 dark:bg-card">
            <h3 className="text-base font-semibold text-foreground">Application</h3>

            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Posting</dt>
                <dd>
                  <Link
                    href={`/org/postings/${applicant.postingId}`}
                    className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    {applicant.postingTitle}
                  </Link>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Application ID</dt>
                <dd className="font-mono text-foreground">{applicant.publicId}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Applied</dt>
                <dd className="text-foreground">
                  {formatDate(applicant.submittedAt ?? applicant.createdAt)}
                </dd>
              </div>
            </dl>

            {applicant.coverLetter && (
              <>
                <Separator className="my-5" />
                <h4 className="text-sm font-semibold text-foreground">Cover letter</h4>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {applicant.coverLetter}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <StatusChangeControl
            current={uiStatus}
            applicantName={displayName}
            onSubmit={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
}
