"use client";
// ─────────────────────────────────────────────────────────────
// DownloadCvButton- renders the PDF client-side via
// @react-pdf/renderer and triggers a browser download.
//
// Loaded dynamically (no SSR) from page.tsx because
// @react-pdf/renderer uses browser-only APIs.
// ─────────────────────────────────────────────────────────────
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { CvDto } from "@/lib/api/cv";
import EuropassPdf from "./EuropassPdf";
import ModernPdf from "./ModernPdf";

interface Props {
  cv: CvDto;
  templateKey: "europass" | "modern";
}

export default function DownloadCvButton({ cv, templateKey }: Props) {
  const [generating, setGenerating] = useState(false);

  async function handleDownload() {
    setGenerating(true);
    try {
      const doc = templateKey === "europass"
        ? <EuropassPdf cv={cv} />
        : <ModernPdf  cv={cv} />;

      const blob = await pdf(doc).toBlob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      const name = cv.fullName
        ? `${cv.fullName.replace(/\s+/g, "_")}_CV.pdf`
        : "Scholify_CV.pdf";
      a.href     = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Button size="lg" onClick={handleDownload} disabled={generating}>
      {generating
        ? <Spinner size="sm" />
        : <Download className="size-4" />}
      {generating ? "Generating…" : "Download PDF"}
    </Button>
  );
}
