"use client";

// DEV-ONLY: floating control to switch mock role. Hidden in production.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bug, Building2, GraduationCap, UserX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, type UserRole } from "./UserContext";

const OPTIONS: { role: UserRole; label: string; Icon: typeof Bug; redirect: string }[] = [
  { role: "guest", label: "Guest", Icon: UserX, redirect: "/" },
  { role: "student", label: "Student", Icon: GraduationCap, redirect: "/dashboard" },
  { role: "org", label: "Organization", Icon: Building2, redirect: "/org/dashboard" },
];

export function RoleSwitcher() {
  const { role, setRole } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (process.env.NODE_ENV === "production") return null;

  function choose(next: UserRole, redirect: string) {
    setRole(next);
    router.push(redirect);
    setOpen(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      {open ? (
        <div className="w-56 rounded-xl border border-border bg-popover p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Switch role (dev)</p>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {OPTIONS.map(({ role: r, label, Icon, redirect }) => (
              <button
                key={r}
                onClick={() => choose(r, redirect)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  role === r
                    ? "bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                    : "text-foreground/80 hover:bg-muted"
                )}
              >
                <Icon className="size-4" />
                {label}
                {role === r && <span className="ml-auto text-[10px]">active</span>}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex size-11 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105"
          aria-label="Open dev role switcher"
          title="Dev role switcher"
        >
          <Bug className="size-5" />
        </button>
      )}
    </div>
  );
}
