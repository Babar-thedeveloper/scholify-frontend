import { Suspense } from "react";
import { Briefcase } from "lucide-react";
import { ListingHero } from "@/components/shared/ListingHero";
import { InternshipsClient } from "@/components/internships/InternshipsClient";
import { InternshipGridSkeleton } from "@/components/internships/InternshipGridSkeleton";
import { listPostings, toInternship } from "@/lib/api/postings";
import type { Internship } from "@/components/internships/internships.types";

export const metadata = {
  title: "Internships | Scholify",
  description:
    "Every paid, unpaid, remote and onsite internship for Pakistani students - updated daily, completely free.",
  keywords: [
    "internships in Pakistan",
    "paid internships",
    "remote internships Pakistan",
    "internships for students",
    "software internships Pakistan",
    "summer internships",
    "student jobs Pakistan",
  ],
  alternates: { canonical: "/internships" },
};

// SSR-fresh- always pull the latest listings from the backend.
export const dynamic = "force-dynamic";

export default async function InternshipsPage() {
  let internships: Internship[] = [];
  let fetchError: string | null = null;

  try {
    // Pull a generous window; client-side filtering handles the rest for now.
    const res = await listPostings({ type: "internship", pageSize: 50 });
    internships = res.items.map(toInternship);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load internships";
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <ListingHero
        Icon={Briefcase}
        title="Internships across Pakistan"
        subtitle="Paid, unpaid, remote and onsite roles from local startups to global companies. Filter by field, city and stipend to find your fit."
      />

      {fetchError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-medium">Couldn&apos;t load internships</p>
          <p className="mt-1 text-destructive/80">
            The backend didn&apos;t respond. Please refresh in a moment.
          </p>
        </div>
      ) : (
        <Suspense fallback={<InternshipGridSkeleton />}>
          <InternshipsClient internships={internships} />
        </Suspense>
      )}
    </div>
  );
}
