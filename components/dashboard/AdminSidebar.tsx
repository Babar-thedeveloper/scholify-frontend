"use client";

import {
  Flag,
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Briefcase,
  BookOpen,
  UserCog,
  Newspaper,
} from "lucide-react";
import { SidebarNav, type SidebarSection } from "./SidebarNav";

const SECTIONS: SidebarSection[] = [
  {
    label: "Platform",
    items: [
      { label: "Overview", href: "/admin", Icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Verification",
    items: [
      { label: "Organizations", href: "/admin/orgs", Icon: Building2 },
      { label: "Students", href: "/admin/students", Icon: Users },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "All Postings", href: "/admin/postings", Icon: Briefcase },
      { label: "Blog", href: "/admin/blog", Icon: Newspaper },
    ],
  },
  {
    label: "Access",
    items: [
      { label: "Users & Roles", href: "/admin/users", Icon: UserCog },
    ],
  },
  {
    label: "Config",
    items: [
      { label: "Feature Flags", href: "/admin/feature-flags", Icon: Flag },
      { label: "Admin Guide", href: "/admin/guide", Icon: BookOpen },
    ],
  },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <SidebarNav
      sections={SECTIONS}
      onNavigate={onNavigate}
      topSlot={
        <div className="flex items-center gap-2 rounded-md bg-rose-50 px-3 py-2 dark:bg-rose-500/10">
          <ShieldCheck className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">Admin Panel</span>
        </div>
      }
    />
  );
}
