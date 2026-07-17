"use client";

import { Button } from "@/components/ui/button";
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
          <Button
            key={tab.value}
            variant={active ? "default" : "ghost"}
            size="sm"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className="rounded-full"
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
