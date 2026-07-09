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
import { useSidebarCounts } from "@/components/dashboard/useSidebarCounts";

function useSections(): SidebarSection[] {
  const { counts } = useSidebarCounts();
  const org = counts.organization;

  return [
    {
      label: "Main",
      items: [
        { label: "Overview", href: "/org/dashboard", Icon: LayoutDashboard, exact: true },
        { label: "My Postings", href: "/org/postings", Icon: FileText, badge: org?.postings || undefined },
        { label: "Applicants", href: "/org/applicants", Icon: Users, badge: org?.applicants || undefined },
        { label: "Drafts", href: "/org/drafts", Icon: FileEdit, badge: org?.drafts || undefined },
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
}

export function OrgSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const sections = useSections();
  return (
    <SidebarNav
      sections={sections}
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
