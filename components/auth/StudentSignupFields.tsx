"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormField } from "./FormField";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrength } from "./PasswordStrength";
import { UniversityCombobox } from "./UniversityCombobox";
import type { DegreeLevel, FieldErrors, StudentSignupValues } from "./auth.types";

interface StudentSignupFieldsProps {
  values: StudentSignupValues;
  errors: FieldErrors<StudentSignupValues>;
  onChange: <K extends keyof StudentSignupValues>(key: K, value: StudentSignupValues[K]) => void;
  onBlur: (key: keyof StudentSignupValues) => void;
}

const degreeOptions: { value: DegreeLevel; label: string }[] = [
  { value: "undergraduate", label: "Undergrad" },
  { value: "masters", label: "Masters" },
  { value: "phd", label: "PhD" },
];

export function StudentSignupFields({
  values,
  errors,
  onChange,
  onBlur,
}: StudentSignupFieldsProps) {
  return (
    <div className="stagger-fields flex flex-col gap-3.5">

      {/* Row 1: Full name + Email (2-col) */}
      <div className="grid grid-cols-2 gap-3">
        <FormField id="fullName" label="Full name" error={errors.fullName}>
          <Input
            id="fullName"
            autoComplete="name"
            placeholder="Ahmad Ali"
            value={values.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            onBlur={() => onBlur("fullName")}
            aria-invalid={!!errors.fullName || undefined}
            className="h-9 text-sm"
          />
        </FormField>

        <FormField id="email" label="Email address" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="ahmad@gmail.com"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onBlur("email")}
            aria-invalid={!!errors.email || undefined}
            className="h-9 text-sm"
          />
        </FormField>
      </div>

      {/* Row 2: Password (full width) */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password" className="text-sm font-medium text-foreground">
          Create password
        </Label>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          value={values.password}
          onChange={(e) => onChange("password", e.target.value)}
          onBlur={() => onBlur("password")}
          invalid={!!errors.password}
        />
        {errors.password ? (
          <p className="text-xs font-medium text-destructive" role="alert">
            {errors.password}
          </p>
        ) : (
          <PasswordStrength password={values.password} />
        )}
      </div>

      {/* Row 3: University + Degree level (2-col) */}
      <div className="grid grid-cols-2 gap-3">
        <FormField id="university" label="University" error={errors.university}>
          <UniversityCombobox
            id="university"
            value={values.university}
            onChange={(v) => {
              onChange("university", v);
              onBlur("university");
            }}
            invalid={!!errors.university}
          />
        </FormField>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium text-foreground">Degree level</Label>
          <div
            role="radiogroup"
            aria-label="Degree level"
            className="grid h-9 grid-cols-3 gap-0.5 rounded-lg bg-muted p-1"
          >
            {degreeOptions.map(({ value: v, label }) => {
              const active = values.degreeLevel === v;
              return (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange("degreeLevel", v)}
                  className={cn(
                    "flex items-center justify-center rounded-md text-[11px] font-medium leading-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-white text-emerald-700 shadow-sm dark:bg-background dark:text-emerald-400"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {errors.degreeLevel && (
            <p className="text-xs font-medium text-destructive" role="alert">
              {errors.degreeLevel}
            </p>
          )}
        </div>
      </div>

      {/* University "Other" free-text */}
      {values.university === "Other" && (
        <FormField
          id="universityOther"
          label="Enter your university name"
          error={errors.universityOther}
        >
          <Input
            id="universityOther"
            placeholder="Your university"
            value={values.universityOther}
            onChange={(e) => onChange("universityOther", e.target.value)}
            onBlur={() => onBlur("universityOther")}
            aria-invalid={!!errors.universityOther || undefined}
            className="h-9 text-sm"
          />
        </FormField>
      )}
    </div>
  );
}
