import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CalendarClock,
  ExternalLink,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { getPostingBySlug } from "@/lib/api/postings";
import { ApplyPanel } from "./apply-panel";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const p = await getPostingBySlug(slug);
    return {
      title: `${p.title} · ${p.organization.name} | Scholify`,
      description: p.description?.slice(0, 160) ?? undefined,
    };
  } catch {
    return { title: "Posting | Scholify" };
  }
}

export default async function PostingDetailPage({ params }: Props) {
  const { slug } = await params;
  let posting;
  try {
    posting = await getPostingBySlug(slug);
  } catch {
    notFound();
  }

  const isInternship = posting.type === "internship";
  const deadlineDate = posting.deadlineAt ? new Date(posting.deadlineAt) : null;
  const daysLeft = deadlineDate
    ? Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={isInternship ? "/internships" : "/scholarships"}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to {isInternship ? "internships" : "scholarships"}
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ─── Main content ─── */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-white p-6 dark:bg-card">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                {isInternship ? (
                  <Building2 className="size-3" />
                ) : (
                  <GraduationCap className="size-3" />
                )}
                {posting.type}
              </span>
              {posting.organization.verified && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                  Verified organization
                </span>
              )}
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {posting.title}
            </h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {posting.organization.name}
            </p>

            {/* Description */}
            {posting.description && (
              <div className="mt-6">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  About the opportunity
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                  {posting.description}
                </p>
              </div>
            )}

            {posting.eligibilityCriteria && (
              <div className="mt-6">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Eligibility
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                  {posting.eligibilityCriteria}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right rail: quick facts + apply ─── */}
        <aside className="space-y-4">
          {/* Quick facts */}
          <div className="rounded-2xl border border-border bg-white p-5 dark:bg-card">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              At a glance
            </h2>
            <dl className="space-y-3 text-sm">
              {deadlineDate && (
                <div className="flex items-start gap-2.5">
                  <CalendarClock className="mt-0.5 size-4 text-muted-foreground" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">Deadline</dt>
                    <dd className="text-foreground">
                      {deadlineDate.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      {daysLeft !== null && daysLeft >= 0 && (
                        <span className="text-muted-foreground">
                          · {daysLeft} day{daysLeft === 1 ? "" : "s"} left
                        </span>
                      )}
                    </dd>
                  </div>
                </div>
              )}

              {isInternship && posting.workMode && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Location</dt>
                    <dd className="capitalize text-foreground">
                      {posting.workMode}
                      {posting.city ? ` · ${posting.city}` : ""}
                    </dd>
                  </div>
                </div>
              )}

              {isInternship && posting.isPaid !== null && (
                <div className="flex items-start gap-2.5">
                  <Banknote className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Compensation</dt>
                    <dd className="text-foreground">
                      {posting.isPaid && posting.stipendAmount
                        ? `${posting.stipendCurrency ?? "PKR"} ${Number(posting.stipendAmount).toLocaleString()} / month`
                        : posting.isPaid ? "Paid" : "Unpaid"}
                    </dd>
                  </div>
                </div>
              )}

              {!isInternship && posting.fundingAmount && (
                <div className="flex items-start gap-2.5">
                  <Banknote className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Funding</dt>
                    <dd className="text-foreground">{posting.fundingAmount}</dd>
                  </div>
                </div>
              )}

              {!isInternship && posting.specificCountry && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Destination</dt>
                    <dd className="text-foreground">{posting.specificCountry}</dd>
                  </div>
                </div>
              )}

              {isInternship && posting.durationMonths && (
                <div className="flex items-start gap-2.5">
                  <CalendarClock className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Duration</dt>
                    <dd className="text-foreground">
                      {posting.durationMonths} month{posting.durationMonths === 1 ? "" : "s"}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>

          {/* Apply panel — handles both external URL + platform apply */}
          <ApplyPanel
            postingSlug={posting.publicSlug}
            postingTitle={posting.title}
            applyMethod={posting.applyMethod}
            externalUrl={posting.externalUrl}
            deadlinePassed={!!deadlineDate && deadlineDate <= new Date()}
          />

          {/* Direct external link (backup) */}
          {posting.applyMethod === "external" && posting.externalUrl && (
            <a
              href={posting.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Open on {posting.organization.name}&apos;s site <ExternalLink className="size-3" />
            </a>
          )}
        </aside>
      </div>
    </div>
  );
}
