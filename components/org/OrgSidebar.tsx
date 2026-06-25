"use client";

import Link from "next/link";
import {
  Building2,
  CreditCard,
  FileEdit,
  FileText,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNav, type SidebarSection } from "@/components/dashboard/SidebarNav";

const SECTIONS: SidebarSection[] = [
  {
    label: "Main",
    items: [
      { label: "Overview", href: "/org/dashboard", Icon: LayoutDashboard, exact: true },
      { label: "My Postings", href: "/org/postings", Icon: FileText, badge: 5 },
      { label: "Applicants", href: "/org/applicants", Icon: Users, badge: 23 },
      { label: "Drafts", href: "/org/drafts", Icon: FileEdit, badge: 2 },
    ],
  },
  {
    label: "Discover (P3)",
    items: [
      { label: "Search students", href: "/org/search", Icon: Search },
      { label: "Saved candidates", href: "/org/saved", Icon: Star },
    ],
  },
  {
    label: "Organization",
    items: [
      { label: "Org profile", href: "/org/profile", Icon: Building2 },
      { label: "Team", href: "/org/team", Icon: Users },
      { label: "Billing", href: "/org/billing", Icon: CreditCard },
      { label: "Settings", href: "/org/settings", Icon: Settings },
    ],
  },
];

export function OrgSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <SidebarNav
      sections={SECTIONS}
      onNavigate={onNavigate}
      topSlot={
        <Button size="lg" className="w-full" asChild>
          <Link href="/org/postings/new" onClick={onNavigate}>
            <Plus className="size-4" />
            New posting
          </Link>
        </Button>
      }
    />
  );
}
