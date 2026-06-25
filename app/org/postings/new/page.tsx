"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PostingForm } from "@/components/org/PostingForm";
import type { Posting, ApplicationType } from "@/components/dashboard/dashboard.types";
import { cn } from "@/lib/utils";

type Step = "type" | "details" | "review";

export default function NewPostingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("type");
  const [type, setType] = useState<ApplicationType>("internship");
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectType = (selectedType: ApplicationType) => {
    setType(selectedType);
    setStep("details");
  };

  const handleDetailsSubmit = (data: any) => {
    setFormData(data);
    setStep("review");
  };

  const handleBack = () => {
    if (step === "review") {
      setStep("details");
    } else if (step === "details") {
      setStep("type");
    }
  };

  const handleSave = async (status: "active" | "draft") => {
    setIsSaving(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    // In a real app we'd POST to API, here we just show success toast
    toast.success(
      status === "active"
        ? "Posting published successfully!"
        : "Posting saved as draft"
    );
    setIsSaving(false);
    router.push("/org/postings");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
        <PageHeader
          title="Create a New Posting"
          subtitle="Publish a scholarship or internship opportunity on Scholify"
        />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/org/postings">
            Cancel
          </Link>
        </Button>
      </div>

      {/* Stepper indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
              step === "type"
                ? "bg-primary text-primary-foreground"
                : "bg-emerald-100 text-primary dark:bg-emerald-500/20 dark:text-emerald-400"
            )}
          >
            {step !== "type" ? <CheckCircle2 className="size-5" /> : "1"}
          </div>
          <span className="text-sm font-medium">Type</span>
        </div>
        <div className="h-px w-12 bg-border" />
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
              step === "details"
                ? "bg-primary text-primary-foreground"
                : step === "review"
                ? "bg-emerald-100 text-primary dark:bg-emerald-500/20 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {step === "review" ? <CheckCircle2 className="size-5" /> : "2"}
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              step === "type" ? "text-muted-foreground" : "text-foreground"
            )}
          >
            Details
          </span>
        </div>
        <div className="h-px w-12 bg-border" />
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
              step === "review"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            "3"
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              step !== "review" ? "text-muted-foreground" : "text-foreground"
            )}
          >
            Review
          </span>
        </div>
      </div>

      {/* Step 1: Select Type */}
      {step === "type" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => handleSelectType("internship")}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-border bg-white p-8 text-center transition-all hover:border-primary hover:shadow-md dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-primary dark:bg-emerald-500/10">
              <Briefcase className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Internship</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Advertise software, design, marketing, finance, or operations internship roles.
            </p>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-primary">
              Continue <ArrowRight className="size-4" />
            </div>
          </button>

          <button
            onClick={() => handleSelectType("scholarship")}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-border bg-white p-8 text-center transition-all hover:border-primary hover:shadow-md dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-primary dark:bg-emerald-500/10">
              <GraduationCap className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Scholarship</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Offer academic grants, fellowships, financial aid, or research sponsorships.
            </p>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-primary">
              Continue <ArrowRight className="size-4" />
            </div>
          </button>
        </div>
      )}

      {/* Step 2: Form Details */}
      {step === "details" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-0 hover:bg-transparent">
              <ArrowLeft className="size-4 mr-1" /> Choose a different type
            </Button>
          </div>
          <PostingForm
            type={type}
            initialData={formData}
            onSubmit={handleDetailsSubmit}
            onCancel={handleBack}
            submitLabel="Review Details"
          />
        </div>
      )}

      {/* Step 3: Review Details */}
      {step === "review" && formData && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-0 hover:bg-transparent">
              <ArrowLeft className="size-4 mr-1" /> Edit details
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card">
            <div className="border-b border-border pb-4 mb-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-primary dark:bg-emerald-500/10">
                {type === "scholarship" ? (
                  <GraduationCap className="size-3" />
                ) : (
                  <Briefcase className="size-3" />
                )}
                <span className="capitalize">{type}</span>
              </span>
              <h2 className="text-xl font-bold mt-2 text-foreground">{formData.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">Daraz Pakistan</p>
            </div>

            <div className="space-y-6">
              {/* Core Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm border-b border-border pb-4">
                {type === "internship" ? (
                  <>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4 shrink-0 text-primary" />
                      <span>
                        {formData.workMode === "remote" ? "Remote" : `${formData.workMode} · ${formData.city}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="size-4 shrink-0 text-primary" />
                      <span>{formData.isPaid ? formData.stipend : "Unpaid"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="size-4 shrink-0 text-primary" />
                      <span>{formData.duration}</span>
                    </div>
                    {formData.startDate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="size-4 shrink-0 text-primary" />
                        <span>Starts: {formData.startDate}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="size-4 shrink-0 text-primary" />
                      <span>{formData.fundingAmount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4 shrink-0 text-primary" />
                      <span>Scope: {formData.countryScope}</span>
                    </div>
                    {formData.degreeLevel && formData.degreeLevel.length > 0 && (
                      <div className="col-span-2 flex items-start gap-2 text-muted-foreground">
                        <FileText className="size-4 shrink-0 mt-0.5 text-primary" />
                        <span>Degrees: {formData.degreeLevel.join(", ")}</span>
                      </div>
                    )}
                  </>
                )}

                <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4 shrink-0 text-primary" />
                  <span>
                    Deadline:{" "}
                    {formData.deadlineAt
                      ? new Date(formData.deadlineAt).toLocaleDateString("en-US", {
                          dateStyle: "medium",
                        })
                      : "No deadline"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-foreground mb-2 text-sm">Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {formData.description}
                </p>
              </div>

              {/* Apply Info */}
              <div className="rounded-lg bg-slate-50 p-4 text-xs text-muted-foreground border border-border dark:bg-slate-900/50">
                <span className="font-semibold text-foreground">Application Flow:</span>{" "}
                {formData.applyMethod === "platform" ? (
                  "Students will apply directly through Scholify using their profiles and uploaded CVs. You will manage applicants from your dashboard."
                ) : (
                  <>
                    Students will be redirected to apply externally at:{" "}
                    <a
                      href={formData.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-semibold break-all"
                    >
                      {formData.externalUrl}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              disabled={isSaving}
              onClick={() => handleSave("draft")}
              className="h-10 border-border text-foreground hover:bg-muted"
            >
              Save as Draft
            </Button>
            <Button
              disabled={isSaving}
              onClick={() => handleSave("active")}
              className="h-10 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving ? "Publishing..." : "Publish Opportunity"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
