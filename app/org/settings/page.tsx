"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function OrgSettingsPage() {
  // ─── Account ───────────────────────────────────────────────
  const [email, setEmail] = useState("careers@daraz.pk");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ─── Notification toggles ──────────────────────────────────
  const [newApplicant, setNewApplicant] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [expiryReminders, setExpiryReminders] = useState(true);

  function saveEmail() {
    // TODO: API- PATCH org email
    toast.success("Email updated");
  }

  function savePassword() {
    // TODO: API- PATCH org password
    toast.success("Password updated");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function deactivate() {
    // TODO: API- deactivate organization
    toast.success("Organization deactivation requested- this is a mock action");
  }

  function saveNotifications() {
    // TODO: API- PATCH org notification preferences
    toast.success("Notification preferences saved");
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your organization account and preferences" />

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* ─── ACCOUNT ──────────────────────────────────── */}
        <TabsContent value="account">
          <div className="space-y-6">
            {/* Change email */}
            <Card className="border-border gap-0 p-5">
              <h3 className="mb-4 font-semibold text-foreground">Email address</h3>
              <div className="space-y-1.5">
                <Label htmlFor="orgEmail">Email</Label>
                <Input
                  id="orgEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={saveEmail}>
                  <Save className="size-4" /> Save
                </Button>
              </div>
            </Card>

            {/* Change password */}
            <Card className="border-border gap-0 p-5">
              <h3 className="mb-4 font-semibold text-foreground">Change password</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPw">Current password</Label>
                  <Input
                    id="currentPw"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="newPw">New password</Label>
                    <Input
                      id="newPw"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPw">Confirm new password</Label>
                    <Input
                      id="confirmPw"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={savePassword}>
                  <Save className="size-4" /> Save
                </Button>
              </div>
            </Card>

            <Separator />

            {/* Deactivate */}
            <Card className="border-destructive/30 gap-0 p-5">
              <h3 className="mb-1 font-semibold text-destructive">Deactivate organization</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Deactivating will unpublish all your postings and revoke team access. This
                can be undone by contacting support.
              </p>
              <ConfirmModal
                trigger={
                  <Button variant="destructive">
                    <Trash2 className="size-4" /> Deactivate organization
                  </Button>
                }
                title="Deactivate this organization?"
                description="All postings will be unpublished and team members will lose access. This action can only be reversed by contacting support."
                confirmText="Yes, deactivate"
                onConfirm={deactivate}
              />
            </Card>
          </div>
        </TabsContent>

        {/* ─── NOTIFICATIONS ────────────────────────────── */}
        <TabsContent value="notifications">
          <Card className="border-border gap-0 p-5">
            <h3 className="mb-6 font-semibold text-foreground">Notification preferences</h3>
            <div className="space-y-5">
              <ToggleRow
                label="New applicant alerts"
                description="Get notified each time a student applies to one of your postings"
                checked={newApplicant}
                onCheckedChange={setNewApplicant}
              />
              <ToggleRow
                label="Daily applicant summary"
                description="A once-a-day roundup of new applicants across all postings"
                checked={dailySummary}
                onCheckedChange={setDailySummary}
              />
              <ToggleRow
                label="Weekly summary"
                description="A weekly overview of your postings and applicant activity"
                checked={weeklySummary}
                onCheckedChange={setWeeklySummary}
              />
              <ToggleRow
                label="Posting expiry reminders"
                description="Reminders before a posting deadline closes"
                checked={expiryReminders}
                onCheckedChange={setExpiryReminders}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={saveNotifications}>
                <Save className="size-4" /> Save preferences
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Toggle row helper ──────────────────────────────────────
function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <Label className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </Label>
  );
}
