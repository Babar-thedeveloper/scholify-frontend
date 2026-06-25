"use client";

import { Building2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserType } from "./auth.types";

interface UserTypeToggleProps {
  value: UserType;
  onChange: (value: UserType) => void;
}

const options: { value: UserType; label: string; Icon: typeof GraduationCap }[] = [
  { value: "student", label: "Student", Icon: GraduationCap },
  { value: "organization", label: "Organization", Icon: Building2 },
];

export function UserTypeToggle({ value, onChange }: UserTypeToggleProps) {
  const activeIndex = options.findIndex((o) => o.value === value);

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">I am a...</p>
      <div
        role="radiogroup"
        aria-label="Account type"
        className="relative grid grid-cols-2 rounded-xl bg-muted p-1"
      >
        {/* Sliding indicator */}
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow-sm transition-transform duration-300 ease-out dark:bg-background"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
        {options.map(({ value: v, label, Icon }) => {
          const active = value === v;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(v)}
              className={cn(
                "relative z-10 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
