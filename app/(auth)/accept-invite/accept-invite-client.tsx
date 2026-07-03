"use client";

// ─────────────────────────────────────────────────────────────
// Accept-invite flow.
//
// On mount: GET /invitation-info?token=... to render org name +
// role + whether the invitee needs to sign up or just confirm.
//
// Two paths:
//   needsSignup=false  → show a single "Join organization" button
//                        (invitee already has a Scholify account).
//   needsSignup=true   → show name + password fields so a new
//                        account is created in-flight.
//
// On success: redirect to /login with a short success message.
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";
import { handleApiError } from "@/lib/api/handle-error";
import {
  acceptInvite,
  getInvitationInfo,
  type InvitationInfoDto,
} from "@/lib/api/organizations";

interface Props {
  token?: string;
}

export function AcceptInviteClient({ token }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "ready" | "done" | "error">("loading");
  const [info, setInfo] = useState<InvitationInfoDto | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Form
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrorMsg("No invitation token found. Please use the link from your email.");
      setPhase("error");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getInvitationInfo(token);
        if (cancelled) return;
        setInfo(data);
        setPhase("ready");
      } catch (err) {
        if (cancelled) return;
        setErrorMsg(err instanceof ApiError ? err.message : "This invitation is invalid or has expired.");
        setPhase("error");
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  async function handleAccept() {
    if (!token || !info) return;
    if (info.needsSignup && (!fullName.trim() || password.length < 8)) return;
    setSubmitting(true);
    try {
      await acceptInvite({
        token,
        ...(info.needsSignup ? { fullName: fullName.trim(), password, designation: designation.trim() || undefined } : {}),
      });
      setPhase("done");
      toast.success(`You've joined ${info.orgName}!`);
      setTimeout(() => router.replace("/login?welcome=org"), 1800);
    } catch (err) {
      handleApiError(err, "Couldn't accept the invitation.");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Loading ───────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-primary dark:bg-emerald-500/15">
          <Loader2 className="size-6 animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">Loading your invitation…</p>
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────────────────
  if (phase === "error") {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300">
          <XCircle className="size-6" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Invalid invitation</h1>
        <p className="mt-2 text-sm text-muted-foreground">{errorMsg}</p>
        <Button asChild size="sm" className="mt-5">
          <Link href="/login">Go to sign in</Link>
        </Button>
      </div>
    );
  }

  // ─── Done ──────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          <CheckCircle2 className="size-6" />
        </div>
        <h1 className="text-xl font-bold text-foreground">You&apos;re in!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Redirecting you to sign in…
        </p>
      </div>
    );
  }

  // ─── Ready ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      {/* Invitation card */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
          <Building2 className="size-5" />
        </span>
        <div>
          <p className="font-semibold text-foreground">{info?.orgName}</p>
          <p className="text-sm text-muted-foreground capitalize">
            Invited as <span className="font-medium">{info?.role}</span>
          </p>
        </div>
      </div>

      {info?.needsSignup ? (
        /* New user path — create account on the way in */
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-bold text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Joining as <span className="font-medium">{info.email}</span>. Set a name and password to get started.
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="designation">Job title <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              id="designation"
              placeholder="e.g. HR Manager"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAccept()}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleAccept}
            disabled={submitting || !fullName.trim() || password.length < 8}
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Create account &amp; join {info.orgName}
          </Button>
        </div>
      ) : (
        /* Existing user path — just confirm */
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-bold text-foreground">Join {info?.orgName}</h1>
          <p className="text-sm text-muted-foreground">
            You already have a Scholify account at{" "}
            <span className="font-medium">{info?.email}</span>. Click below to accept the invitation.
          </p>

          <Button className="w-full" onClick={handleAccept} disabled={submitting}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Accept &amp; join {info?.orgName}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Not you?{" "}
            <Link href="/login" className="underline underline-offset-2 hover:text-foreground">
              Sign in with a different account
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
