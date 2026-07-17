import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";

const TEASERS = [
  "Search students by skill, university, degree level and field of study",
  "Filter by location, GPA and availability",
  "Save promising candidates and reach out directly",
  "Invite top matches to apply to your postings",
];

export default function SearchStudentsPage() {
  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            Search students
            <Badge variant="secondary">Phase 3</Badge>
          </span>
        }
        subtitle="Discover and reach out to promising candidates"
      />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          disabled
          placeholder="Search by skill, university, field…"
          className="pl-9"
        />
      </div>

      <EmptyState
        Icon={Search}
        title="Talent search is coming soon"
        description="Soon you'll be able to proactively discover students who match your roles and invite them to apply."
      />

      <Card className="mt-6 border-border gap-0 p-5">
        <p className="mb-3 text-sm font-medium text-foreground">What's coming</p>
        <ul className="space-y-2">
          {TEASERS.map((t) => (
            <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
