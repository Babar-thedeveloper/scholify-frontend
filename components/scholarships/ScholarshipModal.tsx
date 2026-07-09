"use client";

import {
  ArrowRight,
  CalendarClock,
  GraduationCap,
  MapPin,
  Building2,
  Coins,
  Globe,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal, ModalBody, ModalHeader } from "@/components/shared/Modal";
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

interface ScholarshipModalProps {
  scholarship: Scholarship | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function ScholarshipModal({
  scholarship,
  open,
  onOpenChange,
}: ScholarshipModalProps) {
  if (!scholarship) return null;

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

  const deadlineBadgeClass =
    status === "open" || status === "far"
      ? "text-gray-600 dark:text-gray-400"
      : status === "soon"
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="xl">
      <ModalHeader
        title={
          <div className="space-y-1">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getCategoryPill(scholarship.category)}`}
            >
              {categoryLabel(scholarship.category)}
            </span>
            <span className="block text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100">
              {scholarship.title}
            </span>
          </div>
        }
        description={scholarship.summary}
      />

      <ModalBody>
        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4">
            <DetailItem
              icon={<Building2 className="size-4" />}
              label="Provider"
              value={scholarship.provider}
            />
            <DetailItem
              icon={<Coins className="size-4" />}
              label="Funding"
              value={fundingLabel(scholarship.fundingType)}
            />
            <DetailItem
              icon={<GraduationCap className="size-4" />}
              label="Level"
              value={levelLabel(scholarship.level)}
            />
            <DetailItem
              icon={<Globe className="size-4" />}
              label="Destination"
              value={scholarship.destination}
            />
            <DetailItem
              icon={<CalendarClock className="size-4" />}
              label="Deadline"
              value={formatDeadline(scholarship.deadline)}
            />
            <DetailItem
              icon={<Clock className="size-4" />}
              label="Status"
              value={deadlineText}
              valueClassName={deadlineBadgeClass}
            />
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-gray-100 dark:bg-gray-800" />

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button
              className="flex-1 gap-2"
              onClick={() => {
                window.open(
                  scholarship.applyUrl,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              aria-label={`Direct apply for ${scholarship.title}`}
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              Direct Apply
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex flex-1">
                  <Button
                    variant="outline"
                    disabled
                    className="w-full cursor-not-allowed gap-2"
                    aria-label={`Apply with Scholify for ${scholarship.title} - coming soon`}
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
      </ModalBody>
    </Modal>
  );
}

function DetailItem({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0 text-gray-400 dark:text-gray-500">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {label}
        </p>
        <p
          className={`mt-0.5 text-[13px] font-medium ${
            valueClassName || "text-gray-800 dark:text-gray-200"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
