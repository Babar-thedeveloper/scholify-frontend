"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/PageHeader";
import type { ApplicationType } from "@/components/dashboard/dashboard.types";
import { createPosting, type CreatePostingInput } from "@/lib/api/postings";
import { getMyOrg } from "@/lib/api/organizations";
import { handleApiError } from "@/lib/api/handle-error";

const DEGREE_LEVELS = ["Undergraduate", "Masters", "PhD"];
const FIELDS = ["Engineering", "Computer Science", "Business", "Medicine", "Arts"];

type ApplyMethod = "platform" | "external";

interface FormState {
  title: string;
  description: string;
  // scholarship
  eligibility: string;
  fundingAmount: string;
  degreeLevel: string[];
  fieldOfStudy: string[];
  countryScope: string;
  specificCountry: string;
  deadline: string;
  // internship
  skills: string[];
  field: string;
  workMode: string;
  city: string;
  duration: string;
  isPaid: boolean;
  stipend: string;
  startDate: string;
  // shared
  applyMethod: ApplyMethod;
  externalUrl: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  eligibility: "",
  fundingAmount: "",
  degreeLevel: [],
  fieldOfStudy: [],
  countryScope: "",
  specificCountry: "",
  deadline: "",
  skills: [],
  field: "",
  workMode: "",
  city: "",
  duration: "",
  isPaid: true,
  stipend: "",
  startDate: "",
  applyMethod: "platform",
  externalUrl: "",
};

const textareaClass = "min-h-24";

