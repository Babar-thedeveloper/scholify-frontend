export type WorkMode = 'remote' | 'onsite' | 'hybrid';
export type WorkType = 'internship' | 'part-time' | 'full-time';
export type InternshipField =
  | 'software-it'
  | 'marketing'
  | 'design'
  | 'finance'
  | 'sales'
  | 'engineering'
  | 'other';

export interface Internship {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyLogoUrl?: string;
  workMode: WorkMode;
  workType: WorkType;
  field: InternshipField;
  city: string | null;
  isPaid: boolean;
  stipend: string | null;
  duration: string;
  startDate: string | null;
  applyUrl: string;
  deadline: string | null;
  summary: string;
  postedAt: string;
}

export interface InternshipFilters {
  search: string;
  category: WorkMode | 'all';
  workType: WorkType | 'all';
  stipend: 'all' | 'paid' | 'unpaid';
  city: string;
  duration: 'all' | '1-3' | '3-6' | '6+';
  field: InternshipField | 'all';
  sort: 'most-recent' | 'highest-stipend' | 'closing-soon' | 'az';
  page: number;
}
