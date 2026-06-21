"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Scholarship } from "./scholarships.types";
import {
  getCategoryBorder,
  getFundingPill,
  formatDeadline,
  daysUntil,
  deadlineStatus,
} from "./scholarships.utils";

interface ScholarshipCardProps {
  scholarship: Scholarship;
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

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
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
      ? "bg-slate-50 text-slate-600"
      : status === "far"
      ? "bg-emerald-50 text-emerald-700"
      : status === "soon"
      ? "bg-amber-50 text-amber-700"
      : "bg-red-50 text-red-700";

  const categoryColorClass =
    scholarship.category === "national"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : scholarship.category === "international"
      ? "bg-blue-50 text-blue-700 ring-blue-200"
      : "bg-amber-50 text-amber-700 ring-amber-200";

  const categoryGradientClass =
    scholarship.category === "national"
      ? "bg-gradient-to-b from-emerald-50/70 via-white/80 to-white/85"
      : scholarship.category === "international"
      ? "bg-gradient-to-b from-blue-50/70 via-white/80 to-white/85"
      : "bg-gradient-to-b from-amber-50/70 via-white/80 to-white/85";

  return (
    <Card
      className={`group relative flex h-full flex-col overflow-visible rounded-2xl border border-white/60 bg-white/85 shadow-md shadow-black/5 backdrop-blur-xl ring-0 transition-all hover:-translate-y-1 hover:bg-white/95 hover:shadow-[0_0_24px_-6px_rgba(5,150,105,0.15)] ${categoryGradientClass} ${getCategoryBorder(
        scholarship.category
      )}`}
    >
      <Link
        href={`/scholarships/${scholarship.id}`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`View details for ${scholarship.title}`}
      >
        <span className="sr-only">View details</span>
      </Link>

      <div className="relative z-20 px-4 pt-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${categoryColorClass}`}
        >
          {categoryLabel(scholarship.category)}
        </span>
      </div>

      <CardContent className="relative z-10 flex flex-1 flex-col gap-3 p-4 pt-2">
        {/* Header: provider + funding */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {scholarship.provider}
            </span>
          </div>
          <Badge
            variant="secondary"
            className={`shrink-0 text-xs font-medium ${getFundingPill(
              scholarship.fundingType
            )} border-0`}
          >
            {fundingLabel(scholarship.fundingType)}
          </Badge>
        </div>

        {/* Title & summary */}
        <div className="flex flex-col gap-2">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-foreground">
            {scholarship.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {scholarship.summary}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-muted text-muted-foreground border-0 text-xs font-medium"
          >
            <GraduationCap className="mr-1 size-3" aria-hidden="true" />
            {levelLabel(scholarship.level)}
          </Badge>
          {scholarship.destination !== "Pakistan" && (
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground border-0 text-xs font-medium"
            >
              <MapPin className="mr-1 size-3" aria-hidden="true" />
              {scholarship.destination}
            </Badge>
          )}
        </div>

        <Separator className="mt-auto" />

        {/* Deadline & action */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarClock className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-muted-foreground">
                {formatDeadline(scholarship.deadline)}
              </span>
            </div>
            <Badge
              variant="secondary"
              className={`border-0 text-xs font-semibold ${deadlineClass}`}
            >
              {deadlineText}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              className="relative z-20 gap-1 bg-emerald-600/95 text-white shadow-sm shadow-emerald-900/10 backdrop-blur-sm transition-all hover:bg-emerald-600"
              onClick={(e) => {
                e.stopPropagation();
                window.open(scholarship.applyUrl, "_blank", "noopener,noreferrer");
              }}
              aria-label={`Direct apply for ${scholarship.title}`}
            >
              Direct apply
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    className="relative z-20 w-full cursor-not-allowed border-emerald-200/70 bg-emerald-50/80 text-emerald-700 backdrop-blur-sm"
                    aria-label={`Apply with Scholify for ${scholarship.title} — coming soon`}
                  >
                    Apply with Scholify
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
