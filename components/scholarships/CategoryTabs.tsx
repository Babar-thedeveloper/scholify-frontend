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
              "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-foreground text-background"
                : "text-gray-500 hover:text-foreground hover:bg-muted dark:text-gray-400"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
