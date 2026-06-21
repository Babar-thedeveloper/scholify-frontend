export type ScholarshipCategory = 'national' | 'international' | 'provincial';
export type DegreeLevel = 'undergraduate' | 'masters' | 'phd' | 'any';
export type FundingType = 'fully-funded' | 'partial' | 'need-based' | 'merit-based';

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  category: ScholarshipCategory;
  level: DegreeLevel;
  fundingType: FundingType;
  destination: string;
  deadline: string | null;
  applyUrl: string;
  summary: string;
  postedAt: string;
  isFullyFunded: boolean;
}

export interface ScholarshipFilters {
  search: string;
  category: ScholarshipCategory | 'all';
  level: DegreeLevel | 'all';
  fundingType: FundingType | 'all';
  destination: string;
  deadlineRange: 'any' | 'this-week' | 'this-month' | 'next-3-months' | 'open';
  sort: 'deadline-asc' | 'recently-added' | 'fully-funded-first' | 'az';
  page: number;
}
