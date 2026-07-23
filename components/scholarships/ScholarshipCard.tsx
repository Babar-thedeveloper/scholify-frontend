"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calendar,
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
  getFundingPill,
  formatDeadline,
  daysUntil,
  deadlineStatus,
  getDaysAgo,
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
  const router = useRouter();
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
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${getFundingPill(scholarship.fundingType)}`}>
            {fundingLabel(scholarship.fundingType)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900 dark:text-gray-100">
          {scholarship.title}
        </h3>

        {/* Provider */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="flex size-4 shrink-0 items-center justify-center rounded bg-emerald-100 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            {providerInitials(scholarship.provider)}
          </span>
          <span className="truncate text-xs text-muted-foreground">{scholarship.provider}</span>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <GraduationCap className="size-3" aria-hidden="true" />
            {levelLabel(scholarship.level)}
          </span>
          {scholarship.destination !== "Pakistan" && (
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <MapPin className="size-3" aria-hidden="true" />
              {scholarship.destination}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="mt-auto pt-4">
          <div className="h-px bg-gray-100 dark:bg-gray-800" />
        </div>

        {/* Footer */}
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
              <Calendar className="size-3.5" aria-hidden="true" />
              Posted {getDaysAgo(scholarship.postedAt)}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={`inline-flex cursor-default items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${deadlineClass}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CalendarClock className="size-3" aria-hidden="true" />
                  {deadlineText}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">Deadline: {formatDeadline(scholarship.deadline)}</TooltipContent>
            </Tooltip>
          </div>

          <div className="mt-1 flex gap-2">
            {/* Platform postings apply through Scholify; external postings apply on the provider's site. */}
            <Button
              size="xl"
              variant="outline"
              disabled={!scholarship.isExternal}
              className="relative z-20 min-w-0 flex-1 rounded-md px-2"
              onClick={(e) => {
                e.stopPropagation();
                if (scholarship.applyUrl) window.open(scholarship.applyUrl, "_blank", "noopener,noreferrer");
              }}
              aria-label={`Direct apply for ${scholarship.title}`}
            >
              Direct Apply
              {scholarship.isExternal && <ArrowRight className="size-4" aria-hidden="true" />}
            </Button>
            {scholarship.isExternal ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="xl"
                    className="relative z-20 min-w-0 flex-1 rounded-md px-2"
                    aria-disabled="true"
                    aria-label="Apply with Scholify unavailable"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    Apply with Scholify
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>This listing only supports direct applications.</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                size="xl"
                className="relative z-20 min-w-0 flex-1 rounded-md px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(scholarship.detailUrl);
                }}
                aria-label={`Apply with Scholify for ${scholarship.title}`}
              >
                Apply with Scholify
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
