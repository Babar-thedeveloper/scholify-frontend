"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  getMyOrg,
  patchMyOrg,
  type OrgProfileDto,
} from "@/lib/api/organizations";
import { handleApiError } from "@/lib/api/handle-error";

const TEXTAREA_CLASS = "";

const ORG_KIND_OPTIONS = [
  { value: "scholarship_provider", label: "Scholarship Provider" },
  { value: "internship_provider",  label: "Internship Provider" },
  { value: "government",           label: "Government" },
  { value: "ngo",                  label: "NGO" },
  { value: "university",           label: "University" },
  { value: "corporate",            label: "Corporate" },
];

export default function OrgProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [profile, setProfile] = useState<OrgProfileDto | null>(null);

  // ─── Form state ────────────────────────────────────────────
  const [name, setName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [kind, setKind] = useState("");
  const [website, setWebsite] = useState("");

  const [addressLine1, setAddressLine1] = useState("");
  const [addressCity, setAddressCity] = useState("");

  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const p = await getMyOrg();
        setProfile(p);
        setName(p.name ?? "");
        setLegalName(p.legalName ?? "");
        setDescription(p.description ?? "");
        setIndustry(p.industry ?? "");
        setKind(p.kind ?? "");
        setWebsite(p.website ?? "");
        setAddressLine1(p.address.line1 ?? "");
        setAddressCity(p.address.city ?? "");
        setLinkedin(p.social.linkedin ?? "");
        setTwitter(p.social.twitter ?? "");
        setInstagram(p.social.instagram ?? "");
        setFacebook(p.social.facebook ?? "");
        setYoutube(p.social.youtube ?? "");
      } catch (err) {
        handleApiError(err, "Couldn't load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function saveSection(section: "branding" | "presence" | "contact") {
    setSaving(section);
    try {
      let updated: OrgProfileDto;
      if (section === "branding") {
        updated = await patchMyOrg({
          name: name || undefined,
          legalName: legalName || null,
          description: description || null,
          industry: industry || null,
          kind: kind || undefined,
        });
      } else if (section === "presence") {
        updated = await patchMyOrg({
          website: website || null,
          social: { linkedin, twitter, instagram, facebook, youtube },
        });
      } else {
        updated = await patchMyOrg({
          address: { line1: addressLine1 || null, city: addressCity || null },
        });
      }
      setProfile(updated);
      toast.success("Saved");
    } catch (err) {
      handleApiError(err, "Couldn't save changes.");
    } finally {
      setSaving(null);
    }
  }

  const initials = (profile?.name ?? name)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Spinner size="sm" className="mr-2" /> Loading profile…
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            Organization profile
            {profile?.verified && (
              <Badge variant="secondary" className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                <BadgeCheck className="size-3.5" /> Verified
              </Badge>
            )}
          </span>
        }
        subtitle="Manage how your organization appears to students"
      />

      <div className="space-y-6">
        {/* ─── Branding ─────────────────────────────────── */}
        <Card className="border-border gap-0 p-5">
          <h3 className="mb-4 font-semibold text-foreground">Branding</h3>

          <div className="mb-5 flex items-center gap-4">
            <span className="flex size-16 items-center justify-center rounded-full bg-violet-100 text-2xl font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              {initials}
            </span>
            <p className="text-sm text-muted-foreground">
              Logo upload coming in Phase 7 (Documents).
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="orgName">Organization name</Label>
              <Input id="orgName" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="orgLegalName">Legal name <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="orgLegalName" value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="As registered with the government" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="orgDescription">Description / about</Label>
              <Textarea
                id="orgDescription"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={TEXTAREA_CLASS}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="orgKind">Organization type</Label>
                <Select value={kind} onValueChange={setKind}>
                  <SelectTrigger id="orgKind" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORG_KIND_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="orgIndustry">Industry / sector</Label>
                <Input id="orgIndustry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Technology, Education…" />
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button onClick={() => saveSection("branding")} disabled={saving === "branding"}>
              {saving === "branding" ? <Spinner size="sm" /> : <Save className="size-4" />}
              Save changes
            </Button>
          </div>
        </Card>

        {/* ─── Online presence ──────────────────────────── */}
        <Card className="border-border gap-0 p-5">
          <h3 className="mb-4 font-semibold text-foreground">Online presence</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                { id: "website",   label: "Website",      value: website,   set: setWebsite },
                { id: "linkedin",  label: "LinkedIn",     value: linkedin,  set: setLinkedin },
                { id: "twitter",   label: "Twitter / X",  value: twitter,   set: setTwitter },
                { id: "instagram", label: "Instagram",    value: instagram, set: setInstagram },
                { id: "facebook",  label: "Facebook",     value: facebook,  set: setFacebook },
                { id: "youtube",   label: "YouTube",      value: youtube,   set: setYoutube },
              ] as const
            ).map(({ id, label, value, set }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id}>{label}</Label>
                <Input id={id} type="url" value={value} onChange={(e) => set(e.target.value)} placeholder="https://" />
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-end">
            <Button onClick={() => saveSection("presence")} disabled={saving === "presence"}>
              {saving === "presence" ? <Spinner size="sm" /> : <Save className="size-4" />}
              Save changes
            </Button>
          </div>
        </Card>

        {/* ─── Contact / address ────────────────────────── */}
        <Card className="border-border gap-0 p-5">
          <h3 className="mb-4 font-semibold text-foreground">Office address</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="addrLine1">Street / building</Label>
              <Input id="addrLine1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addrCity">City</Label>
              <Input id="addrCity" value={addressCity} onChange={(e) => setAddressCity(e.target.value)} />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button onClick={() => saveSection("contact")} disabled={saving === "contact"}>
              {saving === "contact" ? <Spinner size="sm" /> : <Save className="size-4" />}
              Save changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
