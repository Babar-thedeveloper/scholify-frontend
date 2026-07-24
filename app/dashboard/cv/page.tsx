"use client";
import { Suspense, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api/handle-error";
import {
  BriefcaseBusiness,
  Check,
  FileText,
  Languages,
  LayoutList,
  Pencil,
  Plus,
  Save,
  ScrollText,
  Sparkles,
  Trash2,
  Import,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

// @react-pdf/renderer uses browser-only APIs- must be no-SSR.
const DownloadCvButton = dynamic(() => import("./DownloadCvButton"), {
  ssr: false,
  loading: () => (
    <Button disabled size="lg" className="opacity-70">
      <Spinner size="sm" className="mr-1" /> Loading…
    </Button>
  ),
});
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Modal, ModalBody, ModalHeader } from "@/components/shared/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/PageHeader";
import EuropassPreview from "./EuropassPreview";
import ModernPreview from "./ModernPreview";
import type {
  CertificationEntry,
  CvCustomSection,
  CvCustomSectionItem,
  CvDto,
  LanguageEntry,
  PatchCvInput,
  WorkExperienceEntry,
} from "@/lib/api/cv";
import { getMyCv, patchMyCv } from "@/lib/api/cv";
import { ResumeImportModal } from "@/components/cv/ResumeImportModal";
import type { ParsedResume } from "@/lib/cv/resume-parser";

// ─── Months helper ──────────────────────────────────────────
const MONTHS = [
  { value: 1,  label: "January" },
  { value: 2,  label: "February" },
  { value: 3,  label: "March" },
  { value: 4,  label: "April" },
  { value: 5,  label: "May" },
  { value: 6,  label: "June" },
  { value: 7,  label: "July" },
  { value: 8,  label: "August" },
  { value: 9,  label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const YEAR_OPTIONS = Array.from({ length: 36 }, (_, i) => 2030 - i);

const CEFR_LEVELS = [
  { value: "Native", label: "Native" },
  { value: "C2", label: "C2 – Mastery" },
  { value: "C1", label: "C1 – Advanced" },
  { value: "B2", label: "B2 – Upper Intermediate" },
  { value: "B1", label: "B1 – Intermediate" },
  { value: "A2", label: "A2 – Elementary" },
  { value: "A1", label: "A1 – Beginner" },
] as const;

type TemplateKey = "europass" | "modern";

// Country options for the CV location dropdown (common destinations first).
const COUNTRIES = [
  "Pakistan", "Afghanistan", "Australia", "Austria", "Bahrain", "Bangladesh", "Belgium",
  "Brazil", "Canada", "China", "Denmark", "Egypt", "Finland", "France", "Germany",
  "Greece", "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Malaysia", "Maldives", "Mexico",
  "Morocco", "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway", "Oman",
  "Philippines", "Poland", "Portugal", "Qatar", "Russia", "Saudi Arabia", "Singapore",
  "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland",
  "Thailand", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uzbekistan", "Vietnam", "Other",
];

// ─── Empty drafts ────────────────────────────────────────────
const emptyWorkExp = (): WorkExperienceEntry => ({
  id: crypto.randomUUID(), title: "", company: "", city: "",
  startMonth: 1, startYear: new Date().getFullYear(),
  isCurrent: false,
});

const emptyLanguage = (): LanguageEntry => ({
  id: crypto.randomUUID(), language: "", level: "B1",
});

const emptyCert = (): CertificationEntry => ({
  id: crypto.randomUUID(), name: "", issuer: "", year: undefined,
});

const emptyCustomSection = (): CvCustomSection => ({
  id: crypto.randomUUID(), title: "", items: [],
});

const emptyCustomItem = (): CvCustomSectionItem => ({
  id: crypto.randomUUID(), heading: "", subtitle: "", description: "",
});

// ─── Main page ───────────────────────────────────────────────
function CVPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cv, setCv] = useState<CvDto | null>(null);
  const [draft, setDraft] = useState<CvDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"work" | "skills" | "languages" | "certs" | "custom">("work");
  const [previewVisible, setPreviewVisible] = useState(false); // mobile toggle

  // Work exp dialog
  const [weDialog, setWeDialog] = useState<{ open: boolean; entry: WorkExperienceEntry | null }>({
    open: false, entry: null,
  });
  // Language dialog
  const [langDialog, setLangDialog] = useState<{ open: boolean; entry: LanguageEntry | null }>({
    open: false, entry: null,
  });
  // Cert dialog
  const [certDialog, setCertDialog] = useState<{ open: boolean; entry: CertificationEntry | null }>({
    open: false, entry: null,
  });
  // Custom section dialog
  const [customDialog, setCustomDialog] = useState<{ open: boolean; entry: CvCustomSection | null }>({
    open: false, entry: null,
  });
  // Skills input
  const [skillInput, setSkillInput] = useState("");
  // Resume import
  const [resumeOpen, setResumeOpen] = useState(false);

  function applyResume(r: ParsedResume) {
    setDraft((prev) => {
      if (!prev) return prev;
      const skills = Array.from(new Set([...prev.skills, ...r.skills])).slice(0, 40);
      const workExperience = [...prev.workExperience, ...r.workExperience].slice(0, 20);
      const haveLang = new Set(prev.languages.map((l) => l.language.toLowerCase()));
      const languages = [...prev.languages, ...r.languages.filter((l) => !haveLang.has(l.language.toLowerCase()))].slice(0, 20);
      const certifications = [...prev.certifications, ...r.certifications].slice(0, 20);
      const customSections = [...prev.customSections, ...r.customSections].slice(0, 10);
      return { ...prev, skills, workExperience, languages, certifications, customSections };
    });
    setSaved(false);
    const added =
      r.skills.length + r.workExperience.length + r.languages.length +
      r.certifications.length + r.customSections.reduce((n, s) => n + s.items.length, 0);
    toast.success(`Imported ${added} item${added === 1 ? "" : "s"} from your resume. Review, then Save.`);
    setActiveTab(r.workExperience.length ? "work" : r.skills.length ? "skills" : "custom");
  }

  useEffect(() => {
    const reset = searchParams.get("reset") === "true";
    const fromProfile = searchParams.get("source") === "profile";
    getMyCv()
      .then((data) => {
        setCv(data);
        if (reset) {
          // Truly blank CV- no profile data pulled in.
          setDraft({
            ...data,
            fullName: "", phone: "", city: "", country: "", headline: "",
            university: "", degreeLevel: "", fieldOfStudy: "", cgpa: "",
            bio: "", aboutMe: "",
            workExperience: [], skills: [], languages: [], certifications: [], customSections: [],
          });
          router.replace("/dashboard/cv");
          toast.success("Started fresh- a blank CV. Fill in your details below.");
        } else if (fromProfile) {
          // Merge profile defaults into the CV- only overwrite CV fields that
          // are empty/null so we never destroy manually-entered data.
          const pd = data.profileDefaults ?? {};
          const pick = (profileVal: string | null | undefined, cvVal: string | null | undefined) =>
            (cvVal && cvVal.trim()) ? cvVal : (profileVal ?? null);
          setDraft({
            ...data,
            fullName: pick(pd.fullName, data.fullName),
            phone: pick(pd.phone, data.phone),
            city: pick(pd.city, data.city),
            country: (data.country && data.country.trim()) ? data.country : (pd.country ?? "Pakistan"),
            headline: pick(pd.headline, data.headline),
            university: pick(pd.university, data.university),
            degreeLevel: pick(pd.degreeLevel, data.degreeLevel),
            fieldOfStudy: pick(pd.fieldOfStudy, data.fieldOfStudy),
            cgpa: pick(pd.cgpa, data.cgpa),
          });
          router.replace("/dashboard/cv");
          toast.success("Loaded your details from your profile.");
        } else {
          setDraft(data);
        }
      })
      .catch(() => setError("Could not load CV data."))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save every 60 seconds when there are unsaved changes
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!draft || saving) return;
      const hasChanges = JSON.stringify(draft) !== JSON.stringify(cv);
      if (!hasChanges) return;
      try {
        const payload: PatchCvInput = {
          workExperience: draft.workExperience,
          languages: draft.languages,
          certifications: draft.certifications,
          skills: draft.skills,
          templateKey: draft.templateKey as TemplateKey,
          customSections: draft.customSections,
          aboutMe: draft.aboutMe,
          identity: {
            fullName: draft.fullName ?? undefined,
            phone: draft.phone ?? undefined,
            city: draft.city ?? undefined,
            country: draft.country ?? undefined,
            headline: draft.headline ?? undefined,
            university: draft.university ?? undefined,
            degreeLevel: draft.degreeLevel ?? undefined,
            fieldOfStudy: draft.fieldOfStudy ?? undefined,
            cgpa: draft.cgpa ?? undefined,
          },
        };
        const updated = await patchMyCv(payload);
        setCv(updated);
        setLastAutoSave(new Date());
      } catch {
        // Silent on auto-save failure- don't disrupt editing
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [draft, cv, saving]);

  const updateDraft = useCallback((patch: Partial<CvDto>) => {
    setDraft((prev) => prev ? { ...prev, ...patch } : prev);
    setSaved(false);
  }, []);

  async function handleSave() {
    if (!draft) return;
    setSaving(true);
    setError("");
    try {
      const payload: PatchCvInput = {
        workExperience: draft.workExperience,
        languages: draft.languages,
        certifications: draft.certifications,
        skills: draft.skills,
        templateKey: draft.templateKey as TemplateKey,
        customSections: draft.customSections,
        aboutMe: draft.aboutMe,
        identity: {
          fullName: draft.fullName ?? undefined,
          phone: draft.phone ?? undefined,
          city: draft.city ?? undefined,
          country: draft.country ?? undefined,
          headline: draft.headline ?? undefined,
          university: draft.university ?? undefined,
          degreeLevel: draft.degreeLevel ?? undefined,
          fieldOfStudy: draft.fieldOfStudy ?? undefined,
          cgpa: draft.cgpa ?? undefined,
        },
      };
      const updated = await patchMyCv(payload);
      setCv(updated);
      setDraft(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      handleApiError(e, "Could not save your CV.");
    } finally {
      setSaving(false);
    }
  }

  // ── Work experience actions ───────────────────────────────
  function openWeAdd() {
    setWeDialog({ open: true, entry: emptyWorkExp() });
  }
  function openWeEdit(entry: WorkExperienceEntry) {
    setWeDialog({ open: true, entry: { ...entry } });
  }
  function saveWeEntry(entry: WorkExperienceEntry) {
    const list = draft?.workExperience ?? [];
    const existing = list.findIndex((e) => e.id === entry.id);
    const updated = existing >= 0
      ? list.map((e) => e.id === entry.id ? entry : e)
      : [...list, entry];
    updateDraft({ workExperience: updated });
    setWeDialog({ open: false, entry: null });
  }
  function removeWeEntry(id: string) {
    updateDraft({ workExperience: (draft?.workExperience ?? []).filter((e) => e.id !== id) });
  }

  // ── Skills actions ────────────────────────────────────────
  function addSkill() {
    const s = skillInput.trim();
    if (!s || !draft) return;
    if (draft.skills.includes(s)) { setSkillInput(""); return; }
    updateDraft({ skills: [...draft.skills, s] });
    setSkillInput("");
  }
  function removeSkill(s: string) {
    updateDraft({ skills: (draft?.skills ?? []).filter((x) => x !== s) });
  }

  // ── Language actions ──────────────────────────────────────
  function openLangAdd() {
    setLangDialog({ open: true, entry: emptyLanguage() });
  }
  function openLangEdit(entry: LanguageEntry) {
    setLangDialog({ open: true, entry: { ...entry } });
  }
  function saveLangEntry(entry: LanguageEntry) {
    const list = draft?.languages ?? [];
    const existing = list.findIndex((e) => e.id === entry.id);
    const updated = existing >= 0
      ? list.map((e) => e.id === entry.id ? entry : e)
      : [...list, entry];
    updateDraft({ languages: updated });
    setLangDialog({ open: false, entry: null });
  }
  function removeLangEntry(id: string) {
    updateDraft({ languages: (draft?.languages ?? []).filter((e) => e.id !== id) });
  }

  // ── Cert actions ──────────────────────────────────────────
  function openCertAdd() {
    setCertDialog({ open: true, entry: emptyCert() });
  }
  function openCertEdit(entry: CertificationEntry) {
    setCertDialog({ open: true, entry: { ...entry } });
  }
  function saveCertEntry(entry: CertificationEntry) {
    const list = draft?.certifications ?? [];
    const existing = list.findIndex((e) => e.id === entry.id);
    const updated = existing >= 0
      ? list.map((e) => e.id === entry.id ? entry : e)
      : [...list, entry];
    updateDraft({ certifications: updated });
    setCertDialog({ open: false, entry: null });
  }
  function removeCertEntry(id: string) {
    updateDraft({ certifications: (draft?.certifications ?? []).filter((e) => e.id !== id) });
  }

  // ── Custom section actions ────────────────────────────────
  function openCustomAdd() {
    setCustomDialog({ open: true, entry: emptyCustomSection() });
  }
  function openCustomEdit(entry: CvCustomSection) {
    setCustomDialog({ open: true, entry: { ...entry, items: entry.items.map((i) => ({ ...i })) } });
  }
  function saveCustomSection(entry: CvCustomSection) {
    const list = draft?.customSections ?? [];
    const existing = list.findIndex((e) => e.id === entry.id);
    const updated = existing >= 0
      ? list.map((e) => e.id === entry.id ? entry : e)
      : [...list, entry];
    updateDraft({ customSections: updated });
    setCustomDialog({ open: false, entry: null });
  }
  function removeCustomSection(id: string) {
    updateDraft({ customSections: (draft?.customSections ?? []).filter((e) => e.id !== id) });
  }

  // ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!draft) {
    return (
      <div>
        <PageHeader title="My CV" subtitle="Auto-generated from your profile data" />
        <p className="text-sm text-destructive mt-4">{error || "Could not load CV."}</p>
      </div>
    );
  }

  const templateKey = (draft.templateKey ?? "europass") as TemplateKey;
  const dirty = JSON.stringify(draft) !== JSON.stringify(cv);
  const saveStatus = saving
    ? "Saving…"
    : saved
    ? "✓ Saved"
    : lastAutoSave
    ? `Draft saved ${lastAutoSave.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : dirty
    ? "Unsaved changes"
    : "All changes saved";

  return (
    <div>
      {/* ── Premium header ── */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-5 dark:border-emerald-500/20 dark:from-emerald-500/10 dark:via-card dark:to-card sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md">
              <FileText className="size-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">CV Builder</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                  <Sparkles className="size-3" /> Free
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Recruiter-ready CVs, auto-filled from your profile. Export to PDF anytime.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">{saveStatus}</span>
            <Button variant="outline" size="lg" onClick={() => setResumeOpen(true)} className="gap-1.5">
              <Import className="size-4" /> <span className="hidden sm:inline">Import resume</span>
            </Button>
            <Button onClick={handleSave} disabled={saving} size="lg">
              {saving ? <Spinner size="sm" /> : <Save className="size-4" />}
              {saving ? "Saving…" : saved ? "Saved!" : "Save"}
            </Button>
            <DownloadCvButton cv={draft} templateKey={templateKey} />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-4 lg:hidden">
        <Button variant="outline" className="w-full" onClick={() => setPreviewVisible((v) => !v)}>
          {previewVisible ? "Hide preview" : "Show preview"}
        </Button>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Editor pane ── */}
        <div className="w-full lg:w-[420px] shrink-0 space-y-4">
          {/* Template picker */}
          <Card className="gap-0 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Template
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(["europass", "modern"] as TemplateKey[]).map((t) => {
                const active = templateKey === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateDraft({ templateKey: t })}
                    aria-pressed={active}
                    className={cn(
                      "group relative rounded-xl border-2 p-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40",
                      active
                        ? "border-emerald-500 ring-2 ring-emerald-500/15"
                        : "border-border hover:border-emerald-300",
                    )}
                  >
                    {active && (
                      <span className="absolute right-1.5 top-1.5 z-10 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                        <Check className="size-3" />
                      </span>
                    )}
                    <TemplateThumb variant={t} />
                    <p
                      className={cn(
                        "mt-2 text-center text-xs font-semibold",
                        active ? "text-emerald-700 dark:text-emerald-400" : "text-foreground",
                      )}
                    >
                      {t === "europass" ? "Europass" : "Modern"}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Personal details- editable (blank on "Start Fresh") */}
          <Card className="gap-0 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Personal details
              </p>
              <Button asChild variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                <Link href="/dashboard/cv?source=profile">
                  <Sparkles className="size-3 text-emerald-500" /> Fill from profile
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="col-span-2">
                <Label className="mb-1 block text-xs">Full name</Label>
                <Input value={draft.fullName ?? ""} onChange={(e) => updateDraft({ fullName: e.target.value })} placeholder="e.g. Ayesha Khan" className="h-9 text-sm" />
              </div>
              <div className="col-span-2">
                <Label className="mb-1 block text-xs">Headline</Label>
                <Input value={draft.headline ?? ""} onChange={(e) => updateDraft({ headline: e.target.value })} placeholder="e.g. Computer Science Undergraduate" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="mb-1 block text-xs">Email</Label>
                <Input value={draft.email} disabled className="h-9 text-sm opacity-70" />
              </div>
              <div>
                <Label className="mb-1 block text-xs">Phone</Label>
                <Input value={draft.phone ?? ""} onChange={(e) => updateDraft({ phone: e.target.value })} placeholder="03xx xxxxxxx" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="mb-1 block text-xs">City</Label>
                <Input value={draft.city ?? ""} onChange={(e) => updateDraft({ city: e.target.value })} placeholder="e.g. Toronto" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="mb-1 block text-xs">Country</Label>
                <Select value={draft.country || ""} onValueChange={(v) => updateDraft({ country: v })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select country" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1 block text-xs">University</Label>
                <Input value={draft.university ?? ""} onChange={(e) => updateDraft({ university: e.target.value })} placeholder="University" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="mb-1 block text-xs">Degree</Label>
                <Input value={draft.degreeLevel ?? ""} onChange={(e) => updateDraft({ degreeLevel: e.target.value })} placeholder="e.g. Bachelor's" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="mb-1 block text-xs">Field of study</Label>
                <Input value={draft.fieldOfStudy ?? ""} onChange={(e) => updateDraft({ fieldOfStudy: e.target.value })} placeholder="e.g. Computer Science" className="h-9 text-sm" />
              </div>
              <div className="col-span-2">
                <Label className="mb-1 block text-xs">CGPA</Label>
                <Input value={draft.cgpa ?? ""} onChange={(e) => updateDraft({ cgpa: e.target.value })} placeholder="e.g. 3.8" className="h-9 text-sm" />
              </div>
            </div>
          </Card>

          {/* About Me- Europass personal statement (tailorable) */}
          <Card className="gap-0 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                About Me
              </p>
              <span className="text-[10px] text-muted-foreground">{(draft.aboutMe ?? "").length}/600</span>
            </div>
            <Textarea
              rows={4}
              maxLength={600}
              value={draft.aboutMe ?? ""}
              onChange={(e) => updateDraft({ aboutMe: e.target.value })}
              placeholder="2–4 lines on why you're a strong fit. Tailor it to the role and use strong verbs (led, built, increased)."
              className="resize-none text-sm"
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              Europass recommends a short, tailored summary here- focus on the facts that match the job. Leave blank to use your profile bio.
            </p>
          </Card>

          {/* Section tabs */}
          <Card className="gap-0 border-border overflow-hidden">
            <div className="flex border-b border-border" role="tablist">
              {([
                { key: "work",      label: "Work",      Icon: BriefcaseBusiness },
                { key: "skills",    label: "Skills",    Icon: Sparkles },
                { key: "languages", label: "Languages", Icon: Languages },
                { key: "certs",     label: "Certs",     Icon: ScrollText },
                { key: "custom",    label: "Custom",    Icon: LayoutList },
              ] as const).map(({ key, label, Icon }) => {
                const active = activeTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      "relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500/40",
                      active
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                    {active && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-4">
              {/* ── Work experience tab ── */}
              {activeTab === "work" && (
                <div className="space-y-3">
                  {draft.workExperience.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No work experience added yet.
                    </p>
                  )}
                  {draft.workExperience.map((e) => (
                    <WorkExpCard
                      key={e.id}
                      entry={e}
                      onEdit={() => openWeEdit(e)}
                      onRemove={() => removeWeEntry(e.id)}
                    />
                  ))}
                  <Button variant="outline" size="sm" className="w-full gap-1" onClick={openWeAdd}>
                    <Plus className="size-3.5" /> Add experience
                  </Button>
                </div>
              )}

              {/* ── Skills tab ── */}
              {activeTab === "skills" && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. React, Python, Figma…"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                      className="text-sm"
                    />
                    <Button size="sm" onClick={addSkill}>Add</Button>
                  </div>
                  {draft.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {draft.skills.map((s) => (
                        <Tag key={s} onRemove={() => removeSkill(s)} removeLabel={`Remove ${s}`}>
                          {s}
                        </Tag>
                      ))}
                    </div>
                  )}
                  {draft.skills.length === 0 && (
                    <p className="text-sm text-muted-foreground">Type a skill and press Enter or Add.</p>
                  )}
                </div>
              )}

              {/* ── Languages tab ── */}
              {activeTab === "languages" && (
                <div className="space-y-3">
                  {draft.languages.length === 0 && (
                    <p className="text-sm text-muted-foreground">No languages added yet.</p>
                  )}
                  {draft.languages.map((l) => (
                    <div key={l.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                      <div>
                        <p className="text-sm font-medium">{l.language}</p>
                        <p className="text-xs text-muted-foreground">{l.level}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => openLangEdit(l)}>
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => removeLangEntry(l.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full gap-1" onClick={openLangAdd}>
                    <Plus className="size-3.5" /> Add language
                  </Button>
                </div>
              )}

              {/* ── Certifications tab ── */}
              {activeTab === "certs" && (
                <div className="space-y-3">
                  {draft.certifications.length === 0 && (
                    <p className="text-sm text-muted-foreground">No certifications added yet.</p>
                  )}
                  {draft.certifications.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        {c.issuer && <p className="text-xs text-muted-foreground">{c.issuer}{c.year ? ` · ${c.year}` : ""}</p>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => openCertEdit(c)}>
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => removeCertEntry(c.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full gap-1" onClick={openCertAdd}>
                    <Plus className="size-3.5" /> Add certification
                  </Button>
                </div>
              )}

              {/* ── Custom sections tab ── */}
              {activeTab === "custom" && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Add your own sections- Projects, Awards, Volunteering, Publications, anything. Each section has a title and your own entries.
                  </p>
                  {draft.customSections.length === 0 && (
                    <p className="text-sm text-muted-foreground">No custom sections yet.</p>
                  )}
                  {draft.customSections.map((sec) => (
                    <div key={sec.id} className="flex items-start justify-between gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{sec.title || "Untitled section"}</p>
                        <p className="text-xs text-muted-foreground">
                          {sec.items.length} {sec.items.length === 1 ? "entry" : "entries"}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => openCustomEdit(sec)}>
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => removeCustomSection(sec.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full gap-1" onClick={openCustomAdd}>
                    <Plus className="size-3.5" /> Add custom section
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ── Preview pane ── */}
        <div className={cn("min-w-0 flex-1", previewVisible ? "block" : "hidden", "lg:block")}>
          <div className="mb-2 flex items-center justify-between lg:sticky lg:top-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Live preview
            </p>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {templateKey === "europass" ? "Europass" : "Modern"} · A4
            </span>
          </div>
          <div className="rounded-2xl border border-border bg-gradient-to-b from-muted/60 to-muted/20 p-3 sm:p-5">
            <div className="mx-auto w-full max-w-[794px] overflow-hidden rounded-lg bg-white shadow-[0_10px_40px_-12px_rgba(0,0,0,0.28)] ring-1 ring-black/5">
              {templateKey === "europass" ? <EuropassPreview cv={draft} /> : <ModernPreview cv={draft} />}
            </div>
          </div>
        </div>
      </div>

      {/* ── Work experience dialog ── */}
      <Modal
        open={weDialog.open}
        onOpenChange={(o) => !o && setWeDialog({ open: false, entry: null })}
        size="md"
      >
        <ModalHeader
          title={
            weDialog.entry && draft.workExperience.find((e) => e.id === weDialog.entry?.id)
              ? "Edit experience"
              : "Add experience"
          }
          description="Roles, internships, or volunteer work - most recent first."
        />
        {weDialog.entry && (
          <ModalBody>
            <WorkExpForm
              initial={weDialog.entry}
              onSave={saveWeEntry}
              onCancel={() => setWeDialog({ open: false, entry: null })}
            />
          </ModalBody>
        )}
      </Modal>

      {/* ── Language dialog ── */}
      <Modal
        open={langDialog.open}
        onOpenChange={(o) => !o && setLangDialog({ open: false, entry: null })}
        size="sm"
      >
        <ModalHeader
          title={
            langDialog.entry && draft.languages.find((l) => l.id === langDialog.entry?.id)
              ? "Edit language"
              : "Add language"
          }
          description="Pick your CEFR level - shown as a proficiency bar on your CV."
        />
        {langDialog.entry && (
          <ModalBody>
            <LanguageForm
              initial={langDialog.entry}
              onSave={saveLangEntry}
              onCancel={() => setLangDialog({ open: false, entry: null })}
            />
          </ModalBody>
        )}
      </Modal>

      {/* ── Certification dialog ── */}
      <Modal
        open={certDialog.open}
        onOpenChange={(o) => !o && setCertDialog({ open: false, entry: null })}
        size="sm"
      >
        <ModalHeader
          title={
            certDialog.entry && draft.certifications.find((c) => c.id === certDialog.entry?.id)
              ? "Edit certification"
              : "Add certification"
          }
          description="Certifications, online courses, or credentials."
        />
        {certDialog.entry && (
          <ModalBody>
            <CertForm
              initial={certDialog.entry}
              onSave={saveCertEntry}
              onCancel={() => setCertDialog({ open: false, entry: null })}
            />
          </ModalBody>
        )}
      </Modal>

      {/* ── Resume import ── */}
      <ResumeImportModal open={resumeOpen} onOpenChange={setResumeOpen} onApply={applyResume} />

      {/* ── Custom section dialog ── */}
      <Modal
        open={customDialog.open}
        onOpenChange={(o) => !o && setCustomDialog({ open: false, entry: null })}
        size="md"
      >
        <ModalHeader
          title={
            customDialog.entry && draft.customSections.find((s) => s.id === customDialog.entry?.id)
              ? "Edit custom section"
              : "Add custom section"
          }
          description="Give the section a title, then add your own entries- e.g. Projects, Awards, Volunteering."
        />
        {customDialog.entry && (
          <ModalBody>
            <CustomSectionForm
              initial={customDialog.entry}
              onSave={saveCustomSection}
              onCancel={() => setCustomDialog({ open: false, entry: null })}
            />
          </ModalBody>
        )}
      </Modal>
    </div>
  );
}

export default function CVPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Spinner size="xl" />
        </div>
      }
    >
      <CVPageContent />
    </Suspense>
  );
}

// ─── TemplateThumb - mini live-ish preview of each template ──
function TemplateThumb({ variant }: { variant: TemplateKey }) {
  if (variant === "modern") {
    return (
      <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-white shadow-inner ring-1 ring-black/5">
        <div className="flex h-[26%] items-center gap-1 bg-[#0f172a] px-1.5">
          <div className="size-2.5 rounded-full bg-emerald-500" />
          <div className="space-y-0.5">
            <div className="h-1 w-8 rounded bg-white/70" />
            <div className="h-0.5 w-5 rounded bg-emerald-400" />
          </div>
        </div>
        <div className="space-y-1 p-1.5">
          <div className="h-0.5 w-full rounded bg-slate-200" />
          <div className="h-0.5 w-5/6 rounded bg-slate-200" />
          <div className="mt-1.5 h-1 w-1/3 rounded bg-emerald-300" />
          <div className="h-0.5 w-full rounded bg-slate-100" />
          <div className="h-0.5 w-4/6 rounded bg-slate-100" />
        </div>
      </div>
    );
  }
  return (
    <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-white shadow-inner ring-1 ring-black/5">
      <div className="h-[6%] w-full bg-[#003399]" />
      <div className="flex h-[94%]">
        <div className="w-1/3 space-y-1 bg-[#eef3fb] p-1">
          <div className="mx-auto size-4 rounded-full bg-[#dde5f4]" />
          <div className="h-0.5 w-full rounded bg-[#c0cce8]" />
          <div className="h-0.5 w-3/4 rounded bg-[#c0cce8]" />
        </div>
        <div className="flex-1 space-y-1 p-1">
          <div className="h-1 w-3/4 rounded bg-[#003399]/70" />
          <div className="h-0.5 w-full rounded bg-slate-200" />
          <div className="h-0.5 w-5/6 rounded bg-slate-100" />
          <div className="h-0.5 w-4/6 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

// ─── WorkExpCard ─────────────────────────────────────────────
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function WorkExpCard({ entry, onEdit, onRemove }: {
  entry: WorkExperienceEntry; onEdit: () => void; onRemove: () => void;
}) {
  const start = `${MONTH_SHORT[entry.startMonth - 1]} ${entry.startYear}`;
  const end = entry.isCurrent ? "Present"
    : entry.endMonth && entry.endYear ? `${MONTH_SHORT[entry.endMonth - 1]} ${entry.endYear}` : "";
  return (
    <div className="flex items-start justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5 gap-2">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{entry.title || "Untitled"}</p>
        <p className="text-xs text-muted-foreground truncate">{[entry.company, entry.city, entry.country].filter(Boolean).join(", ")}</p>
        <p className="text-xs text-muted-foreground">{start}{end ? ` – ${end}` : ""}</p>
      </div>
      <div className="flex shrink-0 gap-1">
        <Button variant="ghost" size="icon" className="size-7" onClick={onEdit}>
          <Pencil className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={onRemove}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── WorkExpForm ─────────────────────────────────────────────
function WorkExpForm({ initial, onSave, onCancel }: {
  initial: WorkExperienceEntry;
  onSave: (e: WorkExperienceEntry) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<WorkExperienceEntry>(initial);
  const set = (patch: Partial<WorkExperienceEntry>) => setForm((f) => ({ ...f, ...patch }));

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.title.trim() || !form.company.trim()) return;
    onSave(form);
  }

  return (
    <form onSubmit={submit} className="space-y-4 pt-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <Label>Job title *</Label>
          <Input value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Software Engineer Intern" required />
        </div>
        <div className="col-span-2 space-y-1">
          <Label>Company *</Label>
          <Input value={form.company} onChange={(e) => set({ company: e.target.value })} placeholder="Company name" required />
        </div>
        <div className="space-y-1">
          <Label>City</Label>
          <Input value={form.city ?? ""} onChange={(e) => set({ city: e.target.value })} placeholder="e.g. Toronto" />
        </div>
        <div className="space-y-1">
          <Label>Country</Label>
          <Select value={form.country || ""} onValueChange={(v) => set({ country: v })}>
            <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Start month *</Label>
          <Select value={String(form.startMonth)} onValueChange={(v) => set({ startMonth: Number(v) })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Start year *</Label>
          <Select value={String(form.startYear)} onValueChange={(v) => set({ startYear: Number(v) })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 flex items-center gap-2">
          <Checkbox
            id="isCurrent"
            checked={form.isCurrent}
            onCheckedChange={(v) => set({ isCurrent: !!v })}
          />
          <Label htmlFor="isCurrent" className="cursor-pointer font-normal">Currently working here</Label>
        </div>

        {!form.isCurrent && (
          <>
            <div className="space-y-1">
              <Label>End month</Label>
              <Select value={form.endMonth ? String(form.endMonth) : ""} onValueChange={(v) => set({ endMonth: Number(v) || undefined })}>
                <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>End year</Label>
              <Select value={form.endYear ? String(form.endYear) : ""} onValueChange={(v) => set({ endYear: Number(v) || undefined })}>
                <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>
                  {YEAR_OPTIONS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="col-span-2 space-y-1">
          <Label>Description</Label>
          <Textarea
            rows={3}
            value={form.description ?? ""}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Key responsibilities or achievements…"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

// ─── CustomSectionForm ───────────────────────────────────────
function CustomSectionForm({ initial, onSave, onCancel }: {
  initial: CvCustomSection;
  onSave: (e: CvCustomSection) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [items, setItems] = useState<CvCustomSectionItem[]>(
    initial.items.length ? initial.items : [emptyCustomItem()]
  );

  const setItem = (id: string, patch: Partial<CvCustomSectionItem>) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const addItem = () => setItems((list) => [...list, emptyCustomItem()]);
  const removeItem = (id: string) => setItems((list) => list.filter((it) => it.id !== id));

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!title.trim()) return;
    // Keep only entries that have at least a heading.
    const cleaned = items
      .filter((it) => it.heading.trim())
      .map((it) => ({
        ...it,
        heading: it.heading.trim(),
        subtitle: it.subtitle?.trim() || undefined,
        description: it.description?.trim() || undefined,
      }));
    onSave({ ...initial, title: title.trim(), items: cleaned });
  }

  return (
    <form onSubmit={submit} className="space-y-4 pt-1">
      <div className="space-y-1">
        <Label>Section title *</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Projects, Awards, Volunteering"
          required
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Entries</Label>
          <span className="text-xs text-muted-foreground">{items.length} added</span>
        </div>
        {items.map((it, idx) => (
          <div key={it.id} className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Entry {idx + 1}</span>
              {items.length > 1 && (
                <Button type="button" variant="ghost" size="icon" className="size-6 text-destructive" onClick={() => removeItem(it.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
            <Input
              value={it.heading}
              onChange={(e) => setItem(it.id, { heading: e.target.value })}
              placeholder="Heading * (e.g. Scholarship Finder App)"
            />
            <Input
              value={it.subtitle ?? ""}
              onChange={(e) => setItem(it.id, { subtitle: e.target.value })}
              placeholder="Subtitle (e.g. 2024, or Team Lead) - optional"
            />
            <Textarea
              rows={2}
              value={it.description ?? ""}
              onChange={(e) => setItem(it.id, { description: e.target.value })}
              placeholder="Description - optional"
              className="resize-none"
            />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="w-full gap-1" onClick={addItem}>
          <Plus className="size-3.5" /> Add entry
        </Button>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save section</Button>
      </div>
    </form>
  );
}

// ─── LanguageForm ────────────────────────────────────────────
function LanguageForm({ initial, onSave, onCancel }: {
  initial: LanguageEntry;
  onSave: (e: LanguageEntry) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<LanguageEntry>(initial);

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.language.trim()) return;
    onSave(form);
  }

  return (
    <form onSubmit={submit} className="space-y-4 pt-1">
      <div className="space-y-1">
        <Label>Language *</Label>
        <Input
          value={form.language}
          onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
          placeholder="e.g. Urdu, English, Arabic"
          required
        />
      </div>
      <div className="space-y-1">
        <Label>Proficiency level *</Label>
        <Select
          value={form.level}
          onValueChange={(v) => setForm((f) => ({ ...f, level: v as LanguageEntry["level"] }))}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {CEFR_LEVELS.map((l) => (
              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

// ─── CertForm ────────────────────────────────────────────────
function CertForm({ initial, onSave, onCancel }: {
  initial: CertificationEntry;
  onSave: (e: CertificationEntry) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<CertificationEntry>(initial);
  const set = (patch: Partial<CertificationEntry>) => setForm((f) => ({ ...f, ...patch }));

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <form onSubmit={submit} className="space-y-4 pt-1">
      <div className="space-y-1">
        <Label>Certification name *</Label>
        <Input
          value={form.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="e.g. AWS Cloud Practitioner"
          required
        />
      </div>
      <div className="space-y-1">
        <Label>Issuer</Label>
        <Input
          value={form.issuer ?? ""}
          onChange={(e) => set({ issuer: e.target.value })}
          placeholder="e.g. Amazon Web Services"
        />
      </div>
      <div className="space-y-1">
        <Label>Year</Label>
        <Input
          type="number"
          min={1990}
          max={2100}
          value={form.year ?? ""}
          onChange={(e) => set({ year: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="e.g. 2024"
        />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
