"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "./GoogleButton";
import { OrgSignupFields } from "./OrgSignupFields";
import { StudentSignupFields } from "./StudentSignupFields";
import { UserTypeToggle } from "./UserTypeToggle";
import { useUser } from "./UserContext";
import { ApiError } from "@/lib/api/client";
import { signupOrg } from "@/lib/api/auth";
import { validateOrgSignup, validateStudentSignup } from "./auth.schemas";
import type {
  FieldErrors,
  OrgSignupValues,
  StudentSignupValues,
  UserType,
} from "./auth.types";

const initialStudent: StudentSignupValues = {
  fullName: "",
  email: "",
  password: "",
  university: "",
  universityOther: "",
  degreeLevel: "undergraduate",
  termsAccepted: false,
};

const initialOrg: OrgSignupValues = {
  organizationName: "",
  organizationType: "scholarship-provider",
  email: "",
  password: "",
  contactName: "",
  designation: "",
  website: "",
  country: "Pakistan",
  termsAccepted: false,
};

export function SignupForm() {
  const router = useRouter();
  const { signup } = useUser();
  const [userType, setUserType] = useState<UserType>("student");

  const [studentValues, setStudentValues] = useState<StudentSignupValues>(initialStudent);
  const [studentErrors, setStudentErrors] = useState<FieldErrors<StudentSignupValues>>({});
  const [studentTouched, setStudentTouched] = useState<
    Partial<Record<keyof StudentSignupValues, boolean>>
  >({});

  const [orgValues, setOrgValues] = useState<OrgSignupValues>(initialOrg);
  const [orgErrors, setOrgErrors] = useState<FieldErrors<OrgSignupValues>>({});
  const [orgTouched, setOrgTouched] = useState<
    Partial<Record<keyof OrgSignupValues, boolean>>
  >({});

  const [submitting, setSubmitting] = useState(false);

  function setStudent<K extends keyof StudentSignupValues>(
    key: K,
    value: StudentSignupValues[K]
  ) {
    setStudentValues((v) => ({ ...v, [key]: value }));
    if (studentTouched[key]) {
      const next = validateStudentSignup({ ...studentValues, [key]: value });
      setStudentErrors((e) => ({ ...e, [key]: next[key] }));
    }
  }

  function blurStudent(key: keyof StudentSignupValues) {
    setStudentTouched((t) => ({ ...t, [key]: true }));
    const next = validateStudentSignup(studentValues);
    setStudentErrors((e) => ({ ...e, [key]: next[key] }));
  }

  function setOrg<K extends keyof OrgSignupValues>(key: K, value: OrgSignupValues[K]) {
    setOrgValues((v) => ({ ...v, [key]: value }));
    if (orgTouched[key]) {
      const next = validateOrgSignup({ ...orgValues, [key]: value });
      setOrgErrors((e) => ({ ...e, [key]: next[key] }));
    }
  }

  function blurOrg(key: keyof OrgSignupValues) {
    setOrgTouched((t) => ({ ...t, [key]: true }));
    const next = validateOrgSignup(orgValues);
    setOrgErrors((e) => ({ ...e, [key]: next[key] }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (userType === "student") {
      const next = validateStudentSignup(studentValues);
      setStudentErrors(next);
      const allTouched: Partial<Record<keyof StudentSignupValues, boolean>> = {};
      (Object.keys(studentValues) as Array<keyof StudentSignupValues>).forEach(
        (k) => { allTouched[k] = true; }
      );
      setStudentTouched(allTouched);
      if (Object.keys(next).length > 0) return;

      setSubmitting(true);
      try {
        const { message } = await signup({
          email: studentValues.email,
          password: studentValues.password,
          fullName: studentValues.fullName,
        });
        toast.success(message);
        router.push(`/verify-email?email=${encodeURIComponent(studentValues.email)}`);
      } catch (err) {
        if (err instanceof ApiError && err.code === "CONFLICT") {
          setStudentErrors({ email: "An account with this email already exists" });
        } else {
          toast.error(err instanceof Error ? err.message : "Signup failed. Try again.");
        }
        setSubmitting(false);
      }
    } else {
      // ─── Organization signup ─────────────────────────────
      // Backend creates user + org + owner membership atomically and queues
      // the email-verification link. The org is created with
      // verification_status=pending and reviewed by platform admins.
      const next = validateOrgSignup(orgValues);
      setOrgErrors(next);
      const allTouched: Partial<Record<keyof OrgSignupValues, boolean>> = {};
      (Object.keys(orgValues) as Array<keyof OrgSignupValues>).forEach(
        (k) => { allTouched[k] = true; }
      );
      setOrgTouched(allTouched);
      if (Object.keys(next).length > 0) return;

      setSubmitting(true);
      try {
        const { message } = await signupOrg({
          email: orgValues.email,
          password: orgValues.password,
          contactName: orgValues.contactName,
          designation: orgValues.designation,
          organizationName: orgValues.organizationName,
          organizationType: orgValues.organizationType,
          website: orgValues.website || undefined,
          country: orgValues.country,
        });
        toast.success(message);
        const params = new URLSearchParams({
          org: orgValues.organizationName,
          contact: orgValues.contactName,
          email: orgValues.email,
        });
        router.push(`/pending-verification?${params.toString()}`);
      } catch (err) {
        if (err instanceof ApiError && err.code === "CONFLICT") {
          setOrgErrors({ email: "An account with this email already exists" });
        } else if (err instanceof ApiError && err.code === "VALIDATION_ERROR") {
          toast.error(err.message);
        } else {
          toast.error(err instanceof Error ? err.message : "Signup failed. Try again.");
        }
        setSubmitting(false);
      }
    }
  }

  const termsAccepted =
    userType === "student" ? studentValues.termsAccepted : orgValues.termsAccepted;
  const termsError =
    userType === "student" ? studentErrors.termsAccepted : orgErrors.termsAccepted;

  return (
    <div className="flex flex-col gap-4">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">
          {userType === "student" ? "Create account" : "List opportunities"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {userType === "student"
            ? "Free forever — no credit card required"
            : "Reach 50,000+ verified Pakistani students"}
        </p>
      </div>

      {/* Account type toggle */}
      <UserTypeToggle value={userType} onChange={setUserType} />

      {/* Fields */}
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
        <div key={userType}>
          {userType === "student" ? (
            <StudentSignupFields
              values={studentValues}
              errors={studentErrors}
              onChange={setStudent}
              onBlur={blurStudent}
            />
          ) : (
            <OrgSignupFields
              values={orgValues}
              errors={orgErrors}
              onChange={setOrg}
              onBlur={blurOrg}
            />
          )}
        </div>

        {/* Terms */}
        <div className="flex flex-col gap-1">
          <Label className="flex items-start gap-2 text-xs text-muted-foreground">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => {
                const v = checked === true;
                if (userType === "student") {
                  setStudent("termsAccepted", v);
                  setStudentTouched((t) => ({ ...t, termsAccepted: true }));
                } else {
                  setOrg("termsAccepted", v);
                  setOrgTouched((t) => ({ ...t, termsAccepted: true }));
                }
              }}
              className="mt-0.5"
              aria-invalid={!!termsError || undefined}
            />
            <span>
              I agree to Scholify&apos;s{" "}
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                Privacy Policy
              </Link>
            </span>
          </Label>
          {termsError && (
            <p className="text-xs font-medium text-destructive" role="alert">
              {termsError}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="h-9 w-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-emerald-600/25 disabled:hover:shadow-none"
          disabled={submitting || !termsAccepted}
        >
          {submitting ? (
            <>
              <Spinner size="sm" aria-hidden="true" />
              Creating account...
            </>
          ) : userType === "student" ? (
            "Create student account"
          ) : (
            "Create organization account"
          )}
        </Button>
      </form>

      {/* Google — students only */}
      {userType === "student" && (
        <>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground">or sign up with</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <GoogleButton />
        </>
      )}

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in →
        </Link>
      </p>
    </div>
  );
}
