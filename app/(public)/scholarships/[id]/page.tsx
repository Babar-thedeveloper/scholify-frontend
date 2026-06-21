interface ScholarshipDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ScholarshipDetailPage({
  params,
}: ScholarshipDetailPageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground">
        Scholarship Detail
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Scholarship ID: <code className="rounded bg-muted px-1 py-0.5">{id}</code>
      </p>
    </div>
  );
}
