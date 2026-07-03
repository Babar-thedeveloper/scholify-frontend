"use client";

import { useRouter } from "next/navigation";
import { FileText, Sparkles, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/components/auth/UserContext";

interface CvEntryModalProps {
  open: boolean;
  onClose: () => void;
}

export function CvEntryModal({ open, onClose }: CvEntryModalProps) {
  const router = useRouter();
  const { user } = useUser();

  function go(path: string) {
    onClose();
    router.push(path);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader className="pb-1">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg leading-none">Scholify CV Builder</DialogTitle>
                <span className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900 shadow-sm">
                  PRO
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Pakistan's most professional CV generator — export to PDF instantly
              </p>
            </div>
          </div>
        </DialogHeader>

        {user.name && (
          <p className="text-sm text-muted-foreground -mt-1">
            Hey <span className="font-semibold text-foreground">{user.name}</span> — how would you like to build your CV?
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* From Profile */}
          <button
            onClick={() => go("/dashboard/cv")}
            className="group relative flex flex-col items-start gap-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/60 p-5 text-left transition-all hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md dark:border-emerald-800/40 dark:bg-emerald-900/10 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/20"
          >
            <span className="absolute -top-2.5 left-4 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Recommended
            </span>
            <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
              <User className="size-5" />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-foreground">From My Profile</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Auto-fill from your Scholify profile — name, university, academics, and all extras you've already added.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 transition-colors group-hover:underline dark:text-emerald-400">
              Use my profile →
            </span>
          </button>

          {/* Start Fresh */}
          <button
            onClick={() => go("/dashboard/cv?reset=true")}
            className="group flex flex-col items-start gap-3 rounded-xl border-2 border-border bg-muted/30 p-5 text-left transition-all hover:border-border hover:bg-muted/60 hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <FileText className="size-5" />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Start Fresh</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Clear all extras and build a brand-new CV from scratch. Your profile header (name, university) is still pre-filled.
              </p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground transition-colors group-hover:text-foreground group-hover:underline">
              Start blank →
            </span>
          </button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          ✦ Free for all Scholify students &nbsp;·&nbsp; Europass & Modern templates &nbsp;·&nbsp; One-click PDF
        </p>
      </DialogContent>
    </Dialog>
  );
}
