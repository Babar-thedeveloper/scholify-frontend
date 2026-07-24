"use client";

import { useCallback, useRef, useState } from "react";
import { AlertTriangle, FileUp, Sparkles, Check } from "lucide-react";
import { Modal, ModalBody, ModalHeader } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { extractPdfText, parseResumeText, type ParsedResume } from "@/lib/cv/resume-parser";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  /** Called when the user confirms — merges skills + work experience into the CV. */
  onApply: (result: ParsedResume) => void;
}

export function ResumeImportModal({ open, onOpenChange, onApply }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<ParsedResume | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const reset = useCallback(() => {
    setParsing(false);
    setResult(null);
    setError(null);
    setFileName("");
  }, []);

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    setFileName(file.name);
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("That file is larger than 8 MB. Please upload a smaller PDF.");
      return;
    }
    setParsing(true);
    try {
      const text = await extractPdfText(file);
      if (text.trim().length < 40) {
        setError("Couldn't read text from this PDF (it may be a scanned image). Try a text-based PDF.");
        return;
      }
      setResult(parseResumeText(text));
    } catch {
      setError("Failed to read the PDF. Please try another file.");
    } finally {
      setParsing(false);
    }
  }

  function close(o: boolean) {
    if (!o) reset();
    onOpenChange(o);
  }

  const found = result
    ? result.skills.length + result.workExperience.length + result.languages.length +
      result.certifications.length + result.customSections.reduce((n, s) => n + s.items.length, 0)
    : 0;

  return (
    <Modal open={open} onOpenChange={close} size="md">
      <ModalHeader
        title="Import from resume"
        description="Upload your existing PDF resume — we'll read it in your browser and pre-fill what we can. Nothing is uploaded to a server."
      />
      <ModalBody className="overflow-x-hidden">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />

        {/* Dropzone / picker */}
        {!result && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={parsing}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-10 text-center transition-colors hover:border-emerald-400 hover:bg-emerald-50/40 disabled:opacity-60 dark:hover:bg-emerald-500/5"
          >
            {parsing ? (
              <>
                <Spinner size="lg" />
                <p className="text-sm font-medium text-foreground">Reading {fileName}…</p>
              </>
            ) : (
              <>
                <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15">
                  <FileUp className="size-5" />
                </span>
                <p className="text-sm font-medium text-foreground">Click to choose a PDF resume</p>
                <p className="text-xs text-muted-foreground">Text-based PDF, up to 8 MB</p>
              </>
            )}
          </button>
        )}

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle className="size-4 shrink-0" /> {error}
          </div>
        )}

        {/* Review */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Sparkles className="mt-0.5 size-4 shrink-0" />
              <p className="min-w-0 break-words">
                Found {found} item{found === 1 ? "" : "s"} in{" "}
                <span className="font-medium break-all">{fileName}</span>. Review below, then apply.
              </p>
            </div>

            {(result.fullName || result.email || result.phone) && (
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm break-words">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Detected contact</p>
                {result.fullName && <p><span className="text-muted-foreground">Name:</span> {result.fullName}</p>}
                {result.email && <p className="break-all"><span className="text-muted-foreground">Email:</span> {result.email}</p>}
                {result.phone && <p><span className="text-muted-foreground">Phone:</span> {result.phone}</p>}
                <p className="mt-1.5 text-xs text-muted-foreground">Name, email &amp; phone come from your Profile — update them there if needed.</p>
              </div>
            )}

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Skills ({result.skills.length})
              </p>
              {result.skills.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {result.skills.map((s) => (
                    <span key={s} className="max-w-full break-words rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{s}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No skills detected.</p>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Work experience ({result.workExperience.length})
              </p>
              {result.workExperience.length ? (
                <div className="space-y-1.5">
                  {result.workExperience.map((w) => (
                    <div key={w.id} className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
                      <p className="font-medium break-words">{w.title}{w.company ? ` · ${w.company}` : ""}</p>
                      <p className="text-xs text-muted-foreground">{w.startYear}{w.isCurrent ? " – Present" : w.endYear ? ` – ${w.endYear}` : ""}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No work experience detected.</p>
              )}
              <p className="mt-1.5 text-xs text-muted-foreground">Dates are a best guess — review and fix them after importing.</p>
            </div>

            {result.languages.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Languages ({result.languages.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.languages.map((l) => (
                    <span key={l.id} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{l.language} · {l.level}</span>
                  ))}
                </div>
              </div>
            )}

            {result.certifications.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Certifications ({result.certifications.length})</p>
                <div className="space-y-1">
                  {result.certifications.map((c) => (
                    <p key={c.id} className="break-words text-sm text-muted-foreground">{c.name}{c.year ? ` · ${c.year}` : ""}</p>
                  ))}
                </div>
              </div>
            )}

            {result.customSections.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Other sections ({result.customSections.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.customSections.map((s) => (
                    <span key={s.id} className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      {s.title} ({s.items.length})
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => reset()}>Choose another</Button>
              <Button
                disabled={found === 0}
                className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => { onApply(result); close(false); }}
              >
                <Check className="size-4" /> Apply to CV
              </Button>
            </div>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}
