import { Sparkles, FileText, Zap, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = {
  title: "AI CV Builder | Scholify",
  description:
    "Build a professional CV powered by AI. Add your profile details and let our AI generate, optimize, and tailor your CV for any opportunity.",
};

export default function AiCvPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="size-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Your AI-Powered CV.
          <br />
          <span className="text-primary">Built in minutes, not hours.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500 dark:text-gray-400">
          Add your education, experience, and skills once. Our AI generates a
          professional, ATS-friendly CV tailored for scholarships, internships,
          and jobs — formatted perfectly every time.
        </p>
      </div>

      {/* Features */}
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        <FeatureCard
          icon={<FileText className="size-5 text-primary" />}
          title="One profile, infinite CVs"
          description="Fill your details once. Generate tailored CVs for any opportunity with a single click."
        />
        <FeatureCard
          icon={<Zap className="size-5 text-primary" />}
          title="AI-optimized content"
          description="Our AI rewrites your experience bullets, suggests keywords, and matches job requirements."
        />
        <FeatureCard
          icon={<Target className="size-5 text-primary" />}
          title="ATS-friendly formats"
          description="Clean, professional templates that pass automated screening systems used by top companies."
        />
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl bg-muted/30 p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <Badge size="md" className="gap-2 rounded-full border-transparent bg-primary/10 text-[12px] font-semibold text-primary">
          <Sparkles className="size-3.5" />
          Coming Soon
        </Badge>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          We&apos;re building something incredible.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-gray-500 dark:text-gray-400">
          Be the first to know when AI CV Builder launches. Sign up and
          we&apos;ll notify you the moment it&apos;s ready.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/signup">
              Join the waitlist
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/scholarships">Browse scholarships</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10">
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
