"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { FormField } from "./FormField";
import { requestPasswordReset } from "@/lib/api/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      setError("Enter a valid email address");
      return;
    }
    setError(undefined);
    setSubmitting(true);
    try {
      const { message } = await requestPasswordReset(trimmed);
      toast.success(message);
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="flex h-full flex-col justify-center gap-4 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15">
          <MailCheck className="size-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account exists for{" "}
            <span className="font-medium text-foreground">{email.trim()}</span>, we&apos;ve sent a
            link to reset your password. It expires in 1 hour.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Didn&apos;t get it? Check your spam folder, or{" "}
          <button
            type="button"
            onClick={() => setSent(false)}
            className="font-medium text-primary hover:underline"
          >
            try another email
          </button>
          .
        </p>
        <Button asChild variant="outline" className="mt-2 gap-1.5">
          <Link href="/login">
            <ArrowLeft className="size-4" /> Back to sign in
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Forgot password?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a link to reset it.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
        <FormField id="email" label="Email address" error={error}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@university.edu.pk"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(undefined);
            }}
            aria-invalid={!!error || undefined}
            className="h-9 text-sm"
          />
        </FormField>

        <Button
          type="submit"
          className="mt-1 h-9 w-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-emerald-600/25"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Spinner size="sm" aria-hidden="true" /> Sending link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
