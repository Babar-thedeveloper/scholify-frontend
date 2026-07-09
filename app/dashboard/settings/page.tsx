"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Save, Trash2 } from "lucide-react";

export default function SettingsPage() {
  // ─── Account state ─────────────────────────────────────────
  const [email, setEmail] = useState("ayesha@nust.edu.pk");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ─── Notification toggles ─────────────────────────────────
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifWhatsApp, setNotifWhatsApp] = useState(false);
  const [notifApplicationUpdates, setNotifApplicationUpdates] = useState(true);
  const [notifWeeklyDigest, setNotifWeeklyDigest] = useState(true);

  // ─── Privacy ───────────────────────────────────────────────
  const [discoverableByCompanies, setDiscoverableByCompanies] = useState(false);

  function saveAccount() {
    // TODO: PATCH /user/account
    toast.success("Account settings saved");
  }

  function saveNotifications() {
    // TODO: PATCH /user/notification-preferences
    toast.success("Notification preferences saved");
  }

  function savePrivacy() {
    // TODO: PATCH /user/privacy
    toast.success("Privacy settings saved");
  }

  function deleteAccount() {
    // TODO: DELETE /user
    toast.success("Account deletion requested — this is a mock action");
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* ─── ACCOUNT TAB ─────────────────────────────── */}
        <TabsContent value="account">
          <div className="space-y-6">
            {/* Change email */}
            <div className="rounded-xl border border-border bg-white p-6 dark:bg-card">
              <h3 className="mb-4 font-semibold text-foreground">Email address</h3>
              <div className="space-y-1.5">
                <Label htmlFor="settingsEmail">Email</Label>
                <Input
                  id="settingsEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={saveAccount}>
                  <Save className="size-4" /> Save
                </Button>
              </div>
            </div>

            {/* Change password */}
            <div className="rounded-xl border border-border bg-white p-6 dark:bg-card">
              <h3 className="mb-4 font-semibold text-foreground">Change password</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPw">Current password</Label>
                  <Input
                    id="currentPw"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="newPw">New password</Label>
                  <Input
                    id="newPw"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={saveAccount}>
                  <Save className="size-4" /> Update password
                </Button>
              </div>
            </div>

            {/* Delete account */}
            <div className="rounded-xl border border-destructive/30 bg-white p-6 dark:bg-card">
              <h3 className="mb-1 font-semibold text-destructive">Danger zone</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Once deleted, your account and all data cannot be recovered.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="size-4" /> Delete account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account, applications, saved items,
                      and all associated data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteAccount}>
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </TabsContent>

        {/* ─── NOTIFICATIONS TAB ───────────────────────── */}
        <TabsContent value="notifications">
          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card">
            <h3 className="mb-6 font-semibold text-foreground">Notification preferences</h3>
            <div className="space-y-5">
              <ToggleRow
                label="Email notifications"
                description="Receive updates via email"
                checked={notifEmail}
                onCheckedChange={setNotifEmail}
              />
              <ToggleRow
                label="WhatsApp notifications"
                description="Receive reminders and updates on WhatsApp"
                checked={notifWhatsApp}
                onCheckedChange={setNotifWhatsApp}
              />
              <ToggleRow
                label="Application status updates"
                description="Get notified when your application status changes"
                checked={notifApplicationUpdates}
                onCheckedChange={setNotifApplicationUpdates}
              />
              <ToggleRow
                label="Weekly digest"
                description="A weekly summary of new scholarships and deadlines"
                checked={notifWeeklyDigest}
                onCheckedChange={setNotifWeeklyDigest}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={saveNotifications}>
                <Save className="size-4" /> Save preferences
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ─── PRIVACY TAB ─────────────────────────────── */}
        <TabsContent value="privacy">
          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card">
            <h3 className="mb-6 font-semibold text-foreground">Privacy settings</h3>
            <ToggleRow
              label="Allow companies to discover my profile"
              description="When enabled, verified organizations can view your profile and reach out to you directly. Default: off."
              checked={discoverableByCompanies}
              onCheckedChange={setDiscoverableByCompanies}
            />
            <div className="mt-6 flex justify-end">
              <Button onClick={savePrivacy}>
                <Save className="size-4" /> Save
              </Button>
            </div>
          </div>
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
    <label className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}