export default function NewPostingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<ApplicationType | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // scholarship_provider / internship_provider orgs are locked to their type
  const [lockedType, setLockedType] = useState<ApplicationType | null>(null);

  useEffect(() => {
    getMyOrg()
      .then((org) => {
        const locked: ApplicationType | null =
          org.kind === "scholarship_provider" ? "scholarship"
          : org.kind === "internship_provider" ? "internship"
          : null;
        if (locked) {
          setLockedType(locked);
          // Skip step 1 entirely- the choice is already made
          setType(locked);
          setStep((s) => (s === 1 ? 2 : s));
        }
      })
      .catch(() => { /* fall back to free choice; backend still enforces */ });
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleInArray = (key: "degreeLevel" | "fieldOfStudy", value: string) =>
    setForm((f) => {
      const arr = f[key];
      return {
        ...f,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (!form.skills.includes(v)) set("skills", [...form.skills, v]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) =>
    set("skills", form.skills.filter((s) => s !== skill));

  const selectType = (t: ApplicationType) => {
    setType(t);
    setStep(2);
  };

  const validateDetails = (): boolean => {
    if (!form.title.trim()) {
      toast.error("Please enter a title");
      return false;
    }
    if (!form.description.trim()) {
      toast.error("Please enter a description");
      return false;
    }
    if (!form.deadline && type === "scholarship") {
      toast.error("Please set a deadline");
      return false;
    }
    if (form.applyMethod === "external" && !form.externalUrl.trim()) {
      toast.error("Please enter an external application URL");
      return false;
    }
    return true;
  };

  const goReview = () => {
    if (validateDetails()) setStep(3);
  };

  /** Build the discriminated-union payload the backend expects. */
  function buildPayload(publish: boolean): CreatePostingInput | null {
    if (!type) return null;

    const base = {
      title: form.title.trim(),
      description: form.description.trim(),
      eligibilityCriteria: form.eligibility.trim() || undefined,
      deadlineAt: form.deadline ? new Date(form.deadline).toISOString() : undefined,
      applyMethod: form.applyMethod,
      externalUrl: form.applyMethod === "external" ? form.externalUrl.trim() : undefined,
      publish,
    };

    if (type === "scholarship") {
      // Map display labels ("Undergraduate", "Masters", "PhD") to backend keys
      const degreeKeyMap: Record<string, string> = {
        "Undergraduate": "undergraduate",
        "Masters": "masters",
        "PhD": "phd",
      };
      return {
        ...base,
        type: "scholarship",
        fundingAmount: form.fundingAmount.trim() || undefined,
        countryScope: (form.countryScope as "pakistan" | "international" | "specific") || undefined,
        specificCountry: form.countryScope === "specific" ? form.specificCountry.trim() || undefined : undefined,
        degreeLevelKeys: form.degreeLevel.length
          ? form.degreeLevel.map((l) => degreeKeyMap[l] ?? l.toLowerCase())
          : undefined,
        fieldOfStudyNames: form.fieldOfStudy.length ? form.fieldOfStudy : undefined,
      };
    }

    // Internship- extract the numeric month count from a free-text field like "3 months".
    const durationMonths = form.duration ? parseInt(form.duration.replace(/[^\d]/g, ""), 10) : NaN;
    return {
      ...base,
      type: "internship",
      workMode: (form.workMode as "remote" | "onsite" | "hybrid") || "onsite",
      city: form.city.trim() || undefined,
      isPaid: form.isPaid,
      stipendAmount: form.isPaid && form.stipend ? Number(form.stipend) : undefined,
      stipendCurrency: "PKR",
      durationMonths: Number.isFinite(durationMonths) && durationMonths > 0 ? durationMonths : undefined,
      startDate: form.startDate || undefined,
      skillNames: form.skills.length ? form.skills : undefined,
      fieldOfStudyNames: form.field ? [form.field] : undefined,
    };
  }

  async function submit(publish: boolean) {
    const payload = buildPayload(publish);
    if (!payload) return;
    if (!validateDetails()) return;

    setSubmitting(true);
    try {
      const { message } = await createPosting(payload);
      toast.success(message);
      router.push("/org/postings");
    } catch (err) {
      handleApiError(err, "Couldn't save posting. Please try again.");
      setSubmitting(false);
    }
  }

  const saveDraft = () => void submit(false);
  const publish = () => void submit(true);

  const steps = [
    { n: 1, label: "Type" },
    { n: 2, label: "Details" },
    { n: 3, label: "Review" },
  ] as const;

  return (
    <div>
      <PageHeader
        title="Create a posting"
        subtitle="Publish a scholarship or internship on Scholify"
      />

      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((s, i) => {
          const done = step > s.n;
          const current = step === s.n;
          return (
            <div key={s.n} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    done || current
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {done ? <Check className="size-4" /> : s.n}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    current || done ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && <div className="h-px w-10 bg-border" />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Type */}
      {step === 1 && (
        <div>
          <h2 className="mb-4 text-center text-lg font-semibold text-foreground">
            What are you posting?
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card
              asChild
              className="items-center gap-0 border-2 border-border p-8 text-center transition-all hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <button type="button" onClick={() => selectType("scholarship")}>
                <span className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-primary dark:bg-emerald-500/10">
                  <GraduationCap className="size-7" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Scholarship</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Academic grants, fellowships, or financial aid for students.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Continue <ArrowRight className="size-4" />
                </span>
              </button>
            </Card>

            <Card
              asChild
              className="items-center gap-0 border-2 border-border p-8 text-center transition-all hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <button type="button" onClick={() => selectType("internship")}>
                <span className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-primary dark:bg-emerald-500/10">
                  <Briefcase className="size-7" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Internship</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Software, design, marketing, finance, or operations roles.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Continue <ArrowRight className="size-4" />
                </span>
              </button>
            </Card>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && type && (
        <Card className="border-border gap-0 p-5">
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder={
                  type === "scholarship"
                    ? "e.g. Merit Scholarship 2026"
                    : "e.g. Software Engineering Intern"
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className={textareaClass}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the opportunity, responsibilities and what you offer."
              />
            </div>

            {type === "scholarship" ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="eligibility">Eligibility criteria</Label>
                  <Textarea
                    id="eligibility"
                    className={textareaClass}
                    value={form.eligibility}
                    onChange={(e) => set("eligibility", e.target.value)}
                    placeholder="Who can apply? Academic, financial or other requirements."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="funding">Funding amount</Label>
                  <Input
                    id="funding"
                    value={form.fundingAmount}
                    onChange={(e) => set("fundingAmount", e.target.value)}
                    placeholder="e.g. Fully funded or PKR 200,000 / year"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Degree level</Label>
                  <div className="flex flex-wrap gap-4">
                    {DEGREE_LEVELS.map((lvl) => (
                      <Label
                        key={lvl}
                        className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                      >
                        <Checkbox
                          checked={form.degreeLevel.includes(lvl)}
                          onCheckedChange={() => toggleInArray("degreeLevel", lvl)}
                        />
                        {lvl}
                      </Label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Field of study</Label>
                  <div className="flex flex-wrap gap-4">
                    {FIELDS.map((field) => (
                      <Label
                        key={field}
                        className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                      >
                        <Checkbox
                          checked={form.fieldOfStudy.includes(field)}
                          onCheckedChange={() => toggleInArray("fieldOfStudy", field)}
                        />
                        {field}
                      </Label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Country scope</Label>
                  <Select
                    value={form.countryScope}
                    onValueChange={(v) => set("countryScope", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pakistan">Pakistan</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                      <SelectItem value="specific">Specific country</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {form.countryScope === "specific" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="specificCountry">Specific country</Label>
                    <Input
                      id="specificCountry"
                      value={form.specificCountry}
                      onChange={(e) => set("specificCountry", e.target.value)}
                      placeholder="e.g. Turkey, Germany"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={(e) => set("deadline", e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="skill">Required skills</Label>
                  <div className="flex gap-2">
                    <Input
                      id="skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="e.g. React, then press Enter"
                    />
                    <Button type="button" variant="outline" onClick={addSkill}>
                      Add
                    </Button>
                  </div>
                  {form.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.skills.map((skill) => (
                        <Tag
                          key={skill}
                          variant="primary"
                          onRemove={() => removeSkill(skill)}
                          removeLabel={`Remove ${skill}`}
                        >
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Field</Label>
                  <Select value={form.field} onValueChange={(v) => set("field", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELDS.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Work mode</Label>
                  <Select
                    value={form.workMode}
                    onValueChange={(v) => set("workMode", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select work mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(form.workMode === "onsite" || form.workMode === "hybrid") && (
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      placeholder="e.g. Karachi"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                    placeholder="e.g. 3 months"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stipend</Label>
                  <RadioGroup
                    value={form.isPaid ? "paid" : "unpaid"}
                    onValueChange={(v) => set("isPaid", v === "paid")}
                    className="flex flex-wrap gap-4"
                  >
                    <Label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                      <RadioGroupItem value="paid" id="stipend-paid" />
                      Paid
                    </Label>
                    <Label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                      <RadioGroupItem value="unpaid" id="stipend-unpaid" />
                      Unpaid
                    </Label>
                  </RadioGroup>
                  {form.isPaid && (
                    <Input
                      type="number"
                      min="0"
                      value={form.stipend}
                      onChange={(e) => set("stipend", e.target.value)}
                      placeholder="e.g. 45000"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="startDate">Start date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => set("startDate", e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Apply method (shared) */}
            <div className="space-y-2">
              <Label>Apply method</Label>
              <RadioGroup
                value={form.applyMethod}
                onValueChange={(v) => set("applyMethod", v as "platform" | "external")}
                className="flex flex-wrap gap-4"
              >
                <Label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                  <RadioGroupItem value="platform" id="apply-platform" />
                  Apply on Scholify
                </Label>
                <Label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                  <RadioGroupItem value="external" id="apply-external" />
                  Apply externally
                </Label>
              </RadioGroup>
              {form.applyMethod === "external" && (
                <Input
                  value={form.externalUrl}
                  onChange={(e) => set("externalUrl", e.target.value)}
                  placeholder="https://careers.example.com/apply"
                />
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            {lockedType ? (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="size-3.5" />
                Your organization posts {lockedType}s only
              </span>
            ) : (
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="size-4" /> Back
              </Button>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={saveDraft} disabled={submitting}>
                Save as draft
              </Button>
              <Button onClick={goReview} disabled={submitting}>
                Next <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 3: Review */}
      {step === 3 && type && (
        <div>
          <Card className="border-border gap-0 p-5">
            <div className="mb-4 border-b border-border pb-4">
              <Badge variant="secondary" className="gap-1 rounded-full border-transparent bg-emerald-50 px-2.5 font-semibold capitalize text-primary dark:bg-emerald-500/10">
                {type === "scholarship" ? (
                  <GraduationCap className="size-3" />
                ) : (
                  <Briefcase className="size-3" />
                )}
                {type}
              </Badge>
              <h2 className="mt-2 text-xl font-semibold text-foreground">
                {form.title || "Untitled posting"}
              </h2>
            </div>

            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <ReviewItem label="Description" value={form.description} full />

              {type === "scholarship" ? (
                <>
                  <ReviewItem label="Eligibility" value={form.eligibility} full />
                  <ReviewItem label="Funding amount" value={form.fundingAmount} />
                  <ReviewItem label="Country scope" value={form.countryScope} />
                  {form.countryScope === "specific" && (
                    <ReviewItem label="Specific country" value={form.specificCountry} />
                  )}
                  <ReviewItem
                    label="Degree level"
                    value={form.degreeLevel.join(", ")}
                  />
                  <ReviewItem
                    label="Field of study"
                    value={form.fieldOfStudy.join(", ")}
                  />
                  <ReviewItem label="Deadline" value={form.deadline} />
                </>
              ) : (
                <>
                  <ReviewItem label="Required skills" value={form.skills.join(", ")} full />
                  <ReviewItem label="Field" value={form.field} />
                  <ReviewItem label="Work mode" value={form.workMode} />
                  {(form.workMode === "onsite" || form.workMode === "hybrid") && (
                    <ReviewItem label="City" value={form.city} />
                  )}
                  <ReviewItem label="Duration" value={form.duration} />
                  <ReviewItem
                    label="Stipend"
                    value={form.isPaid ? (form.stipend ? `PKR ${form.stipend}/month` : "Paid") : "Unpaid"}
                  />
                  <ReviewItem label="Start date" value={form.startDate} />
                </>
              )}

              <ReviewItem
                label="Apply method"
                value={
                  form.applyMethod === "platform"
                    ? "Apply on Scholify"
                    : `Apply externally- ${form.externalUrl}`
                }
                full
              />
            </dl>
          </Card>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <Button variant="ghost" onClick={() => setStep(2)}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => toast.success("Opening preview…")}
                disabled={submitting}
              >
                Preview
              </Button>
              <Button variant="outline" onClick={saveDraft} disabled={submitting}>
                Save as draft
              </Button>
              <Button onClick={publish} disabled={submitting}>
                {submitting ? "Publishing…" : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewItem({
  label,
  value,
  full,
}: {
  label: string;
  value?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 whitespace-pre-wrap text-foreground">
        {value?.trim() ? value : <span className="text-muted-foreground">-</span>}
      </dd>
    </div>
  );
}
