"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/shared/Modal";
import { useUser } from "@/components/auth/UserContext";
import { submitApplication, listMyApplications } from "@/lib/api/applications";
import { ApiError } from "@/lib/api/client";
import { handleApiError } from "@/lib/api/handle-error";

interface Props {
  postingSlug: string;
  postingTitle: string;
  postingId: string;
  postingStatus: "draft" | "active" | "paused" | "closed" | "archived";
  applyMethod: "platform" | "external";
  externalUrl: string | null;
  deadlinePassed: boolean;
}

export function ApplyPanel({
  postingSlug,
  postingTitle,
  postingId,
  postingStatus,
  applyMethod,
  externalUrl,
  deadlinePassed,
}: Props) {
  const { user, isAuthed, isLoading } = useUser();
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(true);

  // ─── Check if student already applied ──────────────────────
  useEffect(() => {
    if (!isAuthed || user.role !== "student") {
      setCheckingApplied(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await listMyApplications({ pageSize: 50 });
        if (!cancelled) {
          setAlreadyApplied(res.items.some((a) => a.postingId === postingId));
        }
      } catch {
        // ignore- the submit handler will catch duplicates anyway
      } finally {
        if (!cancelled) setCheckingApplied(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isAuthed, user, postingId]);

  // ─── State-driven CTA copy ─────────────────────────────────
  // Posting not active (closed, paused, draft, archived)
  if (postingStatus !== "active" || deadlinePassed) {
    return (
      <Card className="gap-0 rounded-2xl border-border p-5 text-sm text-muted-foreground">
        This posting is no longer accepting applications.
      </Card>
    );
  }

  // External-apply → route the CTA to the org's own site
  if (applyMethod === "external") {
    return (
      <Card className="gap-0 rounded-2xl border-border p-5">
        <p className="text-sm text-muted-foreground">
          This organization accepts applications on their own site.
        </p>
        <Button size="lg" className="mt-3 w-full" asChild disabled={!externalUrl}>
          <a href={externalUrl ?? "#"} target="_blank" rel="noopener noreferrer">
            Apply on their site <ExternalLink className="size-4" />
          </a>
        </Button>
      </Card>
    );
  }

  // Platform-apply flow ------------------------------------------------
  if (isLoading) {
    return (
      <Card className="gap-0 rounded-2xl border-border p-5">
        <Spinner size="md" />
      </Card>
    );
  }

  // Not signed in → prompt to log in
  if (!isAuthed) {
    return (
      <Card className="gap-0 rounded-2xl border-border p-5">
        <p className="text-sm text-muted-foreground">
          Sign in to apply through Scholify- we&apos;ll track your application status for you.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <Button size="lg" asChild>
            <Link
              href={`/login?next=${encodeURIComponent(`/postings/${postingSlug}`)}`}
            >
              Sign in to apply <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link
              href={`/signup?next=${encodeURIComponent(`/postings/${postingSlug}`)}`}
            >
              Create a free account
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  // Logged in as org- can't apply as an org
  if (user.role === "org") {
    return (
      <Card className="gap-0 rounded-2xl border-border p-5 text-sm text-muted-foreground">
        Only student accounts can apply on Scholify. Sign out and use your student account
        to apply.
      </Card>
    );
  }

  // Still checking if already applied → show spinner
  if (checkingApplied) {
    return (
      <Card className="gap-0 rounded-2xl border-border p-5">
        <Spinner size="md" />
      </Card>
    );
  }

  // Already applied → show confirmation + link to track
  if (alreadyApplied) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/25 dark:bg-emerald-500/10">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              You&apos;ve already applied
            </p>
            <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
              Track the status of your application from your dashboard.
            </p>
          </div>
        </div>
        <Button size="lg" className="mt-3 w-full" asChild>
          <Link href="/dashboard/applications">
            Go to my applications <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  // Just applied → success state
  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/25 dark:bg-emerald-500/10">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              Application submitted
            </p>
            <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
              Track its status from your dashboard.
            </p>
          </div>
        </div>
        <Button size="lg" className="mt-3 w-full" asChild>
          <Link href="/dashboard/applications">
            Go to my applications <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await submitApplication({
        postingSlug,
        coverLetter: coverLetter.trim() || undefined,
      });
      setSubmitted(true);
      toast.success("Application submitted successfully.");
    } catch (err) {
      if (err instanceof ApiError && err.code === "CONFLICT") {
        toast.error("You've already applied to this posting.");
        // Route to their applications so they can see the existing one.
        setTimeout(() => router.push("/dashboard/applications"), 800);
      } else {
        handleApiError(err, "Couldn't submit your application.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Signed in as student → primary apply CTA + optional cover letter dialog
  return (
    <Card className="gap-0 rounded-2xl border-border p-5">
      <p className="text-sm text-muted-foreground">
        You&apos;re signed in as <span className="font-medium text-foreground">{user.email}</span>.
      </p>

      <Modal
        trigger={
          <Button size="lg" className="mt-3 w-full">
            Apply on Scholify <ArrowRight className="size-4" />
          </Button>
        }
      >
        <ModalHeader
          title={`Apply- ${postingTitle}`}
          description="Add a short cover letter to strengthen your application. This is optional."
        />

        <ModalBody>
          <Label htmlFor="cover-letter" className="text-sm font-medium">
            Cover letter <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="cover-letter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={6}
            maxLength={4000}
            placeholder="Why are you a great fit for this opportunity?"
            className="mt-1.5 min-h-32"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {coverLetter.length}/4000
          </p>
        </ModalBody>

        <ModalFooter className="flex justify-end">
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Spinner size="sm" /> : null}
            Submit application
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
}
