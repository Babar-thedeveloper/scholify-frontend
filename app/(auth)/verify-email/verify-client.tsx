"use client";

// ─────────────────────────────────────────────────────────────
// Two modes:
//
//   1. URL has `?token=...`     → confirm flow.
//      We auto-call POST /api/v1/auth/verify-email and on success
//      redirect the user to /login.
//
//   2. URL has only `?email=...` (or nothing) → inbox-pending UI.
//      Shows the "check your inbox" copy + a working Resend button.
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/api/client";
import { handleApiError } from "@/lib/api/handle-error";
import { resendVerification, verifyEmail } from "@/lib/api/auth";

interface Props {
  email?: string;
  token?: string;
}

export function VerifyClient({ email, token }: Props) {
  // ─── Mode 1: confirm token ────────────────────────────────
  if (token) return <ConfirmTokenView token={token} />;
  // ─── Mode 2: inbox pending ────────────────────────────────
  return <InboxPendingView email={email} />;
}

function ConfirmTokenView({ token }: { token: string }) {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email…");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { message } = await verifyEmail(token);
        if (cancelled) return;
        setState("success");
        setMessage(message);
        toast.success(message);
        // Give the user a moment to read it before bouncing to /login.
        setTimeout(() => router.replace("/login"), 1500);
      } catch (err) {
        if (cancelled) return;
        setState("error");
        setMessage(
          err instanceof ApiError ? err.message : "Verification failed. Please try again."
        );
      }
    })();
    return () => { cancelled = true; };
  }, [token, router]);

  const Icon = state === "loading" ? Loader2 : state === "success" ? CheckCircle2 : XCircle;
  const accent =
    state === "loading"
      ? "bg-emerald-100 text-primary dark:bg-emerald-500/15"
      : state === "success"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
        : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300";

  return (
    <div className="flex flex-col items-center text-center">
      <div className={`mb-4 flex size-14 items-center justify-center rounded-full ${accent}`}>
        <Icon className={`size-6 ${state === "loading" ? "animate-spin" : ""}`} aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">
        {state === "loading" && "Verifying…"}
        {state === "success" && "You're verified 🎉"}
        {state === "error" && "Verification failed"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      {state === "error" && (
        <Button asChild size="sm" className="mt-5">
          <Link href="/login">Back to sign in</Link>
        </Button>
      )}
    </div>
  );
}

function InboxPendingView({ email }: { email?: string }) {
  const displayEmail = email || "your email address";
  const [sending, setSending] = useState(false);

  async function handleResend() {
    if (!email) {
      toast.error("Open this page from your signup confirmation to resend.");
      return;
    }
    setSending(true);
    try {
      const { message } = await resendVerification(email);
      toast.success(message);
    } catch (err) {
      handleApiError(err, "Couldn't resend the email.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-primary dark:bg-emerald-500/15">
        <Mail className="size-6" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Check your inbox</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We&apos;ve sent a verification link to:
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground break-all">{displayEmail}</p>
      <p className="mt-4 text-sm text-muted-foreground">
        Click the link in the email to verify your account.
      </p>

      <div className="mt-6 flex w-full flex-col gap-2">
        <Button variant="ghost" size="sm" onClick={handleResend} disabled={sending} className="text-sm">
          {sending ? (
            <>
              <Spinner size="sm" className="size-3.5" aria-hidden="true" />
              Resending…
            </>
          ) : (
            "Resend email"
          )}
        </Button>
        <Button variant="ghost" size="sm" asChild className="text-sm">
          <Link href="/login">← Back to sign in</Link>
        </Button>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Didn&apos;t receive it? Check your spam folder.
      </p>
    </div>
  );
}
