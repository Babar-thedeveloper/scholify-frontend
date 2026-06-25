"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ResendEmailButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-sm"
      onClick={() => toast.success("Verification email resent")}
    >
      Resend email
    </Button>
  );
}
