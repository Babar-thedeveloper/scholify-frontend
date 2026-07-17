import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  ExternalLink,
  Globe,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { getPublicOrg } from "@/lib/api/organizations";
import { listPostings } from "@/lib/api/postings";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const org = await getPublicOrg(slug);
    return {
      title: `${org.name} | Scholify`,
      description: org.description?.slice(0, 160) ?? `Scholarships and internships by ${org.name}`,
    };
  } catch {
    return { title: "Organization | Scholify" };
  }
}

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "Twitter / X",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
};

export default async function PublicOrgPage({ params }: Props) {
  const { slug } = await params;

  let org;
  try {
    org = await getPublicOrg(slug);
  } catch {
    notFound();
  }

  const { items: postings } = await listPostings({ orgSlug: slug, pageSize: 50 });

  const initials = org.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const socialEntries = Object.entries(org.social).filter(([, url]) => !!url);

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      {/* ─── Header ─── */}
      <Card className="flex items-start gap-5 rounded-2xl border-border p-6">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-2xl font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{org.name}</h1>
            {org.verified && (
              <Badge variant="secondary" className="rounded-full border-transparent bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <BadgeCheck className="size-3.5" /> Verified
              </Badge>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {org.industry && (
              <span className="flex items-center gap-1">
                <Building2 className="size-3.5" /> {org.industry}
              </span>
            )}
            {org.country && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" /> {org.country}
              </span>
            )}
            {org.website && (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground"
              >
                <Globe className="size-3.5" />
                {org.website.replace(/^https?:\/\//, "")}
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>

          {/* Social links */}
          {socialEntries.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {socialEntries.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border px-3 py-0.5 text-xs text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                >
                  {SOCIAL_LABELS[key] ?? key}
                </a>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ─── About ─── */}
        <div className="lg:col-span-2 space-y-4">
          {org.description && (
            <Card className="gap-0 rounded-2xl border-border p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                About
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {org.description}
              </p>
            </Card>
          )}

          {/* Active postings */}
          <Card className="gap-0 rounded-2xl border-border p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Active opportunities ({postings.length})
            </h2>

            {postings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active postings right now.</p>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {postings.map((p) => {
                  const isInternship = p.type === "internship";
                  const deadlineDate = p.deadlineAt ? new Date(p.deadlineAt) : null;
                  const daysLeft = deadlineDate
                    ? Math.ceil((deadlineDate.getTime() - Date.now()) / 86_400_000)
                    : null;

                  return (
                    <Link
                      key={p.id}
                      href={`/postings/${p.publicSlug}`}
                      className="flex items-start gap-3 py-3 text-sm hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                        {isInternship
                          ? <Building2 className="size-3.5" />
                          : <GraduationCap className="size-3.5" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{p.title}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          <span className="capitalize">{p.type}</span>
                          {isInternship && p.workMode && ` · ${p.workMode}`}
                          {!isInternship && p.fundingAmount && ` · ${p.fundingAmount}`}
                          {daysLeft !== null && daysLeft >= 0 && (
                            <span className={daysLeft <= 7 ? " · text-amber-600 font-medium" : ""}>
                              {" "}· {daysLeft}d left
                            </span>
                          )}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* ─── Stats sidebar ─── */}
        <aside className="space-y-4">
          <Card className="gap-0 rounded-2xl border-border p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Quick facts
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Type</dt>
                <dd className="font-medium text-foreground capitalize">
                  {org.kind?.replace(/_/g, " ") ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Country</dt>
                <dd className="font-medium text-foreground">{org.country}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Active opportunities</dt>
                <dd className="font-medium text-foreground">{org.activePostingCount}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Verification</dt>
                <dd className="font-medium text-foreground">
                  {org.verified ? "Verified organization" : "Pending verification"}
                </dd>
              </div>
            </dl>
          </Card>
        </aside>
      </div>
    </div>
  );
}
