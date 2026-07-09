"use client";
import { Suspense, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api/handle-error";
import {
  ArrowLeft,
  BriefcaseBusiness,
  GraduationCap,
  Languages,
  Loader2,
  Pencil,
  Plus,
  Save,
  ScrollText,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

// @react-pdf/renderer uses browser-only APIs — must be no-SSR.
const DownloadCvButton = dynamic(() => import("./DownloadCvButton"), {
  ssr: false,
  loading: () => (
    <button
      disabled
      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-70 cursor-not-allowed"
    >
      <Loader2 className="size-4 animate-spin" /> Loading…
    </button>
  ),
});
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  CvDto,
  LanguageEntry,
  PatchCvInput,
  WorkExperienceEntry,
} from "@/lib/api/cv";
import { getMyCv, patchMyCv } from "@/lib/api/cv";

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
  const [activeTab, setActiveTab] = useState<"work" | "skills" | "languages" | "certs">("work");
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
  // Skills input
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    const reset = searchParams.get("reset") === "true";
    getMyCv()
      .then((data) => {
        setCv(data);
        if (reset) {
          setDraft({ ...data, workExperience: [], skills: [], languages: [], certifications: [] });
          router.replace("/dashboard/cv");
          toast.success("Started fresh — your profile is pre-filled, add your extras below.");
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
        };
        const updated = await patchMyCv(payload);
        setCv(updated);
        setLastAutoSave(new Date());
      } catch {
        // Silent on auto-save failure — don't disrupt editing
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

  // ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
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

  return (
    <div>
      <PageHeader
        title="My CV"
        subtitle="Auto-generated from your profile · add extras below"
      />

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Top action bar ── */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Auto-save status */}
        <span className="text-xs text-muted-foreground mr-1">
          {saving
            ? "Saving…"
            : saved
            ? "✓ Saved"
            : lastAutoSave
            ? `Draft saved ${lastAutoSave.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : draft && JSON.stringify(draft) !== JSON.stringify(cv)
            ? "Unsaved changes"
            : null}
        </span>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {saving ? "Saving…" : saved ? "Saved!" : "Save changes"}
        </Button>
        <DownloadCvButton cv={draft} templateKey={templateKey} />
        <Button
          variant="ghost"
          className="ml-auto lg:hidden"
          onClick={() => setPreviewVisible((v) => !v)}
        >
          {previewVisible ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Editor pane ── */}
        <div className="w-full lg:w-[420px] shrink-0 space-y-4">
          {/* Profile info — read-only */}
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Profile info (auto-populated)
              </p>
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1">
                <Link href="/dashboard/profile">
                  <Pencil className="size-3" /> Edit
                </Link>
              </Button>
            </div>
            <div className="mt-2 space-y-0.5 text-sm text-foreground">
              <p><span className="text-muted-foreground">Name:</span> {draft.fullName ?? <em className="text-muted-foreground">not set</em>}</p>
              <p><span className="text-muted-foreground">Email:</span> {draft.email}</p>
              {draft.phone && <p><span className="text-muted-foreground">Phone:</span> {draft.phone}</p>}
              {draft.university && <p><span className="text-muted-foreground">University:</span> {draft.university}</p>}
              {draft.degreeLevel && draft.fieldOfStudy && (
                <p><span className="text-muted-foreground">Degree:</span> {draft.degreeLevel} in {draft.fieldOfStudy}</p>
              )}
            </div>
          </div>

          {/* Template picker */}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Template
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["europass", "modern"] as TemplateKey[]).map((t) => (
                <button
                  key={t}
                  onClick={() => updateDraft({ templateKey: t })}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                    templateKey === t
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "border-border bg-background text-muted-foreground hover:border-border/80"
                  }`}
                >
                  {t === "europass" ? "Europass" : "Modern"}
                </button>
              ))}
            </div>
          </div>

          {/* Section tabs */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex border-b border-border">
              {([
                { key: "work",      label: "Work",         Icon: BriefcaseBusiness },
                { key: "skills",    label: "Skills",       Icon: Sparkles },
                { key: "languages", label: "Languages",    Icon: Languages },
                { key: "certs",     label: "Certs",        Icon: ScrollText },
              ] as const).map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                    activeTab === key
                      ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              ))}
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
                        <span
                          key={s}
                          className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                        >
                          {s}
                          <button onClick={() => removeSkill(s)} className="text-muted-foreground hover:text-destructive ml-0.5">
                            <X className="size-3" />
                          </button>
                        </span>
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
            </div>
          </div>
        </div>

        {/* ── Preview pane ── */}
        <div className={`flex-1 min-w-0 ${previewVisible ? "block" : "hidden"} lg:block`}>
          <div className="sticky top-4">
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Live Preview · {templateKey === "europass" ? "Europass" : "Modern"}
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-border shadow-sm" style={{ maxHeight: "82vh", overflowY: "auto" }}>
              {templateKey === "europass"
                ? <EuropassPreview cv={draft} />
                : <ModernPreview cv={draft} />
              }
            </div>
          </div>
        </div>
      </div>

      {/* ── Work experience dialog ── */}
      <Dialog open={weDialog.open} onOpenChange={(o) => !o && setWeDialog({ open: false, entry: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {weDialog.entry && (draft.workExperience.find((e) => e.id === weDialog.entry?.id))
                ? "Edit experience"
                : "Add experience"}
            </DialogTitle>
          </DialogHeader>
          {weDialog.entry && (
            <WorkExpForm
              initial={weDialog.entry}
              onSave={saveWeEntry}
              onCancel={() => setWeDialog({ open: false, entry: null })}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── Language dialog ── */}
      <Dialog open={langDialog.open} onOpenChange={(o) => !o && setLangDialog({ open: false, entry: null })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {langDialog.entry && draft.languages.find((l) => l.id === langDialog.entry?.id)
                ? "Edit language"
                : "Add language"}
            </DialogTitle>
          </DialogHeader>
          {langDialog.entry && (
            <LanguageForm
              initial={langDialog.entry}
              onSave={saveLangEntry}
              onCancel={() => setLangDialog({ open: false, entry: null })}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── Certification dialog ── */}
      <Dialog open={certDialog.open} onOpenChange={(o) => !o && setCertDialog({ open: false, entry: null })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {certDialog.entry && draft.certifications.find((c) => c.id === certDialog.entry?.id)
                ? "Edit certification"
                : "Add certification"}
            </DialogTitle>
          </DialogHeader>
          {certDialog.entry && (
            <CertForm
              initial={certDialog.entry}
              onSave={saveCertEntry}
              onCancel={() => setCertDialog({ open: false, entry: null })}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CVPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <CVPageContent />
    </Suspense>
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
        <p className="text-xs text-muted-foreground truncate">{entry.company}{entry.city ? `, ${entry.city}` : ""}</p>
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
        <div className="col-span-2 space-y-1">
          <Label>City</Label>
          <Input value={form.city ?? ""} onChange={(e) => set({ city: e.target.value })} placeholder="e.g. Karachi" />
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
          <input
            type="checkbox"
            id="isCurrent"
            checked={form.isCurrent}
            onChange={(e) => set({ isCurrent: e.target.checked })}
            className="rounded"
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
