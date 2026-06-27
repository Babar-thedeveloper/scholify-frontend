"use client";

// ─────────────────────────────────────────────────────────────
// DEV-ONLY quick-login. Real auth is in place — this just calls
// the real /login endpoint with predefined demo credentials so
// you can flip between roles during UI work without typing them.
//
// Create these accounts in the backend with `npm run db:seed`
// (or signup once manually) before using this widget.
//
// Hidden in production.
// ─────────────────────────────────────────────────────────────
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bug, Building2, GraduationCap, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "./UserContext";

const DEMO_ACCOUNTS = [
  {
    label: "Student",
    Icon: GraduationCap,
    email: "demo.student@scholify.pk",
    password: "demo1234",
    redirect: "/dashboard",
  },
  {
    label: "Organization",
    Icon: Building2,
    email: "demo.org@scholify.pk",
    password: "demo1234",
    redirect: "/org/dashboard",
  },
] as const;

export function RoleSwitcher() {
  const { user, isAuthed, login, logout } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (process.env.NODE_ENV === "production") return null;

  async function quickLogin(email: string, password: string, redirect: string) {
    setBusy(true);
    try {
      await login({ email, password });
      router.push(redirect);
      setOpen(false);
    } catch (err) {
      toast.error(`Login failed: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  async function quickLogout() {
    setBusy(true);
    try {
      await logout();
      router.push("/");
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      {open ? (
        <div className="w-64 rounded-xl border border-border bg-popover p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Dev quick login</p>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-3.5" />
            </button>
          </div>
          {isAuthed && (
            <p className="mb-2 truncate rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
              Logged in as <span className="font-medium text-foreground">{user.email}</span>
            </p>
          )}
          <div className="flex flex-col gap-1">
            {DEMO_ACCOUNTS.map(({ label, Icon, email, password, redirect }) => (
              <button
                key={email}
                disabled={busy}
                onClick={() => quickLogin(email, password, redirect)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  "text-foreground/80 hover:bg-muted disabled:opacity-50"
                )}
              >
                <Icon className="size-4" />
                Login as {label}
              </button>
            ))}
            {isAuthed && (
              <button
                disabled={busy}
                onClick={quickLogout}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
              >
                <LogOut className="size-4" />
                Log out
              </button>
            )}
          </div>
          <p className="mt-2 text-[10px] leading-snug text-muted-foreground">
            Demo accounts must be seeded in the backend first.
          </p>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex size-11 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105"
          aria-label="Open dev quick-login"
          title="Dev quick-login"
        >
          <Bug className="size-5" />
        </button>
      )}
    </div>
  );
}
