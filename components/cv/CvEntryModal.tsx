"use client";

import { useRouter } from "next/navigation";
import { FileText, Sparkles, User } from "lucide-react";
import { Modal, ModalBody, ModalFooter } from "@/components/shared/Modal";

interface CvEntryModalProps {
  open: boolean;
  onClose: () => void;
}

export function CvEntryModal({ open, onClose }: CvEntryModalProps) {
  const router = useRouter();

  function go(path: string) {
    onClose();
    router.push(path);
  }

  return (
    <Modal open={open} onOpenChange={(v) => !v && onClose()} size="xl">
      {/* Custom header kept inline so the icon + badge layout stays compact */}
      <div className="flex items-start gap-3 px-6 pt-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow">
          <Sparkles className="size-5" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold leading-none">Scholify CV Builder</h2>
            <span className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900 shadow-sm">
              PRO
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Export a professional PDF in minutes.
          </p>
        </div>
      </div>

      <ModalBody className="pb-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OptionCard
            icon={<User className="size-5" />}
            badge="Recommended"
            title="From My Profile"
            description="Auto-fill name, university, and all saved extras."
            cta="Use my profile"
            ctaHref="/dashboard/cv"
            onNavigate={go}
            variant="primary"
          />
          <OptionCard
            icon={<FileText className="size-5" />}
            title="Start Fresh"
            description="Build a new CV. Your profile header stays pre-filled."
            cta="Start blank"
            ctaHref="/dashboard/cv?reset=true"
            onNavigate={go}
            variant="secondary"
          />
        </div>
      </ModalBody>

      <ModalFooter>
        <p className="text-center text-xs text-muted-foreground">
          Free for Scholify students · Europass & Modern templates · One-click PDF
        </p>
      </ModalFooter>
    </Modal>
  );
}

function OptionCard({
  icon,
  badge,
  title,
  description,
  cta,
  ctaHref,
  onNavigate,
  variant,
}: {
  icon: React.ReactNode;
  badge?: string;
  title: string;
  description: string;
  cta: string;
  ctaHref: string;
  onNavigate: (path: string) => void;
  variant: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";

  return (
    <button
      onClick={() => onNavigate(ctaHref)}
      className={`
        group relative flex flex-col items-start gap-3 rounded-xl border-2 p-5 text-left transition-all
        ${
          isPrimary
            ? "border-emerald-200 bg-emerald-50/60 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md dark:border-emerald-800/40 dark:bg-emerald-900/10 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/20"
            : "border-border bg-muted/30 hover:border-border hover:bg-muted/60 hover:shadow-md"
        }
      `}
    >
      {badge && (
        <span className="absolute -top-2.5 left-4 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          {badge}
        </span>
      )}
      <span
        className={`
          flex size-10 items-center justify-center rounded-lg
          ${
            isPrimary
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
          }
        `}
      >
        {icon}
      </span>
      <div className="flex-1">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <span
        className={`
          text-xs font-semibold transition-colors group-hover:underline
          ${
            isPrimary
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground group-hover:text-foreground"
          }
        `}
      >
        {cta} →
      </span>
    </button>
  );
}
