interface InternshipDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InternshipDetailPage({
  params,
}: InternshipDetailPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <p className="text-sm text-muted-foreground">
        Internship detail page coming soon.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        ID: <code className="rounded bg-muted px-1 py-0.5">{id}</code>
      </p>
    </div>
  );
}
