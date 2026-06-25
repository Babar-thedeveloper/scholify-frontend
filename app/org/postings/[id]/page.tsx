"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileQuestion, Pause, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ApplicantTable } from "@/components/org/ApplicantTable";
import { MOCK_APPLICANTS, MOCK_POSTINGS } from "@/components/dashboard/dashboard.mock";

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  closed: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  paused: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
} as const;

const textareaClass =
  "min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-xs placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export default function PostingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const posting = MOCK_POSTINGS.find((p) => p.id === id);
  const applicants = MOCK_APPLICANTS.filter((a) => a.postingId === id);

  // Editable form state, prefilled from the posting (hooks must run unconditionally).
  const [title, setTitle] = useState(posting?.title ?? "");
  const [description, setDescription] = useState(posting?.description ?? "");
  const [deadline, setDeadline] = useState(posting?.deadlineAt?.slice(0, 10) ?? "");
  const [applyMethod, setApplyMethod] = useState<string>(
    posting?.applyMethod ?? "platform"
  );
  const [externalUrl, setExternalUrl] = useState(posting?.externalUrl ?? "");

  if (!posting) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          Icon={FileQuestion}
          title="Posting not found"
          description="This posting does not exist or has been removed."
          actionLabel="Back to postings"
          actionHref="/org/postings"
        />
      </div>
    );
  }

  const handleSave = () => {
    // TODO: API — persist posting changes
    toast.success("Changes saved");
  };

  const handlePause = () => {
    // TODO: API — pause posting
    toast.success("Posting paused");
  };

  const handleDelete = () => {
    // TODO: API — delete posting
    toast.success("Posting deleted");
    router.push("/org/postings");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/org/postings"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to postings
      </Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {posting.title}
            </h1>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                STATUS_STYLES[posting.status]
              )}
            >
              {posting.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {posting.applicantCount} applicant{posting.applicantCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Posting details</TabsTrigger>
          <TabsTrigger value="applicants">Applicants ({applicants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="rounded-xl border border-border bg-white p-5 dark:bg-card">
            <h2 className="mb-4 font-semibold text-foreground">Edit posting</h2>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className={textareaClass}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Apply method</Label>
                <Select value={applyMethod} onValueChange={setApplyMethod}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select apply method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platform">Apply on Scholify</SelectItem>
                    <SelectItem value="external">Apply externally</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {applyMethod === "external" && (
                <div className="space-y-1.5">
                  <Label htmlFor="externalUrl">External URL</Label>
                  <Input
                    id="externalUrl"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://careers.example.com/apply"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button onClick={handleSave}>Save changes</Button>
              <Button variant="outline" onClick={handlePause}>
                <Pause className="size-4" /> Pause posting
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="sm:ml-auto">
                    <Trash2 className="size-4" /> Delete posting
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this posting?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete &ldquo;{posting.title}&rdquo; and its
                      applicant data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="applicants">
          <ApplicantTable applicants={applicants} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
