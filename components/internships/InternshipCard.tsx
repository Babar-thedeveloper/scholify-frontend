"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Internship } from "./internships.types";
import {
  getWorkModePill,
  workModeLabel,
  workTypeLabel,
  getFieldPill,
  fieldLabel,
  getStipendPill,
  stipendShort,
  getDaysAgo,
  getDeadlineUrgency,
  formatDeadline,
} from "./internships.utils";

interface InternshipCardProps {
  internship: Internship;
  onClick?: () => void;
}

export function InternshipCard({ internship, onClick }: InternshipCardProps) {
  const router = useRouter();
  const urgency = getDeadlineUrgency(internship.deadline, new Date());

  const deadlineClass =
    urgency === "urgent"
      ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
      : urgency === "soon"
      ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
      : "bg-muted/60 text-muted-foreground";

  return (
    <Card
      className="group relative flex h-full cursor-pointer flex-col rounded-2xl border-0 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } }}
      aria-label={`View details for ${internship.title}`}
    >

      <CardContent className="relative z-10 flex flex-1 flex-col p-5">
        {/* Work mode + work type row */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${getWorkModePill(internship.workMode)}`}
          >
            {workModeLabel(internship.workMode)}
          </span>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {workTypeLabel(internship.workType)}
          </span>
        </div>

        {/* Company + city */}
        <div className="mt-3 flex items-center gap-2">
          {internship.companyLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={internship.companyLogoUrl}
              alt={`${internship.company} logo`}
              className="size-5 rounded-md object-cover"
            />
          ) : (
            <span className="flex size-5 items-center justify-center rounded-md bg-emerald-100 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              {internship.companyInitials}
            </span>
          )}
          <span className="truncate text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {internship.company}
            {internship.city ? ` · ${internship.city}` : " · Remote"}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-semibold leading-tight text-gray-900 dark:text-gray-100">
          {internship.title}
        </h3>

        {/* Summary */}
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
          {internship.summary}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${getStipendPill(internship.isPaid)}`}>
            {stipendShort(internship.stipend)}
          </span>
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${getFieldPill()}`}>
            {fieldLabel(internship.field)}
          </span>
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <Clock className="mr-1 size-3" aria-hidden="true" />
            {internship.duration}
          </span>
        </div>

        {/* Spacer */}
        <div className="mt-auto pt-4">
          <div className="h-px bg-gray-100 dark:bg-gray-800" />
        </div>

        {/* Posted & action */}
        <div className="mt-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[12px] text-gray-500 dark:text-gray-400">
              <MapPin className="size-3.5" aria-hidden="true" />
              <span>Posted {getDaysAgo(internship.postedAt)}</span>
            </div>
            {internship.deadline && urgency !== "normal" && (
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${deadlineClass}`}>
                Closes {formatDeadline(internship.deadline)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {internship.isExternal ? (
              <>
                <Button
                  size="sm"
                  className="relative z-20 gap-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(internship.applyUrl, "_blank", "noopener,noreferrer");
                  }}
                  aria-label={`Apply on ${internship.company} for ${internship.title}`}
                >
                  Apply
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="relative z-20 w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(internship.detailUrl);
                  }}
                  aria-label={`View full details for ${internship.title}`}
                >
                  Details
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="relative z-20 col-span-2 gap-1 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(internship.detailUrl);
                }}
                aria-label={`Apply with Scholify for ${internship.title}`}
              >
                Apply with Scholify
                <ArrowRight className="size-3" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
