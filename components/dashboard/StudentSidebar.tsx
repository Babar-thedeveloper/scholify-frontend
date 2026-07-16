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
import { useSidebarCounts } from "./useSidebarCounts";

function useSections(): SidebarSection[] {
  const { counts } = useSidebarCounts();
  const student = counts.student;

  return [
    {
      label: "Main",
      items: [
        { label: "Overview", href: "/dashboard", Icon: LayoutDashboard, exact: true },
        { label: "My Applications", href: "/dashboard/applications", Icon: ListChecks, badge: student?.applications || undefined },
        { label: "Saved Items", href: "/dashboard/saved", Icon: Bookmark, badge: student?.saved || undefined },
        { label: "Reminders", href: "/dashboard/reminders", Icon: Clock, badge: student?.reminders || undefined },
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
        { label: "My Profile", href: "/dashboard/profile", Icon: User, meta: student?.completionPercent ? `${student.completionPercent}%` : undefined },
        { label: "My CV", href: "/dashboard/cv", Icon: FileText },
        { label: "Settings", href: "/dashboard/settings", Icon: Settings },
      ],
    },
  ];
}

export function StudentSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const sections = useSections();
  return <SidebarNav sections={sections} onNavigate={onNavigate} />;
}
