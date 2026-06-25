"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Bookmark,
  Building2,
  Clock,
  CreditCard,
  FileText,
  HelpCircle,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Settings,
  User as UserIcon,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/auth/UserContext";

const STUDENT_ITEMS = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "My Applications", href: "/dashboard/applications", Icon: ListChecks },
  { label: "Saved scholarships", href: "/dashboard/saved", Icon: Bookmark },
  { label: "Reminders", href: "/dashboard/reminders", Icon: Clock },
  { label: "My Profile", href: "/dashboard/profile", Icon: UserIcon },
  { label: "My CV", href: "/dashboard/cv", Icon: FileText },
];

const ORG_ITEMS = [
  { label: "Dashboard", href: "/org/dashboard", Icon: LayoutDashboard },
  { label: "My Postings", href: "/org/postings", Icon: FileText },
  { label: "Applicants", href: "/org/applicants", Icon: Users },
  { label: "Organization profile", href: "/org/profile", Icon: Building2 },
];

export function AvatarDropdown() {
  const { user, logout } = useUser();
  const router = useRouter();
  const isOrg = user.role === "org";
  const items = isOrg ? ORG_ITEMS : STUDENT_ITEMS;
  const verified = user.organization?.verified;

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isOrg
              ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
          )}
          aria-label="Account menu"
        >
          {user.initials}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {/* Identity */}
        <div className="px-2.5 py-2">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            {isOrg &&
              (verified ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <BadgeCheck className="size-3" /> Verified
                </span>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  <Clock className="size-3" /> Pending
                </span>
              ))}
          </div>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        {items.map(({ label, href, Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href}>
              <Icon />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={isOrg ? "/org/settings" : "/dashboard/settings"}>
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>
        {isOrg && (
          <DropdownMenuItem asChild>
            <Link href="/org/billing">
              <CreditCard />
              Billing
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/help">
            <HelpCircle />
            Help &amp; support
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
