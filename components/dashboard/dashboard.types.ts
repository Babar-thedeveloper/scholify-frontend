// ─────────────────────────────────────────────────────────────
// Scholify- Dashboard / application-tracking domain types.
// Shared by student dashboard, org dashboard, navbar, mock data.
// ─────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "draft" // Started but not submitted
  | "submitted" // Sent to org
  | "under-review" // Org is reviewing
  | "shortlisted" // Made it to next round
  | "interview" // Interview scheduled (optional state)
  | "accepted" // Offer received
  | "not-selected" // Rejected
  | "withdrawn" // Student withdrew
  | "external-applied"; // Phase 1- student manually marked as applied externally

export type ApplicationType = "scholarship" | "internship";

export interface ApplicationTimelineEvent {
  timestamp: string;
  type: "status-change" | "note" | "submission" | "message";
  description: string;
  fromStatus?: ApplicationStatus;
  toStatus?: ApplicationStatus;
  actor: "student" | "organization" | "system";
}

export interface Application {
  id: string; // SCH-2026-000047
  type: ApplicationType;
  status: ApplicationStatus;
  isExternal: boolean; // Phase 1 vs Phase 2

  studentId: string;

  // Item applied to
  itemId: string;
  itemTitle: string;
  organizationName: string;
  organizationLogo?: string;

  // Context / display
  location?: string;
  fundingAmount?: string;
  externalUrl?: string;

  // Dates (ISO strings)
  appliedAt: string;
  deadlineAt?: string;
  lastStatusChangeAt: string;

  // Timeline
  timeline: ApplicationTimelineEvent[];

  // Org-side notes (visible to org only)
  internalNotes?: string;
}

export type PostingStatus = "active" | "draft" | "closed" | "paused";

export interface Posting {
  id: string;
  type: ApplicationType; // scholarship or internship
  status: PostingStatus;
  title: string;
  description: string;
  organizationId: string;
  organizationName: string;
  postedAt: string;
  deadlineAt?: string;
  applyMethod: "platform" | "external";
  externalUrl?: string;
  applicantCount: number;
  newApplicantCount: number;

  // Scholarship-specific
  fundingAmount?: string;
  degreeLevel?: string[];
  countryScope?: string;

  // Internship-specific
  workMode?: "remote" | "onsite" | "hybrid";
  city?: string;
  isPaid?: boolean;
  stipend?: string;
  duration?: string;
  startDate?: string;
}

export interface Applicant {
  id: string; // applicant record id
  applicationId: string; // ties to an Application id
  postingId: string;
  postingTitle: string;
  name: string;
  initials: string;
  email: string;
  university: string;
  degreeLevel: string;
  fieldOfStudy: string;
  gpa: string;
  city: string;
  skills?: string[];
  appliedAt: string;
  status: ApplicationStatus;
  coverLetter?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: "application-status" | "deadline-reminder" | "new-applicant" | "system";
  title: string;
  subtitle: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface SavedItem {
  id: string;
  type: ApplicationType;
  title: string;
  organizationName: string;
  organizationLogo?: string;
  location?: string;
  fundingAmount?: string;
  stipend?: string;
  deadlineAt?: string;
  reminderSet?: boolean;
}

export interface Reminder {
  id: string;
  itemTitle: string;
  remindAt: string; // ISO
  daysBefore: number;
  channel: "email" | "whatsapp" | "both";
}
