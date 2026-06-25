"use client";

import { useState } from "react";
import { BadgeCheck, Camera, Check, Loader2, Save, ShieldCheck } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard/PageHeader";

// ─── Mock profile state ─────────────────────────────────────
const PROFILE_PERCENT = 85;

const PROVINCES = [
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Kashmir",
];

const DEGREE_LEVELS = [
  "Undergraduate",
  "Graduate (Masters)",
  "PhD",
  "Diploma / Certificate",
];

const YEAR_OPTIONS = ["1st year", "2nd year", "3rd year", "4th year", "5th year"];

export default function ProfilePage() {
  // ─── Section 1: Personal Info ──────────────────────────────
  const [personal, setPersonal] = useState({
    fullName: "Ayesha Khan",
    dob: "2004-03-15",
    phone: "+92 300 1234567",
  });

  // ─── Section 2: Academic ───────────────────────────────────
  const [academic, setAcademic] = useState({
    university: "NUST",
    degreeLevel: "Undergraduate",
    currentYear: "3rd year",
    fieldOfStudy: "Computer Science",
    gpa: "3.8",
    graduationYear: "2027",
  });

  // ─── Section 3: Address ────────────────────────────────────
  const [address, setAddress] = useState({
    city: "Islamabad",
    province: "Islamabad Capital Territory",
    postalAddress: "H-12, Islamabad",
  });

  // ─── Section 4: Verification ───────────────────────────────
  const [verificationEmail, setVerificationEmail] = useState("ayesha@nust.edu.pk");
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  function saveSection(section: string) {
    // TODO: PATCH /profile/:section when API exists
    toast.success(`${section} saved`);
  }

  function verify() {
    setVerifying(true);
    // Simulate verification delay
    setTimeout(() => {
      setVerified(true);
      setVerifying(false);
      toast.success("Email verified successfully!");
    }, 1500);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="My Profile"
        subtitle="Keep your profile up to date to get better matches"
      />

      {/* Completion bar */}
      <div className="mb-8 rounded-xl border border-border bg-white p-5 dark:bg-card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Profile completion</p>
          <span className="text-sm font-bold text-emerald-600">{PROFILE_PERCENT}%</span>
        </div>
        <Progress value={PROFILE_PERCENT} className="mt-2 h-2" />
        <p className="mt-2 text-xs text-muted-foreground">
          Complete all fields to reach 100% and improve your chances.
        </p>
      </div>

      {/* Section 1 — Personal Info */}
      <section className="mb-6 rounded-xl border border-border bg-white p-6 dark:bg-card">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Personal Information</h2>

        {/* Avatar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <span className="flex size-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              AK
            </span>
            <button
              className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-sm dark:border-card"
              aria-label="Upload photo"
              onClick={() => toast.info("Photo upload — coming soon")}
            >
              <Camera className="size-4" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Profile photo</p>
            <p className="text-xs text-muted-foreground">JPG, PNG. Max 2 MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              value={personal.fullName}
              onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dob">Date of birth</Label>
            <Input
              id="dob"
              type="date"
              value={personal.dob}
              onChange={(e) => setPersonal({ ...personal, dob: e.target.value })}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="phone">Phone number / WhatsApp</Label>
            <Input
              id="phone"
              type="tel"
              value={personal.phone}
              onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => saveSection("Personal information")}>
            <Save className="size-4" /> Save changes
          </Button>
        </div>
      </section>

      {/* Section 2 — Academic */}
      <section className="mb-6 rounded-xl border border-border bg-white p-6 dark:bg-card">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Academic Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              value={academic.university}
              onChange={(e) => setAcademic({ ...academic, university: e.target.value })}
              placeholder="e.g. NUST, LUMS"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Degree level</Label>
            <Select
              value={academic.degreeLevel}
              onValueChange={(v) => setAcademic({ ...academic, degreeLevel: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEGREE_LEVELS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Current year</Label>
            <Select
              value={academic.currentYear}
              onValueChange={(v) => setAcademic({ ...academic, currentYear: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fieldOfStudy">Field of study / Major</Label>
            <Input
              id="fieldOfStudy"
              value={academic.fieldOfStudy}
              onChange={(e) => setAcademic({ ...academic, fieldOfStudy: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gpa">CGPA / GPA</Label>
            <Input
              id="gpa"
              value={academic.gpa}
              onChange={(e) => setAcademic({ ...academic, gpa: e.target.value })}
              placeholder="e.g. 3.8"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gradYear">Expected graduation year</Label>
            <Input
              id="gradYear"
              value={academic.graduationYear}
              onChange={(e) => setAcademic({ ...academic, graduationYear: e.target.value })}
              placeholder="e.g. 2027"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => saveSection("Academic details")}>
            <Save className="size-4" /> Save changes
          </Button>
        </div>
      </section>

      {/* Section 3 — Address */}
      <section className="mb-6 rounded-xl border border-border bg-white p-6 dark:bg-card">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Address & Contact</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Province</Label>
            <Select
              value={address.province}
              onValueChange={(v) => setAddress({ ...address, province: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="postalAddress">Postal address</Label>
            <Input
              id="postalAddress"
              value={address.postalAddress}
              onChange={(e) => setAddress({ ...address, postalAddress: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => saveSection("Address & contact")}>
            <Save className="size-4" /> Save changes
          </Button>
        </div>
      </section>

      {/* Section 4 — Verification */}
      <section className="mb-6 rounded-xl border border-border bg-white p-6 dark:bg-card">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Verification</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="verifyEmail">University email (.edu.pk)</Label>
            <Input
              id="verifyEmail"
              type="email"
              value={verificationEmail}
              onChange={(e) => setVerificationEmail(e.target.value)}
              placeholder="you@university.edu.pk"
              disabled={verified}
            />
          </div>
          <Button
            onClick={verify}
            disabled={verified || verifying}
            className="shrink-0"
          >
            {verifying ? (
              <Loader2 className="size-4 animate-spin" />
            ) : verified ? (
              <Check className="size-4" />
            ) : (
              <ShieldCheck className="size-4" />
            )}
            {verified ? "Verified" : verifying ? "Verifying…" : "Verify email"}
          </Button>
        </div>
        {verified && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <BadgeCheck className="size-4" /> Verified student
          </div>
        )}
      </section>
    </div>
  );
}
