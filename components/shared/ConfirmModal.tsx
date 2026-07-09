"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  cancelText?: string;
  confirmText: string;
  onConfirm: () => void | Promise<void>;
  confirmVariant?: "default" | "destructive";
  busy?: boolean;
}

export function ConfirmModal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  cancelText = "Cancel",
  confirmText,
  onConfirm,
  confirmVariant = "destructive",
  busy = false,
}: ConfirmModalProps) {
  const destructive = confirmVariant === "destructive";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={destructive ? "destructive" : "default"}
              onClick={onConfirm}
              disabled={busy}
              className={cn(
                destructive &&
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              )}
            >
              {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
