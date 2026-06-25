"use client";

import { getPasswordStrength } from "./auth.schemas";

interface PasswordStrengthProps {
  password: string;
}

const segmentColor: Record<number, string> = {
  0: "bg-muted",
  1: "bg-red-500",
  2: "bg-orange-500",
  3: "bg-yellow-500",
  4: "bg-emerald-500",
};

const labelColor: Record<number, string> = {
  0: "text-muted-foreground",
  1: "text-red-600 dark:text-red-400",
  2: "text-orange-600 dark:text-orange-400",
  3: "text-yellow-700 dark:text-yellow-400",
  4: "text-emerald-700 dark:text-emerald-400",
};

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label } = getPasswordStrength(password);

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= score ? segmentColor[score] : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p
        className={`w-20 shrink-0 text-right text-[11px] font-medium ${
          password.length === 0 ? "text-muted-foreground" : labelColor[score]
        }`}
        aria-live="polite"
      >
        {password.length === 0 ? "8+ chars" : label}
      </p>
    </div>
  );
}
