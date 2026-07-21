"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createPlatformPosting, type CreatePlatformPostingInput } from "@/lib/api/admin";

type PostingType = "scholarship" | "internship";
type WorkMode = "remote" | "onsite" | "hybrid";

export default function AdminCreatePostingPage() {
  const router = useRouter();
  const [type, setType] = useState<PostingType>("internship");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [deadline, setDeadline] = useState("");
  const [applyMethod, setApplyMethod] = useState<"platform" | "external">("external");
  const [externalUrl, setExternalUrl] = useState("");
  const [publish, setPublish] = useState(true);

  // Internship fields
  const [workMode, setWorkMode] = useState<WorkMode>("remote");
  const [city, setCity] = useState("");
  const [isPaid, setIsPaid] = useState(true);
  const [stipend, setStipend] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // Scholarship fields
  const [fundingAmount, setFundingAmount] = useState("");
  const [countryScope, setCountryScope] = useState<"pakistan" | "international" | "specific">("pakistan");
  const [specificCountry, setSpecificCountry] = useState("");
  const [selectedDegreeLevels, setSelectedDegreeLevels] = useState<string[]>([]);
  const [fieldOfStudyInput, setFieldOfStudyInput] = useState("");
  const [fieldsOfStudy, setFieldsOfStudy] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const input: CreatePlatformPostingInput = {
      type,
      title: title.trim(),
      description: description.trim(),
      eligibilityCriteria: eligibility.trim() || undefined,
      deadlineAt: deadline || undefined,
      applyMethod,
      externalUrl: applyMethod === "external" ? externalUrl.trim() : undefined,
      publish,
      ...(type === "internship"
        ? {
            workMode,
            city: workMode === "onsite" ? city.trim() : undefined,
            isPaid,
            stipendAmount: isPaid && stipend ? Number(stipend) : undefined,
            stipendCurrency: "PKR",
            durationMonths: duration ? Number(duration) : undefined,
            startDate: startDate || undefined,
            skillNames: skills.length ? skills : undefined,
          }
        : {
            fundingAmount: fundingAmount.trim() || undefined,
            countryScope,
            specificCountry: countryScope === "specific" ? specificCountry.trim() : undefined,
            degreeLevelKeys: selectedDegreeLevels.length ? selectedDegreeLevels : undefined,
            fieldOfStudyNames: fieldsOfStudy.length ? fieldsOfStudy : undefined,
          }),
    };

    try {
      const result = await createPlatformPosting(input);
      router.push(`/admin/postings?created=1`);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Failed to create posting");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Platform Posting</h1>
          <p className="text-sm text-muted-foreground">Create a posting on behalf of the Scholify platform (scraped content, curated listings).</p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-500/10 dark:text-amber-300 flex gap-2">
        <ExternalLink className="size-4 shrink-0 mt-0.5" />
        <span>Platform postings appear under the <strong>Scholify Platform</strong> org. For scraped content, set Apply Method to <strong>External</strong> and paste the original source URL.</span>
      </div>

      <Card asChild className="gap-0 space-y-5 p-6">
      <form onSubmit={handleSubmit}>

        {/* Type selector */}
        <div>
          <Label className="mb-2 block">Posting Type</Label>
          <div className="flex gap-2">
            {(["internship", "scholarship"] as PostingType[]).map((t) => (
              <Button key={t} type="button" variant={type === t ? "default" : "outline"} onClick={() => setType(t)}
                className="capitalize">
                {t}
              </Button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="title" className="mb-1.5 block">Title <span className="text-destructive">*</span></Label>
          <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Software Engineering Intern at Google Pakistan" />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="desc" className="mb-1.5 block">Description <span className="text-destructive">*</span></Label>
          <Textarea id="desc" required rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Full description of the opportunity…" className="resize-none" />
        </div>

        {/* Eligibility */}
        <div>
          <Label htmlFor="elig" className="mb-1.5 block">Eligibility Criteria</Label>
          <Textarea id="elig" rows={3} value={eligibility} onChange={(e) => setEligibility(e.target.value)}
            placeholder="Who can apply? (degree level, GPA, etc.)" className="resize-none" />
        </div>

        {/* Deadline */}
        <div>
          <Label htmlFor="deadline" className="mb-1.5 block">Deadline</Label>
          <Input id="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>

        {/* Apply method */}
        <div>
          <Label className="mb-2 block">Apply Method</Label>
          <div className="flex gap-2">
            {(["external", "platform"] as const).map((m) => (
              <Button key={m} type="button" variant={applyMethod === m ? "default" : "outline"} onClick={() => setApplyMethod(m)}
                className="capitalize">
                {m === "external" ? "External (link out)" : "Platform (in-app)"}
              </Button>
            ))}
          </div>
          {applyMethod === "external" && (
            <div className="mt-3">
              <Label htmlFor="ext-url" className="mb-1.5 block">External / Source URL <span className="text-destructive">*</span></Label>
              <Input id="ext-url" type="url" required={applyMethod === "external"} value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://linkedin.com/jobs/view/…" />
            </div>
          )}
        </div>

        {/* Type-specific fields */}
        {type === "internship" && (
          <fieldset className="space-y-4 rounded-lg border border-border p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Internship Details</legend>

            <div>
              <Label className="mb-2 block">Work Mode <span className="text-destructive">*</span></Label>
              <div className="flex gap-2">
                {(["remote", "onsite", "hybrid"] as WorkMode[]).map((m) => (
                  <Button key={m} type="button" variant={workMode === m ? "default" : "outline"} size="sm" onClick={() => setWorkMode(m)}
                    className="capitalize">
                    {m}
                  </Button>
                ))}
              </div>
            </div>

            {workMode === "onsite" && (
              <div>
                <Label htmlFor="city" className="mb-1.5 block">City <span className="text-destructive">*</span></Label>
                <Input id="city" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Karachi" />
              </div>
            )}

            <div className="flex items-center gap-3">
              <Checkbox id="paid" checked={isPaid} onCheckedChange={(v) => setIsPaid(!!v)} />
              <Label htmlFor="paid">Paid internship</Label>
            </div>

            {isPaid && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="stipend" className="mb-1.5 block">Stipend (PKR/month)</Label>
                  <Input id="stipend" type="number" min="0" value={stipend} onChange={(e) => setStipend(e.target.value)} placeholder="e.g. 25000" />
                </div>
                <div>
                  <Label htmlFor="duration" className="mb-1.5 block">Duration (months)</Label>
                  <Input id="duration" type="number" min="1" max="24" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 3" />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="start" className="mb-1.5 block">Start Date</Label>
              <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="skill" className="mb-1.5 block">Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const v = skillInput.trim();
                      if (v && !skills.includes(v)) setSkills([...skills, v]);
                      setSkillInput("");
                    }
                  }}
                  placeholder="e.g. React, then press Enter"
                />
                <Button type="button" variant="outline" onClick={() => {
                  const v = skillInput.trim();
                  if (v && !skills.includes(v)) setSkills([...skills, v]);
                  setSkillInput("");
                }}>Add</Button>
              </div>
              {skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <Tag key={s} onRemove={() => setSkills(skills.filter((x) => x !== s))} removeLabel={`Remove ${s}`}>
                      {s}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          </fieldset>
        )}

        {type === "scholarship" && (
          <fieldset className="space-y-4 rounded-lg border border-border p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scholarship Details</legend>

            <div>
              <Label htmlFor="funding" className="mb-1.5 block">Funding Amount</Label>
              <Input id="funding" value={fundingAmount} onChange={(e) => setFundingAmount(e.target.value)} placeholder="e.g. Rs. 200,000/year or Full tuition" />
            </div>

            <div>
              <Label className="mb-2 block">Country Scope</Label>
              <div className="flex gap-2">
                {(["pakistan", "international", "specific"] as const).map((s) => (
                  <Button key={s} type="button" variant={countryScope === s ? "default" : "outline"} size="sm" onClick={() => setCountryScope(s)}
                    className="capitalize">
                    {s === "specific" ? "Specific country" : s}
                  </Button>
                ))}
              </div>
            </div>

            {countryScope === "specific" && (
              <div>
                <Label htmlFor="scountry" className="mb-1.5 block">Specific Country</Label>
                <Input id="scountry" value={specificCountry} onChange={(e) => setSpecificCountry(e.target.value)} placeholder="e.g. Turkey" />
              </div>
            )}

            <div>
              <Label className="mb-2 block">Target Degree Levels</Label>
              <div className="flex flex-wrap gap-3">
                {(["undergraduate", "masters", "phd", "postdoc", "diploma"] as const).map((lvl) => (
                  <Label key={lvl} className="flex items-center gap-1.5 text-sm capitalize cursor-pointer">
                    <Checkbox
                      checked={selectedDegreeLevels.includes(lvl)}
                      onCheckedChange={(v) => {
                        if (v) setSelectedDegreeLevels([...selectedDegreeLevels, lvl]);
                        else setSelectedDegreeLevels(selectedDegreeLevels.filter((l) => l !== lvl));
                      }}
                    />
                    {lvl === "postdoc" ? "Postdoctoral" : lvl}
                  </Label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="fos" className="mb-1.5 block">Fields of Study</Label>
              <div className="flex gap-2">
                <Input
                  id="fos"
                  value={fieldOfStudyInput}
                  onChange={(e) => setFieldOfStudyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const v = fieldOfStudyInput.trim();
                      if (v && !fieldsOfStudy.includes(v)) setFieldsOfStudy([...fieldsOfStudy, v]);
                      setFieldOfStudyInput("");
                    }
                  }}
                  placeholder="e.g. Engineering, then press Enter"
                />
                <Button type="button" variant="outline" onClick={() => {
                  const v = fieldOfStudyInput.trim();
                  if (v && !fieldsOfStudy.includes(v)) setFieldsOfStudy([...fieldsOfStudy, v]);
                  setFieldOfStudyInput("");
                }}>Add</Button>
              </div>
              {fieldsOfStudy.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {fieldsOfStudy.map((f) => (
                    <Tag key={f} onRemove={() => setFieldsOfStudy(fieldsOfStudy.filter((x) => x !== f))} removeLabel={`Remove ${f}`}>
                      {f}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          </fieldset>
        )}

        {/* Publish toggle */}
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
          <Checkbox id="publish" checked={publish} onCheckedChange={(v) => setPublish(!!v)} />
          <Label htmlFor="publish" className="cursor-pointer">
            <span className="font-medium">Publish immediately</span>
            <span className="ml-2 text-xs text-muted-foreground">(uncheck to save as draft)</span>
          </Label>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle className="size-4 shrink-0" /> {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {loading ? "Creating…" : publish ? "Create & Publish" : "Save as Draft"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
      </Card>
    </div>
  );
}
