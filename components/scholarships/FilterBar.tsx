"use client";

import { Lock } from "lucide-react";
import { CategoryTabs } from "./CategoryTabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ScholarshipFilters } from "./scholarships.types";

type PanelFilters = Omit<ScholarshipFilters, "search" | "sort" | "page">;

interface FilterBarProps {
  filters: PanelFilters;
  onChange: (filters: PanelFilters) => void;
}

const degreeOptions = [
  { value: "all", label: "All levels" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "masters", label: "Masters" },
  { value: "phd", label: "PhD" },
];

const fundingOptions = [
  { value: "all", label: "All types" },
  { value: "fully-funded", label: "Fully funded" },
  { value: "partial", label: "Partial funding" },
  { value: "need-based", label: "Need-based" },
  { value: "merit-based", label: "Merit-based" },
];

const destinationOptions = [
  { value: "all", label: "All destinations" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "UK", label: "UK" },
  { value: "USA", label: "USA" },
  { value: "Germany", label: "Germany" },
  { value: "Turkey", label: "Turkey" },
  { value: "China", label: "China" },
  { value: "Australia", label: "Australia" },
  { value: "Other", label: "Other" },
];

const deadlineOptions = [
  { value: "any", label: "Any deadline" },
  { value: "this-week", label: "Closing this week" },
  { value: "this-month", label: "Closing this month" },
  { value: "next-3-months", label: "Next 3 months" },
  { value: "open", label: "Open / rolling" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

/** Vertical filter panel - used in the desktop sidebar and the mobile drawer. */
export function FilterBar({ filters, onChange }: FilterBarProps) {
  const update = <K extends keyof PanelFilters>(key: K, value: PanelFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col gap-5">
      <Field label="Category">
        <CategoryTabs
          value={filters.category}
          onChange={(category) => onChange({ ...filters, category })}
        />
      </Field>

      <Field label="Degree level">
        <Select value={filters.level} onValueChange={(v) => update("level", v as PanelFilters["level"])}>
          <SelectTrigger className="w-full text-[13px]"><SelectValue placeholder="Degree level" /></SelectTrigger>
          <SelectContent>
            {degreeOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Funding type">
        <Select value={filters.fundingType} onValueChange={(v) => update("fundingType", v as PanelFilters["fundingType"])}>
          <SelectTrigger className="w-full text-[13px]"><SelectValue placeholder="Funding type" /></SelectTrigger>
          <SelectContent>
            {fundingOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Destination">
        <Select value={filters.destination} onValueChange={(v) => update("destination", v as PanelFilters["destination"])}>
          <SelectTrigger className="w-full text-[13px]"><SelectValue placeholder="Destination" /></SelectTrigger>
          <SelectContent>
            {destinationOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Deadline">
        <Select value={filters.deadlineRange} onValueChange={(v) => update("deadlineRange", v as PanelFilters["deadlineRange"])}>
          <SelectTrigger className="w-full text-[13px]"><SelectValue placeholder="Deadline" /></SelectTrigger>
          <SelectContent>
            {deadlineOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Field of study">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select value="all" disabled aria-label="Field of study filter">
                <SelectTrigger className="w-full cursor-not-allowed text-[13px] opacity-60">
                  <div className="flex items-center gap-2">
                    <Lock className="size-3.5" aria-hidden="true" />
                    <SelectValue placeholder="Field of study" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All fields</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right"><p>Coming soon</p></TooltipContent>
        </Tooltip>
      </Field>
    </div>
  );
}
