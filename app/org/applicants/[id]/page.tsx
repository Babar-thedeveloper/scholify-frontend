"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, Mail, UserX } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusChangeControl } from "@/components/org/StatusChangeControl";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MOCK_APPLICANTS } from "@/components/dashboard/dashboard.mock";
import { formatDate } from "@/components/dashboard/dashboard.utils";

export default function ApplicantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const applicant = MOCK_APPLICANTS.find((a) => a.id === id);

  if (!applicant) {
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

  return (
    <div>
      <Link
        href="/org/applicants"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to applicants
      </Link>

      <PageHeader title={applicant.name} subtitle={applicant.postingTitle} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Profile card */}
          <div className="rounded-xl border border-border bg-white p-5 dark:bg-card">
            <div className="flex items-start gap-4">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-semibold text-violet-700">
                {applicant.initials}
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-foreground">{applicant.name}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {applicant.university} · {applicant.degreeLevel}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  GPA
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{applicant.gpa}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Field of study
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {applicant.fieldOfStudy}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  City
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{applicant.city}</p>
              </div>
            </div>

            {applicant.skills && applicant.skills.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-5" />

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => toast("Preparing CV…")}>
                <Download className="size-4" />
                Download CV
              </Button>
              <Button variant="outline" asChild>
                <a href={`mailto:${applicant.email}`}>
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
                <dd className="font-mono text-foreground">{applicant.applicationId}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Applied</dt>
                <dd className="text-foreground">{formatDate(applicant.appliedAt)}</dd>
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
          <StatusChangeControl current={applicant.status} applicantName={applicant.name} />
        </div>
      </div>
    </div>
  );
}
