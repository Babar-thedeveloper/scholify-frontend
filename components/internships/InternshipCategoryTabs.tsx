"use client";

import { cn } from "@/lib/utils";
import type { WorkMode } from "./internships.types";

interface InternshipCategoryTabsProps {
  value: WorkMode | "all";
  onChange: (value: WorkMode | "all") => void;
}

const tabs: { label: string; value: WorkMode | "all" }[] = [
  { label: "All internships", value: "all" },
  { label: "Remote", value: "remote" },
  { label: "Onsite", value: "onsite" },
  { label: "Hybrid", value: "hybrid" },
];

export function InternshipCategoryTabs({
  value,
  onChange,
}: InternshipCategoryTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Internship work modes"
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
