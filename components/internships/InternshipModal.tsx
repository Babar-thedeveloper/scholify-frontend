"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Briefcase,
  Coins,
  MapPin,
  Clock,
  CalendarClock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal, ModalBody, ModalHeader } from "@/components/shared/Modal";
import type { Internship } from "./internships.types";
import {
  getWorkModePill,
  workModeLabel,
  workTypeLabel,
  fieldLabel,
  stipendShort,
  getDaysAgo,
  formatDeadline,
  formatStartDate,
} from "./internships.utils";

interface InternshipModalProps {
  internship: Internship | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InternshipModal({
  internship,
  open,
  onOpenChange,
}: InternshipModalProps) {
  const router = useRouter();
  if (!internship) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="xl">
      <ModalHeader
        title={
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getWorkModePill(internship.workMode)}`}
              >
                {workModeLabel(internship.workMode)}
              </span>
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                {workTypeLabel(internship.workType)}
              </span>
            </div>
            <span className="block text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100">
              {internship.title}
            </span>
          </div>
        }
        description={internship.summary}
      />

      <ModalBody>
        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4">
            <DetailItem
              icon={<Building2 className="size-4" />}
              label="Company"
              value={internship.company}
            />
            <DetailItem
              icon={<MapPin className="size-4" />}
              label="Location"
              value={internship.city ?? "Remote"}
            />
            <DetailItem
              icon={<Briefcase className="size-4" />}
              label="Field"
              value={fieldLabel(internship.field)}
            />
            <DetailItem
              icon={<Coins className="size-4" />}
              label="Stipend"
              value={stipendShort(internship.stipend)}
            />
            <DetailItem
              icon={<Clock className="size-4" />}
              label="Duration"
              value={internship.duration}
            />
            <DetailItem
              icon={<CalendarClock className="size-4" />}
              label="Starts"
              value={formatStartDate(internship.startDate)}
            />
            <DetailItem
              icon={<CalendarClock className="size-4" />}
              label="Deadline"
              value={formatDeadline(internship.deadline)}
            />
            <DetailItem
              icon={<Clock className="size-4" />}
              label="Posted"
              value={getDaysAgo(internship.postedAt)}
            />
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-gray-100 dark:bg-gray-800" />

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5 sm:flex-row">
            {internship.isExternal ? (
              <>
                <Button
                  className="flex-1 gap-2"
                  onClick={() => {
                    window.open(internship.applyUrl, "_blank", "noopener,noreferrer");
                  }}
                  aria-label={`Apply on ${internship.company} for ${internship.title}`}
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  Apply on {internship.company}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => router.push(internship.detailUrl)}
                  aria-label={`View full details for ${internship.title}`}
                >
                  View full details
                </Button>
              </>
            ) : (
              <Button
                className="flex-1 gap-2"
                onClick={() => router.push(internship.detailUrl)}
                aria-label={`Apply with Scholify for ${internship.title}`}
              >
                Apply with Scholify
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Button>
            )}
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
