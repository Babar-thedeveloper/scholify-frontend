import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface Plan {
  name: string;
  price: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "PKR 0 / month",
    features: ["Up to 3 active postings", "Basic applicant tracking", "Email support"],
  },
  {
    name: "Growth",
    price: "Custom",
    features: ["Unlimited postings", "Team collaboration", "Applicant analytics", "Priority support"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Everything in Growth", "Talent search access", "SSO & advanced security", "Dedicated manager"],
  },
];

export default function BillingPage() {
  return (
    <div>
      <PageHeader title="Billing" subtitle="Manage your plan and payment details" />

      {/* Current plan */}
      <Card className="border-border gap-0 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-semibold text-foreground">Free- Beta</h3>
          <Badge variant="secondary">Current plan</Badge>
        </div>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          PKR 0 <span className="text-base font-normal text-muted-foreground">/ month</span>
        </p>
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
          All features are free during our beta. No card required.
        </p>
      </Card>

      {/* Plans coming soon */}
      <h3 className="mb-4 mt-8 font-semibold text-muted-foreground">Plans (coming soon)</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className="border-border gap-0 p-5 opacity-60"
          >
            <p className="font-semibold text-foreground">{plan.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{plan.price}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-5 w-full" variant="outline" disabled>
              Coming soon
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
