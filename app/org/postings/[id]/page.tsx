"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileQuestion,
  Loader2,
  Pause,
  Play,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ApplicantTable } from "@/components/org/ApplicantTable";
import { ApiError } from "@/lib/api/client";
import { handleApiError } from "@/lib/api/handle-error";
import {
  type MyPostingDto,
  closePosting,
  deletePosting,
  getMyPosting,
  pausePosting,
  publishPosting,
  resumePosting,
  updatePosting,
} from "@/lib/api/postings";
import {
  type ApplicationStatusKey,
  type OrgApplicantDto,
  listOrgApplicants,
} from "@/lib/api/applications";
import type { Applicant, ApplicationStatus } from "@/components/dashboard/dashboard.types";

// snake_case → kebab-case for the ApplicantTable rows.
const STATUS_MAP_FOR_ROWS: Record<ApplicationStatusKey, ApplicationStatus> = {
  draft: "draft",
  submitted: "submitted",
  under_review: "under-review",
  shortlisted: "shortlisted",
  interview: "interview",
  accepted: "accepted",
  not_selected: "not-selected",
  withdrawn: "withdrawn",
};

function toRow(dto: OrgApplicantDto): Applicant {
  return {
    id: dto.publicId,
    applicationId: dto.publicId,
    postingId: dto.postingId,
    postingTitle: dto.postingTitle,
    name: dto.student.fullName || dto.student.email,
    initials: dto.student.initials,
    email: dto.student.email,
    university: dto.student.university ?? "—",
    degreeLevel: dto.student.degreeLevel ?? "—",
    fieldOfStudy: dto.student.fieldOfStudy ?? "—",
    gpa: dto.student.cgpa ?? "—",
    city: "",
    appliedAt: dto.submittedAt ?? dto.createdAt,
    status: STATUS_MAP_FOR_ROWS[dto.status] ?? "submitted",
    coverLetter: dto.coverLetter ?? undefined,
  };
}

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  closed: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  paused: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  archived: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
} as const;

const textareaClass =
  "min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-xs placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export default function PostingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [posting, setPosting] = useState<MyPostingDto | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false); // status-transition + delete

  // Editable form state — hydrated after fetch.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [applyMethod, setApplyMethod] = useState<"platform" | "external">("platform");
  const [externalUrl, setExternalUrl] = useState("");

  // ─── Fetch on mount ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await getMyPosting(id);
        if (cancelled) return;
        setPosting(p);
        setTitle(p.title);
        setDescription(p.description ?? "");
        setDeadline(p.deadlineAt ? p.deadlineAt.slice(0, 10) : "");
        setApplyMethod(p.applyMethod);
        setExternalUrl(p.externalUrl ?? "");
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
        else handleApiError(err, "Couldn't load the posting.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  // ─── Fetch applicants for this posting (once we have the posting id) ──
  useEffect(() => {
    if (!posting) return;
    let cancelled = false;
    setApplicantsLoading(true);
    (async () => {
      try {
        const res = await listOrgApplicants({ postingId: posting.id, pageSize: 50 });
        if (!cancelled) setApplicants(res.items.map(toRow));
      } catch {
        /* silent — the empty state still renders */
      } finally {
        if (!cancelled) setApplicantsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [posting]);

  // ─── Handlers ─────────────────────────────────────────────
  async function withBusy<T>(fn: () => Promise<T>, onSuccess?: (v: T) => void) {
    setBusy(true);
    try {
      const v = await fn();
      onSuccess?.(v);
    } catch (err) {
      handleApiError(err, "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    if (!posting) return;
    setSaving(true);
    try {
      const { posting: updated, message } = await updatePosting(id, {
        title,
        description,
        deadlineAt: deadline ? new Date(deadline).toISOString() : null,
        applyMethod,
        externalUrl: applyMethod === "external" ? externalUrl : null,
      });
      setPosting(updated);
      toast.success(message);
    } catch (err) {
      handleApiError(err, "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  }

  const handlePublish = () =>
    withBusy(() => publishPosting(id), ({ posting: p, message }) => {
      setPosting(p);
      toast.success(message);
    });

  const handlePause = () =>
    withBusy(() => pausePosting(id), ({ posting: p, message }) => {
      setPosting(p);
      toast.success(message);
    });

  const handleResume = () =>
    withBusy(() => resumePosting(id), ({ posting: p, message }) => {
      setPosting(p);
      toast.success(message);
    });

  const handleClose = () =>
    withBusy(() => closePosting(id), ({ posting: p, message }) => {
      setPosting(p);
      toast.success(message);
    });

  const handleDelete = () =>
    withBusy(() => deletePosting(id), () => {
      toast.success("Posting deleted");
      router.push("/org/postings");
    });

  // ─── Empty / loading states ───────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  if (notFound || !posting) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          Icon={FileQuestion}
          title="Posting not found"
          description="This posting does not exist or has been removed."
          actionLabel="Back to postings"
          actionHref="/org/postings"
        />
      </div>
    );
  }

  const statusClass = STATUS_STYLES[posting.status] ?? STATUS_STYLES.draft;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/org/postings"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to postings
      </Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {posting.title}
            </h1>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", statusClass)}>
              {posting.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {posting.applicantCount} applicant{posting.applicantCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Posting details</TabsTrigger>
          <TabsTrigger value="applicants">Applicants ({posting.applicantCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="rounded-xl border border-border bg-white p-5 dark:bg-card">
            <h2 className="mb-4 font-semibold text-foreground">Edit posting</h2>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className={textareaClass}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Apply method</Label>
                <Select
                  value={applyMethod}
                  onValueChange={(v) => setApplyMethod(v as "platform" | "external")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select apply method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platform">Apply on Scholify</SelectItem>
                    <SelectItem value="external">Apply externally</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {applyMethod === "external" && (
                <div className="space-y-1.5">
                  <Label htmlFor="externalUrl">External URL</Label>
                  <Input
                    id="externalUrl"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://careers.example.com/apply"
                  />
                </div>
              )}
            </div>

            {/* Action bar — buttons shown depend on current status */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button onClick={handleSave} disabled={saving || busy}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                Save changes
              </Button>

              {posting.status === "draft" && (
                <Button variant="outline" onClick={handlePublish} disabled={busy || saving}>
                  <Send className="size-4" /> Publish
                </Button>
              )}
              {posting.status === "active" && (
                <Button variant="outline" onClick={handlePause} disabled={busy || saving}>
                  <Pause className="size-4" /> Pause posting
                </Button>
              )}
              {posting.status === "paused" && (
                <Button variant="outline" onClick={handleResume} disabled={busy || saving}>
                  <Play className="size-4" /> Resume
                </Button>
              )}
              {(posting.status === "active" || posting.status === "paused" || posting.status === "draft") && (
                <Button variant="outline" onClick={handleClose} disabled={busy || saving}>
                  <XCircle className="size-4" /> Close
                </Button>
              )}
              {posting.status === "closed" && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4" /> This posting is closed.
                </span>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="sm:ml-auto" disabled={busy || saving}>
                    <Trash2 className="size-4" /> Delete posting
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this posting?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will hide &ldquo;{posting.title}&rdquo; from your dashboard and the public
                      listing. Applicant records stay on file. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="applicants">
          {applicantsLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : applicants.length === 0 ? (
            <EmptyState
              Icon={FileQuestion}
              title="No applicants yet"
              description="Once students apply, they'll appear here."
            />
          ) : (
            <ApplicantTable applicants={applicants} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
