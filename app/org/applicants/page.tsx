"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, RotateCcw, ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplicantTable } from "@/components/org/ApplicantTable";
import { MOCK_APPLICANTS, MOCK_POSTINGS } from "@/components/dashboard/dashboard.mock";
import type { ApplicationStatus } from "@/components/dashboard/dashboard.types";

const STATUSES: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "submitted", label: "Submitted" },
  { value: "under-review", label: "Under Review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interviewing" },
  { value: "accepted", label: "Accepted" },
  { value: "not-selected", label: "Not Selected" },
];

export default function AllApplicantsPage() {
  const [search, setSearch] = useState("");
  const [postingFilter, setPostingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [uniFilter, setUniFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Extract unique universities for filtering options
  const uniqueUniversities = Array.from(
    new Set(MOCK_APPLICANTS.map((a) => a.university))
  ).sort();

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setPostingFilter("all");
    setStatusFilter("all");
    setUniFilter("all");
    setSortBy("date-desc");
  };

  const hasActiveFilters =
    search !== "" ||
    postingFilter !== "all" ||
    statusFilter !== "all" ||
    uniFilter !== "all" ||
    sortBy !== "date-desc";

  // Filter applicants
  const filtered = MOCK_APPLICANTS.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.postingTitle.toLowerCase().includes(search.toLowerCase()) ||
      (a.skills && a.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())));

    const matchesPosting = postingFilter === "all" || a.postingId === postingFilter;
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesUni = uniFilter === "all" || a.university === uniFilter;

    return matchesSearch && matchesPosting && matchesStatus && matchesUni;
  });

  // Sort applicants
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
    }
    if (sortBy === "date-asc") {
      return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
    }
    if (sortBy === "gpa-desc") {
      return parseFloat(b.gpa) - parseFloat(a.gpa);
    }
    if (sortBy === "gpa-asc") {
      return parseFloat(a.gpa) - parseFloat(b.gpa);
    }
    return 0;
  });

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="All Applicants"
        subtitle="Manage and evaluate candidate applications across all postings"
      />

      {/* Filter and Search Bar */}
      <div className="mb-6 space-y-3 rounded-xl border border-border bg-white p-4 dark:bg-card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              placeholder="Search applicants by name, email, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9 pr-4 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={cn(
                "h-10 text-xs font-semibold",
                showAdvancedFilters && "border-primary bg-primary/5 text-primary"
              )}
            >
              <SlidersHorizontal className="size-3.5 mr-1.5" /> Filters
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10 w-[160px] text-xs">
                <div className="flex items-center gap-1">
                  <ArrowUpDown className="size-3 text-muted-foreground" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest Applied</SelectItem>
                <SelectItem value="date-asc">Oldest Applied</SelectItem>
                <SelectItem value="gpa-desc">Highest GPA</SelectItem>
                <SelectItem value="gpa-asc">Lowest GPA</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-10 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3.5 mr-1.5" /> Reset
              </Button>
            )}
          </div>
        </div>

        {/* Expandable Advanced Filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 gap-3 pt-3 border-t border-border sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                By Posting
              </label>
              <Select value={postingFilter} onValueChange={setPostingFilter}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select posting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Postings</SelectItem>
                  {MOCK_POSTINGS.filter((p) => p.status === "active").map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                By Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                By University
              </label>
              <Select value={uniFilter} onValueChange={setUniFilter}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {uniqueUniversities.map((uni) => (
                    <SelectItem key={uni} value={uni}>
                      {uni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Main Results Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{sorted.length}</span> candidates
          </p>
        </div>

        <ApplicantTable applicants={sorted} showPosting={true} />
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
