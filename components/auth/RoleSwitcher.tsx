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
import { Button } from "@/components/ui/button";
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
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-3.5" />
            </Button>
          </div>
          {isAuthed && (
            <p className="mb-2 truncate rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
              Logged in as <span className="font-medium text-foreground">{user.email}</span>
            </p>
          )}
          <div className="flex flex-col gap-1">
            {DEMO_ACCOUNTS.map(({ label, Icon, email, password, redirect }) => (
              <Button
                key={email}
                variant="ghost"
                size="sm"
                disabled={busy}
                onClick={() => quickLogin(email, password, redirect)}
                className="justify-start text-foreground/80"
              >
                <Icon className="size-4" />
                Login as {label}
              </Button>
            ))}
            {isAuthed && (
              <Button
                variant="ghost"
                size="sm"
                disabled={busy}
                onClick={quickLogout}
                className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4" />
                Log out
              </Button>
            )}
          </div>
          <p className="mt-2 text-[10px] leading-snug text-muted-foreground">
            Demo accounts must be seeded in the backend first.
          </p>
        </div>
      ) : (
        <Button
          variant="default"
          size="icon-lg"
          onClick={() => setOpen(true)}
          className="rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105"
          aria-label="Open dev quick-login"
          title="Dev quick-login"
        >
          <Bug className="size-5" />
        </Button>
      )}
    </div>
  );
}
