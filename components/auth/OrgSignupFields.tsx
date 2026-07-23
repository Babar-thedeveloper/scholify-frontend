"use client";

import { Briefcase, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FormField } from "./FormField";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrength } from "./PasswordStrength";
import { isPersonalEmail } from "./auth.schemas";
import type { FieldErrors, OrganizationType, OrgSignupValues } from "./auth.types";

interface OrgSignupFieldsProps {
  values: OrgSignupValues;
  errors: FieldErrors<OrgSignupValues>;
  onChange: <K extends keyof OrgSignupValues>(
    key: K,
    value: OrgSignupValues[K]
  ) => void;
  onBlur: (key: keyof OrgSignupValues) => void;
}

const orgTypeOptions: { value: OrganizationType; label: string; Icon: typeof GraduationCap }[] = [
  { value: "scholarship-provider", label: "Scholarship Provider", Icon: GraduationCap },
  { value: "internship-provider", label: "Internship / Job Provider", Icon: Briefcase },
];

const COUNTRIES = [
  "Pakistan",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Turkey",
  "China",
  "United Arab Emirates",
  "Saudi Arabia",
  "Other",
];

export function OrgSignupFields({
  values,
  errors,
  onChange,
  onBlur,
}: OrgSignupFieldsProps) {
  const showPersonalEmailWarning =
    !errors.email && values.email.includes("@") && isPersonalEmail(values.email);

  return (
    <div className="stagger-fields flex flex-col gap-3.5">
      {/* Row 1: Organization name (full width) */}
      <FormField
        id="organizationName"
        label="Organization name"
        error={errors.organizationName}
      >
        <Input
          id="organizationName"
          placeholder="e.g. Daraz, HEC, Aga Khan Foundation"
          value={values.organizationName}
          onChange={(e) => onChange("organizationName", e.target.value)}
          onBlur={() => onBlur("organizationName")}
          aria-invalid={!!errors.organizationName || undefined}
          className="h-9 text-sm"
        />
      </FormField>

      {/* Row 2: Org type toggle (compact) */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium text-foreground">Organization type</Label>
        <div
          role="radiogroup"
          aria-label="Organization type"
          className="grid h-9 grid-cols-2 gap-1 rounded-xl bg-muted p-1"
        >
          {orgTypeOptions.map(({ value: v, label, Icon }) => {
            const active = values.organizationType === v;
            return (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange("organizationType", v)}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-white text-emerald-700 shadow-sm dark:bg-background dark:text-emerald-400"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
        {errors.organizationType && (
          <p className="text-xs font-medium text-destructive" role="alert">
            {errors.organizationType}
          </p>
        )}
      </div>

      {/* Row 3: Official email (full width) */}
      <FormField
        id="email"
        label="Official email address"
        error={errors.email}
        helper={
          showPersonalEmailWarning
            ? "Personal email detected- use your official domain for faster verification."
            : undefined
        }
        helperVariant="warning"
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="hr@yourcompany.com"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          onBlur={() => onBlur("email")}
          aria-invalid={!!errors.email || undefined}
          className="h-9 text-sm"
        />
      </FormField>

      {/* Row 4: Password (full width) */}
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

      {/* Row 5: Contact name + Designation (2-col) */}
      <div className="grid grid-cols-2 gap-3">
        <FormField id="contactName" label="Your full name" error={errors.contactName}>
          <Input
            id="contactName"
            autoComplete="name"
            placeholder="Sara Ahmed"
            value={values.contactName}
            onChange={(e) => onChange("contactName", e.target.value)}
            onBlur={() => onBlur("contactName")}
            aria-invalid={!!errors.contactName || undefined}
            className="h-9 text-sm"
          />
        </FormField>

        <FormField id="designation" label="Your role" error={errors.designation}>
          <Input
            id="designation"
            placeholder="HR Manager"
            value={values.designation}
            onChange={(e) => onChange("designation", e.target.value)}
            onBlur={() => onBlur("designation")}
            aria-invalid={!!errors.designation || undefined}
            className="h-9 text-sm"
          />
        </FormField>
      </div>

      {/* Row 6: Website + Country (2-col) */}
      <div className="grid grid-cols-2 gap-3">
        <FormField
          id="website"
          label="Official website"
          error={errors.website}
        >
          <Input
            id="website"
            type="url"
            placeholder="https://yourorg.com"
            value={values.website}
            onChange={(e) => onChange("website", e.target.value)}
            onBlur={() => onBlur("website")}
            aria-invalid={!!errors.website || undefined}
            className="h-9 text-sm"
          />
        </FormField>

        <FormField id="country" label="Country" error={errors.country}>
          <Select
            value={values.country}
            onValueChange={(v) => {
              onChange("country", v);
              onBlur("country");
            }}
          >
            <SelectTrigger
              id="country"
              className="h-9 w-full text-sm"
              aria-invalid={!!errors.country || undefined}
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c} className="text-sm">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </div>
  );
}
