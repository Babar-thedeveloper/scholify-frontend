"use client";

import { cn } from "@/lib/utils";
import type { ScholarshipCategory } from "./scholarships.types";

interface CategoryTabsProps {
  value: ScholarshipCategory | "all";
  onChange: (value: ScholarshipCategory | "all") => void;
}

const tabs: { label: string; value: ScholarshipCategory | "all" }[] = [
  { label: "All scholarships", value: "all" },
  { label: "National", value: "national" },
  { label: "International", value: "international" },
  { label: "Provincial", value: "provincial" },
];

export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Scholarship categories"
    >
      {tabs.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border border-emerald-200/40 bg-primary text-primary-foreground shadow-sm shadow-emerald-900/10"
                : "border border-emerald-200/70 bg-white/70 text-muted-foreground shadow-sm shadow-black/5 backdrop-blur-md hover:border-emerald-300 hover:bg-white/90"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
