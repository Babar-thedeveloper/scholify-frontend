"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Building,
  Globe,
  Mail,
  MapPin,
  Camera,
  Linkedin,
  Twitter,
  ExternalLink,
  Save,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function OrgProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "Daraz Pakistan",
    description: "Daraz is Pakistan's leading online marketplace, connecting thousands of sellers with millions of customers across the region. We are dedicated to providing a premium e-commerce experience and fostering tech talent in the country.",
    industry: "E-commerce & Retail",
    website: "https://careers.daraz.pk",
    email: "careers@daraz.pk",
    phone: "+92 (21) 111-132-729",
    city: "Karachi",
    address: "Daraz Head Office, Survey No. 231, Sector 15, Korangi Industrial Area, Karachi",
    linkedin: "https://linkedin.com/company/daraz",
    twitter: "https://twitter.com/darazpk",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Organization profile updated successfully!");
    setIsSaving(false);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Organization Profile"
        subtitle="Manage your company details, logo, and contact information shown to applicants"
      />

      <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column: Logo and Verification Status */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-5 text-center dark:bg-card">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-4">
              Company Logo
            </Label>
            
            <div className="group relative mx-auto mb-4 flex size-28 items-center justify-center rounded-2xl bg-slate-100 border border-border hover:bg-slate-200/50 dark:bg-slate-900 dark:hover:bg-slate-800">
              <span className="text-2xl font-bold text-primary">DP</span>
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="size-5 text-white" />
              </button>
            </div>
            
            <p className="text-[11px] text-muted-foreground">
              PNG or JPG up to 2MB. Recommended resolution 400x400.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-emerald-50/50 p-5 dark:bg-emerald-950/10 border-l-4 border-l-emerald-500">
            <div className="flex items-start gap-3">
              <ShieldCheck className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-emerald-950 dark:text-emerald-300">
                  Verified Employer
                </h4>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-400/70 mt-1">
                  Your profile has been verified. All published opportunities will display a verified badge to applicants.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Fields */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile details */}
          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Profile Details
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Organization Name *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={profile.name}
                  onChange={handleChange}
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="industry">Industry *</Label>
                <Input
                  id="industry"
                  name="industry"
                  required
                  value={profile.industry}
                  onChange={handleChange}
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">About the Organization *</Label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                value={profile.description}
                onChange={handleChange}
                className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-xs placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30"
              />
            </div>
          </div>

          {/* Contact and Links */}
          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Contact & Links
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="website">Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={profile.website}
                    onChange={handleChange}
                    className="h-10 pl-9 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Contact Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={profile.email}
                    onChange={handleChange}
                    className="h-10 pl-9 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="city">City *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input
                    id="city"
                    name="city"
                    required
                    value={profile.city}
                    onChange={handleChange}
                    className="h-10 pl-9 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                name="address"
                required
                value={profile.address}
                onChange={handleChange}
                className="h-10 text-sm"
              />
            </div>
          </div>

          {/* Social Profiles */}
          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Social Channels
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin">LinkedIn Page</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    value={profile.linkedin}
                    onChange={handleChange}
                    className="h-10 pl-9 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="twitter">Twitter / X Profile</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input
                    id="twitter"
                    name="twitter"
                    type="url"
                    value={profile.twitter}
                    onChange={handleChange}
                    className="h-10 pl-9 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="size-4 mr-2" />
              {isSaving ? "Saving details..." : "Save Profile Details"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
