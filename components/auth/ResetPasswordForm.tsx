"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrength } from "./PasswordStrength";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  if (!token) {
    return (
      <div className="flex h-full flex-col justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">Invalid reset link</h1>
        <p className="text-sm text-muted-foreground">
          This link is missing or malformed. Request a fresh one and try again.
        </p>
        <Button asChild className="mt-2">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: { password?: string; confirm?: string } = {};
    if (password.length < 8) next.password = "Password must be at least 8 characters";
    if (confirm !== password) next.confirm = "Passwords don't match";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const { message } = await resetPassword(token!, password);
      toast.success(message);
      router.push("/login");
    } catch (err) {
      if (err instanceof ApiError && err.code === "INVALID_TOKEN") {
        toast.error("This reset link is invalid or has expired. Request a new one.");
        router.push("/forgot-password");
      } else {
        toast.error(err instanceof Error ? err.message : "Couldn't reset your password. Try again.");
        setSubmitting(false);
      }
    }
  }

  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            New password
          </Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((x) => ({ ...x, password: undefined }));
            }}
            invalid={!!errors.password}
          />
          {errors.password ? (
            <p className="text-xs font-medium text-destructive" role="alert">
              {errors.password}
            </p>
          ) : (
            <PasswordStrength password={password} />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm" className="text-sm font-medium text-foreground">
            Confirm password
          </Label>
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              if (errors.confirm) setErrors((x) => ({ ...x, confirm: undefined }));
            }}
            invalid={!!errors.confirm}
          />
          {errors.confirm && (
            <p className="text-xs font-medium text-destructive" role="alert">
              {errors.confirm}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="mt-1 h-9 w-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-emerald-600/25"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Spinner size="sm" aria-hidden="true" /> Updating...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
