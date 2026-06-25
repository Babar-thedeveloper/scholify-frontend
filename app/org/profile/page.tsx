"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Camera, Save } from "lucide-react";
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
import { PageHeader } from "@/components/dashboard/PageHeader";

const TEXTAREA_CLASS =
  "flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export default function OrgProfilePage() {
  // ─── Branding ──────────────────────────────────────────────
  const [name, setName] = useState("Daraz Pakistan");
  const [description, setDescription] = useState(
    "Daraz is Pakistan's leading online marketplace, connecting thousands of sellers with millions of customers across the region."
  );
  const [industry, setIndustry] = useState("E-commerce");

  // ─── Online presence ───────────────────────────────────────
  const [website, setWebsite] = useState("https://daraz.pk");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/company/daraz");
  const [twitter, setTwitter] = useState("https://x.com/darazpk");
  const [instagram, setInstagram] = useState("https://instagram.com/darazpk");
  const [facebook, setFacebook] = useState("https://facebook.com/darazpk");

  // ─── Contact ───────────────────────────────────────────────
  const [address, setAddress] = useState(
    "Daraz Head Office, Sector 15, Korangi Industrial Area, Karachi"
  );
  const [phone, setPhone] = useState("+92 21 111 132 729");
  const [contactEmail, setContactEmail] = useState("careers@daraz.pk");

  function saveSection(label: string) {
    // TODO: API — persist this section
    toast.success("Saved");
    void label;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            Organization profile
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
              <BadgeCheck className="size-3.5" /> Verified
            </span>
          </span>
        }
        subtitle="Manage how your organization appears to students"
      />

      <div className="space-y-6">
        {/* ─── Branding ─────────────────────────────────── */}
        <section className="rounded-xl border border-border bg-white p-5 dark:bg-card">
          <h3 className="mb-4 font-semibold text-foreground">Branding</h3>

          <div className="mb-5 flex items-center gap-4">
            <div className="relative">
              <span className="flex size-16 items-center justify-center rounded-full bg-violet-100 text-2xl font-semibold text-violet-700">
                D
              </span>
              <button
                type="button"
                onClick={() => toast.success("Saved")}
                className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-sm hover:text-foreground dark:bg-card"
                aria-label="Upload logo"
              >
                <Camera className="size-3.5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a square logo. PNG or JPG, up to 2MB.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="orgName">Organization name</Label>
              <Input
                id="orgName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="orgDescription">Description / about</Label>
              <textarea
                id="orgDescription"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={TEXTAREA_CLASS}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="orgIndustry">Industry / sector</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="orgIndustry" className="w-full">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Non-profit">Non-profit</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button onClick={() => saveSection("branding")}>
              <Save className="size-4" /> Save changes
            </Button>
          </div>
        </section>

        {/* ─── Online presence ──────────────────────────── */}
        <section className="rounded-xl border border-border bg-white p-5 dark:bg-card">
          <h3 className="mb-4 font-semibold text-foreground">Online presence</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input
                id="twitter"
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button onClick={() => saveSection("presence")}>
              <Save className="size-4" /> Save changes
            </Button>
          </div>
        </section>

        {/* ─── Contact ──────────────────────────────────── */}
        <section className="rounded-xl border border-border bg-white p-5 dark:bg-card">
          <h3 className="mb-4 font-semibold text-foreground">Contact</h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="address">Office address</Label>
              <textarea
                id="address"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={TEXTAREA_CLASS}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactEmail">Public contact email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button onClick={() => saveSection("contact")}>
              <Save className="size-4" /> Save changes
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
