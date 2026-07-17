"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Camera, Check, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
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
import {
  DEGREE_LABEL,
  PROVINCE_LABEL,
  getMyProfile,
  patchMyProfile,
  type DegreeLevelKey,
  type ProfileDto,
  type ProvinceKey,
} from "@/lib/api/users";
import { handleApiError } from "@/lib/api/handle-error";

const DEGREE_KEYS: DegreeLevelKey[] = ["undergraduate", "masters", "phd", "diploma"];
const PROVINCE_KEYS: ProvinceKey[] = [
  "punjab", "sindh", "kpk", "balochistan", "islamabad", "gb", "ajk",
];
const YEAR_OPTIONS = [1, 2, 3, 4, 5];

function initials(name: string | null, email: string): string {
  const base = name?.trim() || email.split("@")[0] || "?";
  const parts = base.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  // Section-local editable state, hydrated after fetch.
  const [personal, setPersonal] = useState({ fullName: "", dob: "", phone: "", whatsapp: "" });
  const [academic, setAcademic] = useState({
    university: "",
    degreeLevel: "" as DegreeLevelKey | "",
    currentYear: "",
    fieldOfStudy: "",
    gpa: "",
    graduationYear: "",
  });
  const [address, setAddress] = useState({
    city: "",
    province: "" as ProvinceKey | "",
    postalAddress: "",
  });

  // Verification (backend flow lands later; UI reflects current state).
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verifying, setVerifying] = useState(false);

  // ─── Load ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await getMyProfile();
        if (cancelled) return;
        setProfile(p);
        setPersonal({
          fullName: p.personal.fullName ?? "",
          dob: p.personal.dateOfBirth ?? "",
          phone: p.personal.phone ?? "",
          whatsapp: p.personal.whatsapp ?? "",
        });
        setAcademic({
          university: p.academic.universityName ?? p.academic.universityOther ?? "",
          degreeLevel: p.academic.degreeLevel ?? "",
          currentYear: p.academic.currentYear != null ? String(p.academic.currentYear) : "",
          fieldOfStudy: p.academic.fieldOfStudyName ?? "",
          gpa: p.academic.cgpa ?? "",
          graduationYear:
            p.academic.expectedGraduationYear != null
              ? String(p.academic.expectedGraduationYear)
              : "",
        });
        setAddress({
          city: p.address.city ?? "",
          province: p.address.provinceKey ?? "",
          postalAddress: p.address.line1 ?? "",
        });
        setVerificationEmail(p.user.email);
      } catch (err) {
        if (cancelled) return;
        handleApiError(err, "Couldn't load your profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Section save handlers ──────────────────────────────
  async function savePersonal() {
    setSavingSection("personal");
    try {
      const { profile: p, message } = await patchMyProfile({
        personal: {
          fullName: personal.fullName || null,
          dateOfBirth: personal.dob || null,
          phone: personal.phone || null,
          whatsapp: personal.whatsapp || null,
        },
      });
      setProfile(p);
      toast.success(message);
    } catch (err) {
      handleApiError(err, "Couldn't save.");
    } finally {
      setSavingSection(null);
    }
  }

  async function saveAcademic() {
    setSavingSection("academic");
    try {
      const cgpa = academic.gpa ? Number(academic.gpa) : null;
      const gradYear = academic.graduationYear ? Number(academic.graduationYear) : null;
      const currentYear = academic.currentYear ? Number(academic.currentYear) : null;

      const { profile: p, message } = await patchMyProfile({
        academic: {
          universityOther: academic.university || null,
          degreeLevel: academic.degreeLevel || null,
          currentYear,
          cgpa: cgpa != null && !Number.isNaN(cgpa) ? cgpa : null,
          expectedGraduationYear: gradYear,
          fieldOfStudyOther: academic.fieldOfStudy || null,
        },
      });
      setProfile(p);
      toast.success(message);
    } catch (err) {
      handleApiError(err, "Couldn't save.");
    } finally {
      setSavingSection(null);
    }
  }

  async function saveAddress() {
    setSavingSection("address");
    try {
      const { profile: p, message } = await patchMyProfile({
        address: {
          line1: address.postalAddress || null,
          city: address.city || null,
          province: address.province || null,
          postalCode: null,
        },
      });
      setProfile(p);
      toast.success(message);
    } catch (err) {
      handleApiError(err, "Couldn't save.");
    } finally {
      setSavingSection(null);
    }
  }

  function verify() {
    // Real .edu.pk flow ships in a later phase — for now this is a UI-only stub.
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      toast.info("Student verification will be available soon.");
    }, 900);
  }

  const initialsStr = useMemo(() => {
    if (!profile) return "??";
    return initials(personal.fullName, profile.user.email);
  }, [personal.fullName, profile]);

  const verified = profile?.verification.isVerifiedStudent ?? false;
  const completion = profile?.completionPercent ?? 0;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Spinner size="md" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Couldn&apos;t load your profile. Try refreshing the page.
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Keep your profile up to date to get better matches"
      />

      {/* Completion bar */}
      <Card className="mb-8 gap-0 border-border p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Profile completion</p>
          <span className="text-sm font-bold text-emerald-600">{completion}%</span>
        </div>
        <Progress value={completion} className="mt-2 h-2" />
        <p className="mt-2 text-xs text-muted-foreground">
          Complete all fields to reach 100% and improve your chances.
        </p>
      </Card>

      {/* Section 1 — Personal Info */}
      <Card className="mb-6 gap-0 border-border p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Personal Information</h2>

        {/* Avatar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <span className="flex size-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              {initialsStr}
            </span>
            <Button
              variant="default"
              size="icon-sm"
              className="absolute -bottom-1 -right-1 rounded-full border-2 border-white shadow-sm dark:border-card"
              aria-label="Upload photo"
              onClick={() => toast.info("Photo upload — coming soon")}
            >
              <Camera className="size-4" />
            </Button>
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
          <Button onClick={savePersonal} disabled={savingSection === "personal"}>
            {savingSection === "personal" ? (
              <Spinner size="sm" />
            ) : (
              <Save className="size-4" />
            )}
            Save changes
          </Button>
        </div>
      </Card>

      {/* Section 2 — Academic */}
      <Card className="mb-6 gap-0 border-border p-6">
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
              onValueChange={(v) => setAcademic({ ...academic, degreeLevel: v as DegreeLevelKey })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {DEGREE_KEYS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {DEGREE_LABEL[k]}
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
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y === 1 ? "1st year" : y === 2 ? "2nd year" : y === 3 ? "3rd year" : `${y}th year`}
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
              inputMode="decimal"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gradYear">Expected graduation year</Label>
            <Input
              id="gradYear"
              value={academic.graduationYear}
              onChange={(e) => setAcademic({ ...academic, graduationYear: e.target.value })}
              placeholder="e.g. 2027"
              inputMode="numeric"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={saveAcademic} disabled={savingSection === "academic"}>
            {savingSection === "academic" ? (
              <Spinner size="sm" />
            ) : (
              <Save className="size-4" />
            )}
            Save changes
          </Button>
        </div>
      </Card>

      {/* Section 3 — Address */}
      <Card className="mb-6 gap-0 border-border p-6">
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
              onValueChange={(v) => setAddress({ ...address, province: v as ProvinceKey })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCE_KEYS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {PROVINCE_LABEL[k]}
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
          <Button onClick={saveAddress} disabled={savingSection === "address"}>
            {savingSection === "address" ? (
              <Spinner size="sm" />
            ) : (
              <Save className="size-4" />
            )}
            Save changes
          </Button>
        </div>
      </Card>

      {/* Section 4 — Verification (real .edu.pk flow ships later) */}
      <Card className="mb-6 gap-0 border-border p-6">
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
              <Spinner size="sm" />
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
      </Card>
    </div>
  );
}
