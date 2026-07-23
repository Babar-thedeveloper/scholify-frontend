import { Suspense } from "react";
import { GraduationCap } from "lucide-react";
import { ListingHero } from "@/components/shared/ListingHero";
import { ScholarshipsClient } from "@/components/scholarships/ScholarshipsClient";
import { ScholarshipGridSkeleton } from "@/components/scholarships/ScholarshipGridSkeleton";
import { listPostings, toScholarship } from "@/lib/api/postings";
import type { Scholarship } from "@/components/scholarships/scholarships.types";

export const metadata = {
  title: "Scholarships | Scholify",
  description: "Discover national, international, and provincial scholarships for Pakistani students.",
  keywords: [
    "scholarships in Pakistan",
    "fully funded scholarships",
    "international scholarships for Pakistani students",
    "undergraduate scholarships",
    "masters scholarships",
    "PhD scholarships",
    "HEC scholarships",
    "study abroad scholarships",
  ],
  alternates: { canonical: "/scholarships" },
};

// SSR-fresh- always pull the latest listings from the backend.
export const dynamic = "force-dynamic";

export default async function ScholarshipsPage() {
  let scholarships: Scholarship[] = [];
  let fetchError: string | null = null;

  try {
    const res = await listPostings({ type: "scholarship", pageSize: 50 });
    scholarships = res.items.map(toScholarship);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load scholarships";
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <ListingHero
        Icon={GraduationCap}
        title="Scholarships for Pakistani students"
        subtitle="National, international and provincial scholarships in one place. Filter by degree level, funding type and destination to find the ones you qualify for."
      />

      {fetchError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-medium">Couldn&apos;t load scholarships</p>
          <p className="mt-1 text-destructive/80">
            The backend didn&apos;t respond. Please refresh in a moment.
          </p>
        </div>
      ) : (
        <Suspense fallback={<ScholarshipGridSkeleton />}>
          <ScholarshipsClient scholarships={scholarships} />
        </Suspense>
      )}
    </div>
  );
}
