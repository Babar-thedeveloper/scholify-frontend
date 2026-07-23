"use client";

import { Lock } from "lucide-react";
import { InternshipCategoryTabs } from "./InternshipCategoryTabs";
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
import type { InternshipFilters } from "./internships.types";

type PanelFilters = Omit<InternshipFilters, "search" | "sort" | "page">;

interface InternshipFilterBarProps {
  filters: PanelFilters;
  onChange: (filters: PanelFilters) => void;
}

const workTypeOptions = [
  { value: "all", label: "All types" },
  { value: "internship", label: "Internship" },
  { value: "part-time", label: "Part-time" },
  { value: "full-time", label: "Full-time" },
];

const stipendOptions = [
  { value: "all", label: "All" },
  { value: "paid", label: "Paid only" },
  { value: "unpaid", label: "Unpaid only" },
];

const cityOptions = [
  { value: "all", label: "All cities" },
  { value: "Karachi", label: "Karachi" },
  { value: "Lahore", label: "Lahore" },
  { value: "Islamabad", label: "Islamabad" },
  { value: "Remote", label: "Remote" },
  { value: "Other", label: "Other" },
];

const durationOptions = [
  { value: "all", label: "Any duration" },
  { value: "1-3", label: "1–3 months" },
  { value: "3-6", label: "3–6 months" },
  { value: "6+", label: "6+ months" },
];

const fieldOptions = [
  { value: "all", label: "All fields" },
  { value: "software-it", label: "Software / IT" },
  { value: "marketing", label: "Marketing" },
  { value: "design", label: "Design" },
  { value: "finance", label: "Finance" },
  { value: "sales", label: "Sales / BD" },
  { value: "engineering", label: "Engineering" },
  { value: "other", label: "Other" },
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
export function InternshipFilterBar({ filters, onChange }: InternshipFilterBarProps) {
  const update = <K extends keyof PanelFilters>(key: K, value: PanelFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col gap-5">
      <Field label="Category">
        <InternshipCategoryTabs
          value={filters.category}
          onChange={(category) => onChange({ ...filters, category })}
        />
      </Field>

      <Field label="Work type">
        <Select value={filters.workType} onValueChange={(v) => update("workType", v as PanelFilters["workType"])}>
          <SelectTrigger className="w-full text-[13px]"><SelectValue placeholder="Work type" /></SelectTrigger>
          <SelectContent>
            {workTypeOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Stipend">
        <Select value={filters.stipend} onValueChange={(v) => update("stipend", v as PanelFilters["stipend"])}>
          <SelectTrigger className="w-full text-[13px]"><SelectValue placeholder="Stipend" /></SelectTrigger>
          <SelectContent>
            {stipendOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <Field label="City">
        <Select value={filters.city} onValueChange={(v) => update("city", v as PanelFilters["city"])}>
          <SelectTrigger className="w-full text-[13px]"><SelectValue placeholder="City" /></SelectTrigger>
          <SelectContent>
            {cityOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Duration">
        <Select value={filters.duration} onValueChange={(v) => update("duration", v as PanelFilters["duration"])}>
          <SelectTrigger className="w-full text-[13px]"><SelectValue placeholder="Duration" /></SelectTrigger>
          <SelectContent>
            {durationOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Field">
        <Select value={filters.field} onValueChange={(v) => update("field", v as PanelFilters["field"])}>
          <SelectTrigger className="w-full text-[13px]"><SelectValue placeholder="Field" /></SelectTrigger>
          <SelectContent>
            {fieldOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Experience level">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select value="all" disabled aria-label="Experience level filter">
                <SelectTrigger className="w-full cursor-not-allowed text-[13px] opacity-60">
                  <div className="flex items-center gap-2">
                    <Lock className="size-3.5" aria-hidden="true" />
                    <SelectValue placeholder="Experience level" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
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
