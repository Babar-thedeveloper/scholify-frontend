"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
};

type ModalSize = keyof typeof sizeClasses;

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  size?: ModalSize;
}

interface ModalHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

interface ModalSectionProps {
  children: React.ReactNode;
  className?: string;
}

function Modal({ open, onOpenChange, trigger, children, className, size = "md" }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "max-h-[85vh] overflow-y-auto p-0",
          sizeClasses[size],
          className
        )}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

function ModalHeader({ title, description, className }: ModalHeaderProps) {
  return (
    <DialogHeader className={cn("px-6 pt-6", className)}>
      <DialogTitle>{title}</DialogTitle>
      {description && <DialogDescription>{description}</DialogDescription>}
    </DialogHeader>
  );
}

function ModalBody({ children, className }: ModalSectionProps) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

function ModalFooter({ children, className }: ModalSectionProps) {
  return (
    <div
      className={cn(
        "border-t bg-muted/50 px-6 py-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Modal, ModalHeader, ModalBody, ModalFooter };
