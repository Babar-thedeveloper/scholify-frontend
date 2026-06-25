import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default function SavedCandidatesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            Saved candidates
            <Badge variant="secondary">Phase 3</Badge>
          </span>
        }
        subtitle="Keep track of students you want to revisit"
      />

      <EmptyState
        Icon={Star}
        title="No saved candidates yet"
        description="Save promising students to revisit them here once talent search launches."
      />
    </div>
  );
}
