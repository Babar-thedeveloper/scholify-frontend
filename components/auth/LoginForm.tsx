"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "./FormField";
import { PasswordInput } from "./PasswordInput";
import { GoogleButton } from "./GoogleButton";
import { useUser } from "./UserContext";
import { ApiError } from "@/lib/api/client";
import { deriveUiRole } from "@/lib/api/auth";
import { validateLogin } from "./auth.schemas";
import type { FieldErrors, LoginValues } from "./auth.types";

const initial: LoginValues = { email: "", password: "" };

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUser();
  const [values, setValues] = useState<LoginValues>(initial);
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});
  const [touched, setTouched] = useState<Record<keyof LoginValues, boolean>>({
    email: false,
    password: false,
  });
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof LoginValues>(key: K, value: LoginValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (touched[key]) {
      const next = validateLogin({ ...values, [key]: value });
      setErrors((e) => ({ ...e, [key]: next[key] }));
    }
  }

  function blur<K extends keyof LoginValues>(key: K) {
    setTouched((t) => ({ ...t, [key]: true }));
    const next = validateLogin(values);
    setErrors((e) => ({ ...e, [key]: next[key] }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validateLogin(values);
    setErrors(next);
    setTouched({ email: true, password: true });
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const { user, message } = await login({ email: values.email, password: values.password });
      toast.success(message);
      // Honor ?next= for internal paths (e.g. CV Builder from the navbar)
      const nextPath = searchParams.get("next");
      if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
        router.push(nextPath);
      } else {
        const uiRole = deriveUiRole(user.roles);
        router.push(
          uiRole === "admin" ? "/admin" : uiRole === "org" ? "/org/dashboard" : "/dashboard"
        );
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "EMAIL_NOT_VERIFIED") {
          toast.error(err.message);
          router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
        } else if (err.status === 401) {
          setErrors({ password: "Invalid email or password" });
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error(err instanceof Error ? err.message : "Login failed. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-full flex-col justify-center gap-5">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back — let&apos;s find your next opportunity
        </p>
      </div>

      {/* Google first — social login at top is better UX */}
      <GoogleButton />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] text-muted-foreground">or use your email</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Fields */}
      <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
        <FormField id="email" label="Email address" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@university.edu.pk"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => blur("email")}
            aria-invalid={!!errors.email || undefined}
            className="h-9 text-sm"
          />
        </FormField>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={values.password}
            onChange={(e) => set("password", e.target.value)}
            onBlur={() => blur("password")}
            invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-xs font-medium text-destructive" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <Button type="submit" className="mt-1 h-9 w-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-emerald-600/25" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner size="sm" aria-hidden="true" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create one free →
        </Link>
      </p>
    </div>
  );
}
