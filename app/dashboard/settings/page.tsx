"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Save, Trash2, Loader2, Mail, Lock } from "lucide-react";
import { useUser } from "@/components/auth/UserContext";
import { changePassword } from "@/lib/api/auth";
import {
  deleteMyAccount,
  getMyProfile,
  getMySettings,
  patchMyProfile,
  patchMySettings,
  type PatchSettingsInput,
  type UserSettingsDto,
} from "@/lib/api/users";
import { ApiError } from "@/lib/api/client";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useUser();

  // ─── Account state ─────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  // ─── Notification toggles ─────────────────────────────────
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifWhatsApp, setNotifWhatsApp] = useState(false);
  const [notifApplicationUpdates, setNotifApplicationUpdates] = useState(true);
  const [notifWeeklyDigest, setNotifWeeklyDigest] = useState(true);
  const [notifBusy, setNotifBusy] = useState(false);

  // ─── Privacy ───────────────────────────────────────────────
  const [discoverableByCompanies, setDiscoverableByCompanies] = useState(false);
  const [privacyBusy, setPrivacyBusy] = useState(false);

  // ─── Loading state ─────────────────────────────────────────
  const [loading, setLoading] = useState(true);

  // ─── Load settings + profile on mount ──────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [settings, profile] = await Promise.all([getMySettings(), getMyProfile()]);
        if (cancelled) return;
        setEmail(profile.user.email);
        setNotifEmail(settings.notifEmail);
        setNotifWhatsApp(settings.notifWhatsApp);
        setNotifApplicationUpdates(settings.notifApplicationUpdates);
        setNotifWeeklyDigest(settings.notifWeeklyDigest);
        setDiscoverableByCompanies(profile.discoverable);
      } catch (err) {
        if (!cancelled) toast.error("Failed to load settings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Change password ───────────────────────────────────────
  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setPwBusy(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      toast.success(result.message);
      setCurrentPassword("");
      setNewPassword("");
      // Backend revoked all sessions- log out locally and redirect.
      await logout();
      router.push("/login");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to change password";
      toast.error(msg);
    } finally {
      setPwBusy(false);
    }
  }

  // ─── Save notification preferences ─────────────────────────
  async function saveNotifications() {
    setNotifBusy(true);
    try {
      const input: PatchSettingsInput = {
        notifEmail,
        notifWhatsApp,
        notifApplicationUpdates,
        notifWeeklyDigest,
      };
      const result = await patchMySettings(input);
      setNotifEmail(result.settings.notifEmail);
      setNotifWhatsApp(result.settings.notifWhatsApp);
      setNotifApplicationUpdates(result.settings.notifApplicationUpdates);
      setNotifWeeklyDigest(result.settings.notifWeeklyDigest);
      toast.success("Notification preferences saved");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to save preferences";
      toast.error(msg);
    } finally {
      setNotifBusy(false);
    }
  }

  // ─── Save privacy settings ─────────────────────────────────
  async function savePrivacy() {
    setPrivacyBusy(true);
    try {
      await patchMyProfile({ discoverable: discoverableByCompanies });
      toast.success("Privacy settings saved");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to save privacy settings";
      toast.error(msg);
    } finally {
      setPrivacyBusy(false);
    }
  }

  // ─── Delete account ────────────────────────────────────────
  async function deleteAccount() {
    try {
      const result = await deleteMyAccount();
      toast.success(result.message);
      await logout();
      router.push("/");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to delete account";
      toast.error(msg);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
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
          <div className="grid items-start gap-6 lg:grid-cols-2">
            {/* Email (read-only — tied to account) */}
            <Card className="gap-0 border-border p-6">
              <h3 className="mb-4 font-semibold text-foreground">Email address</h3>
              <div className="space-y-1.5">
                <Label htmlFor="settingsEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="settingsEmail"
                    type="email"
                    value={email}
                    disabled
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your email is tied to your account and cannot be changed here.
                  Contact support if you need to update it.
                </p>
              </div>
            </Card>

            {/* Change password */}
            <Card className="gap-0 border-border p-6">
              <h3 className="mb-4 font-semibold text-foreground">Change password</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPw">Current password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="currentPw"
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="newPw">New password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="newPw"
                      type="password"
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleChangePassword} disabled={pwBusy}>
                  {pwBusy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Update password
                </Button>
              </div>
            </Card>

            {/* Delete account */}
            <Card className="gap-0 border-destructive/30 p-6 lg:col-span-2">
              <h3 className="mb-1 font-semibold text-destructive">Danger zone</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Once deleted, your account and all data cannot be recovered.
              </p>
              <ConfirmModal
                trigger={
                  <Button variant="destructive">
                    <Trash2 className="size-4" /> Delete account
                  </Button>
                }
                title="Are you absolutely sure?"
                description="This will permanently delete your account, applications, saved items, and all associated data. This action cannot be undone."
                confirmText="Yes, delete my account"
                onConfirm={deleteAccount}
              />
            </Card>
          </div>
        </TabsContent>

        {/* ─── NOTIFICATIONS TAB ───────────────────────── */}
        <TabsContent value="notifications">
          <Card className="gap-0 border-border p-6">
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
              <Button onClick={saveNotifications} disabled={notifBusy}>
                {notifBusy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save preferences
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ─── PRIVACY TAB ─────────────────────────────── */}
        <TabsContent value="privacy">
          <Card className="gap-0 border-border p-6">
            <h3 className="mb-6 font-semibold text-foreground">Privacy settings</h3>
            <ToggleRow
              label="Allow companies to discover my profile"
              description="When enabled, verified organizations can view your profile and reach out to you directly. Default: off."
              checked={discoverableByCompanies}
              onCheckedChange={setDiscoverableByCompanies}
            />
            <div className="mt-6 flex justify-end">
              <Button onClick={savePrivacy} disabled={privacyBusy}>
                {privacyBusy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save
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
