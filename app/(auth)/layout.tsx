import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-emerald-50/50 px-4 py-8 dark:bg-background">
      {/* Soft ambient blobs for depth (theme-tinted) */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/5" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-500/5" />

      {/* Back link */}
      <div className="absolute left-5 top-5 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to Scholify.pk
        </Link>
      </div>

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
