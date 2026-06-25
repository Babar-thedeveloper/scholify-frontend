"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  GraduationCap,
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  BookOpen,
  Award,
  Download,
  FileQuestion,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusChangeControl } from "@/components/org/StatusChangeControl";
import { MOCK_APPLICANTS } from "@/components/dashboard/dashboard.mock";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { formatDate } from "@/components/dashboard/dashboard.utils";

export default function ApplicantDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  // Find applicant from mock database
  const applicant = MOCK_APPLICANTS.find((a) => a.id === params.id);

  if (!applicant) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          Icon={FileQuestion}
          title="Applicant not found"
          description="This candidate application record does not exist or has been deleted."
          actionLabel="Back to applicants"
          actionHref="/org/applicants"
        />
      </div>
    );
  }

  const a = applicant;

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/org/applicants"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to applicants
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Student Profile (Read-only) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card">
            {/* Header info */}
            <div className="flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                {a.initials}
              </span>
              <div>
                <h1 className="text-xl font-bold text-foreground">{a.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {a.degreeLevel} in {a.fieldOfStudy}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="size-3" /> {a.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" /> {a.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Academic Details</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-2.5 rounded-lg border border-slate-50 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                  <GraduationCap className="size-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      University
                    </span>
                    <span className="text-sm font-medium text-foreground">{a.university}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-lg border border-slate-50 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                  <Award className="size-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      GPA / Academic Standing
                    </span>
                    <span className="text-sm font-semibold text-foreground">{a.gpa} / 4.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            {a.skills && a.skills.length > 0 && (
              <div className="mt-6 border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {a.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-foreground dark:bg-slate-800"
                    >
                      <Sparkles className="size-3 text-amber-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Application Cover Letter */}
          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText className="size-4 text-primary" /> Cover Letter
            </h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {a.coverLetter || "No cover letter provided by the applicant."}
            </p>
          </div>
        </div>

        {/* Right Column: Context, Status and actions */}
        <aside className="space-y-6">
          {/* Status Panel */}
          <StatusChangeControl current={a.status} applicantName={a.name} />

          {/* Application Info */}
          <div className="rounded-xl border border-border bg-white p-5 dark:bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Application Details</h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Application ID</dt>
                <dd className="font-mono text-xs font-semibold text-foreground mt-0.5">{a.applicationId}</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Applied For</dt>
                <dd className="mt-0.5">
                  <Link
                    href={`/org/postings/${a.postingId}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {a.postingTitle}
                  </Link>
                </dd>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground shrink-0" />
                <div>
                  <dt className="text-xs text-muted-foreground">Submitted On</dt>
                  <dd className="text-foreground">{formatDate(a.appliedAt)}</dd>
                </div>
              </div>
            </dl>
          </div>

          {/* PDF Download Placeholder */}
          <Button variant="outline" size="lg" className="w-full h-11">
            <Download className="size-4 mr-2" /> Download Resume PDF
          </Button>
        </aside>
      </div>
    </div>
  );
}
