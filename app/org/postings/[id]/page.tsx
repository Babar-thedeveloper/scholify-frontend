"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Pause,
  Play,
  Trash2,
  Users,
  Settings,
  Calendar,
  AlertTriangle,
  FileQuestion,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PostingForm } from "@/components/org/PostingForm";
import { ApplicantTable } from "@/components/org/ApplicantTable";
import { MOCK_POSTINGS, MOCK_APPLICANTS } from "@/components/dashboard/dashboard.mock";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  closed: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  paused: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
} as const;

export default function PostingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  
  // Find matching posting from mock database
  const initialPosting = MOCK_POSTINGS.find((p) => p.id === params.id);
  const [posting, setPosting] = useState(initialPosting);
  
  // Find applicants for this posting
  const postingApplicants = MOCK_APPLICANTS.filter((a) => a.postingId === params.id);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!posting) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          Icon={FileQuestion}
          title="Posting not found"
          description="This job, internship, or scholarship posting does not exist or has been removed."
          actionLabel="Back to postings"
          actionHref="/org/postings"
        />
      </div>
    );
  }

  const handleUpdateDetails = async (updatedFields: any) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setPosting((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updatedFields,
      };
    });

    toast.success("Opportunity details updated successfully!");
    setIsSubmitting(false);
  };

  const handleTogglePause = () => {
    const isPaused = posting.status === "paused";
    const nextStatus = isPaused ? "active" : "paused";
    
    setPosting((prev) => {
      if (!prev) return prev;
      return { ...prev, status: nextStatus };
    });

    toast.success(isPaused ? "Posting is now active" : "Posting has been paused");
  };

  const handleDelete = () => {
    toast.success("Opportunity deleted successfully");
    router.push("/org/postings");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/org/postings"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to postings
      </Link>

      {/* Header */}
      <div className="mb-6 rounded-xl border border-border bg-white p-6 dark:bg-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-primary dark:bg-emerald-500/10">
                {posting.type === "scholarship" ? (
                  <GraduationCap className="size-3" />
                ) : (
                  <Briefcase className="size-3" />
                )}
                <span className="capitalize">{posting.type}</span>
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                  STATUS_STYLES[posting.status]
                )}
              >
                {posting.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">{posting.title}</h1>
            <p className="text-sm text-muted-foreground">
              {posting.organizationName}
              {posting.deadlineAt && (
                <> · Closes: {new Date(posting.deadlineAt).toLocaleDateString("en-US", { dateStyle: "medium" })}</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTogglePause}
              className="h-9"
              disabled={posting.status === "closed" || posting.status === "draft"}
            >
              {posting.status === "paused" ? (
                <>
                  <Play className="size-3.5 mr-1.5 text-emerald-600" /> Resume Posting
                </>
              ) : (
                <>
                  <Pause className="size-3.5 mr-1.5 text-amber-600" /> Pause Posting
                </>
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="h-9">
                  <Trash2 className="size-3.5 mr-1.5" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this opportunity?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the posting &ldquo;{posting.title}&rdquo; and all associated candidate data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="applicants" className="space-y-6">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="applicants" className="gap-2">
            <Users className="size-4" />
            Applicants
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-foreground dark:bg-slate-800">
              {postingApplicants.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="edit" className="gap-2">
            <Settings className="size-4" />
            Edit details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applicants" className="space-y-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-foreground">Candidate Applications</h2>
            <p className="text-xs text-muted-foreground">
              Review and screen student applicants who applied natively via the Scholify platform.
            </p>
          </div>

          <ApplicantTable applicants={postingApplicants} />
        </TabsContent>

        <TabsContent value="edit" className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-foreground">Edit Details</h2>
              <p className="text-xs text-muted-foreground">
                Update the metadata, description, deadlines, or requirements for this posting.
              </p>
            </div>
            <PostingForm
              type={posting.type}
              initialData={posting}
              onSubmit={handleUpdateDetails}
              isSubmitting={isSubmitting}
              submitLabel="Save Changes"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
