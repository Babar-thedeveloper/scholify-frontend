"use client";

import {
  Bookmark,
  Briefcase,
  CalendarDays,
  Clock,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Settings,
  User,
} from "lucide-react";
import { SidebarNav, type SidebarSection } from "./SidebarNav";

const SECTIONS: SidebarSection[] = [
  {
    label: "Main",
    items: [
      { label: "Overview", href: "/dashboard", Icon: LayoutDashboard, exact: true },
      { label: "My Applications", href: "/dashboard/applications", Icon: ListChecks, badge: 3 },
      { label: "Saved Items", href: "/dashboard/saved", Icon: Bookmark, badge: 12 },
      { label: "Reminders", href: "/dashboard/reminders", Icon: Clock, badge: 2 },
    ],
  },
  {
    label: "Discover",
    items: [
      { label: "Scholarships", href: "/scholarships", Icon: GraduationCap },
      { label: "Internships", href: "/internships", Icon: Briefcase },
      { label: "Deadlines", href: "/dashboard/deadlines", Icon: CalendarDays },
    ],
  },
  {
    label: "Profile",
    items: [
      { label: "My Profile", href: "/dashboard/profile", Icon: User, meta: "85%" },
      { label: "My CV", href: "/dashboard/cv", Icon: FileText },
      { label: "Settings", href: "/dashboard/settings", Icon: Settings },
    ],
  },
];

export function StudentSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return <SidebarNav sections={SECTIONS} onNavigate={onNavigate} />;
}
