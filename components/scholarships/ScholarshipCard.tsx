"use client";

import {
  ArrowRight,
  CalendarClock,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Scholarship } from "./scholarships.types";
import {
  getCategoryPill,
  formatDeadline,
  daysUntil,
  deadlineStatus,
} from "./scholarships.utils";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onClick?: () => void;
}

function fundingLabel(type: Scholarship["fundingType"]): string {
  switch (type) {
    case "fully-funded":
      return "Fully funded";
    case "need-based":
      return "Need-based";
    case "merit-based":
      return "Merit-based";
    case "partial":
      return "Partial funding";
    default:
      return type;
  }
}

function levelLabel(level: Scholarship["level"]): string {
  return level === "phd"
    ? "PhD"
    : level.charAt(0).toUpperCase() + level.slice(1);
}

function categoryLabel(category: Scholarship["category"]): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function providerInitials(provider: string): string {
  return provider
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
}

export function ScholarshipCard({ scholarship, onClick }: ScholarshipCardProps) {
  const daysLeft = daysUntil(scholarship.deadline, new Date());
  const status = deadlineStatus(daysLeft);

  const deadlineText =
    status === "open"
      ? "Open deadline"
      : status === "far"
      ? `${daysLeft} days left`
      : status === "soon"
      ? `${daysLeft} days left`
      : `${daysLeft} days left!`;

  const deadlineClass =
    status === "open"
      ? "bg-muted/60 text-muted-foreground"
      : status === "far"
      ? "bg-muted/60 text-muted-foreground"
      : status === "soon"
      ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
      : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";

  return (
    <Card
      className="group relative flex h-full cursor-pointer flex-col rounded-2xl border-0 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } }}
      aria-label={`View details for ${scholarship.title}`}
    >

      <CardContent className="relative z-10 flex flex-1 flex-col p-5">
        {/* Category + funding row */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${getCategoryPill(scholarship.category)}`}
          >
            {categoryLabel(scholarship.category)}
          </span>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {fundingLabel(scholarship.fundingType)}
          </span>
        </div>

        {/* Provider (matches internship card layout: initials avatar + name) */}
        <div className="mt-3 flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-md bg-emerald-100 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            {providerInitials(scholarship.provider)}
          </span>
          <span className="truncate text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {scholarship.provider}
            {scholarship.destination && scholarship.destination !== "Pakistan"
              ? ` · ${scholarship.destination}`
              : ""}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-semibold leading-tight text-gray-900 dark:text-gray-100">
          {scholarship.title}
        </h3>

        {/* Summary */}
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
          {scholarship.summary}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <GraduationCap className="mr-1 size-3" aria-hidden="true" />
            {levelLabel(scholarship.level)}
          </span>
          {scholarship.destination !== "Pakistan" && (
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <MapPin className="mr-1 size-3" aria-hidden="true" />
              {scholarship.destination}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="mt-auto pt-4">
          <div className="h-px bg-gray-100 dark:bg-gray-800" />
        </div>

        {/* Deadline & action */}
        <div className="mt-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[12px] text-gray-500 dark:text-gray-400">
              <CalendarClock className="size-3.5" aria-hidden="true" />
              <span>{formatDeadline(scholarship.deadline)}</span>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${deadlineClass}`}>
              {deadlineText}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              className="relative z-20 gap-1 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                window.open(scholarship.applyUrl, "_blank", "noopener,noreferrer");
              }}
              aria-label={`Direct apply for ${scholarship.title}`}
            >
              Apply
              <ArrowRight className="size-3" aria-hidden="true" />
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    className="relative z-20 w-full cursor-not-allowed text-xs"
                    aria-label={`Apply with Scholify for ${scholarship.title} - coming soon`}
                  >
                    Scholify Apply
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Coming soon</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
