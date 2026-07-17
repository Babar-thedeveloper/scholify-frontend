"use client";

import { Button } from "@/components/ui/button";
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
