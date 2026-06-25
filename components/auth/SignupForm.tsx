"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleButton } from "./GoogleButton";
import { OrgSignupFields } from "./OrgSignupFields";
import { StudentSignupFields } from "./StudentSignupFields";
import { UserTypeToggle } from "./UserTypeToggle";
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
      await new Promise((r) => setTimeout(r, 1000));
      router.push(`/verify-email?email=${encodeURIComponent(studentValues.email)}`);
    } else {
      const next = validateOrgSignup(orgValues);
      setOrgErrors(next);
      const allTouched: Partial<Record<keyof OrgSignupValues, boolean>> = {};
      (Object.keys(orgValues) as Array<keyof OrgSignupValues>).forEach(
        (k) => { allTouched[k] = true; }
      );
      setOrgTouched(allTouched);
      if (Object.keys(next).length > 0) return;
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 1000));
      const params = new URLSearchParams({
        org: orgValues.organizationName,
        contact: orgValues.contactName,
      });
      router.push(`/pending-verification?${params.toString()}`);
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
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
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
          </label>
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
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
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
