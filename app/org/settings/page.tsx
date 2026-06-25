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
import {
  CreditCard,
  Bell,
  Lock,
  Mail,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export default function OrgSettingsPage() {
  const [email, setEmail] = useState("careers@daraz.pk");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Notifications
  const [notifNewApplicant, setNotifNewApplicant] = useState(true);
  const [notifDailyDigest, setNotifDailyDigest] = useState(false);
  const [notifSystemAlerts, setNotifSystemAlerts] = useState(true);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Account settings updated successfully!");
    setIsSaving(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsSaving(false);
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Notification preferences saved!");
    setIsSaving(false);
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requested. Our support team will contact you.");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Settings"
        subtitle="Manage your organization portal configurations, preferences, and billings"
      />

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="account">Account & Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing & Plan</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          {/* Email Settings */}
          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2 mb-4 flex items-center gap-2">
              <Mail className="size-4 text-primary" /> Email Address
            </h3>
            <form onSubmit={handleUpdateAccount} className="space-y-4">
              <div className="space-y-1.5 max-w-md">
                <Label htmlFor="email">Portal Primary Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
              <Button type="submit" disabled={isSaving} className="h-9 text-xs">
                Update Email
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2 mb-4 flex items-center gap-2">
              <Lock className="size-4 text-primary" /> Change Password
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
              <Button type="submit" disabled={isSaving} className="h-9 text-xs">
                Update Password
              </Button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border border-red-200 bg-red-50/20 p-6 dark:border-red-900/30 dark:bg-red-950/5">
            <h3 className="text-sm font-semibold text-red-950 dark:text-red-300 mb-2 flex items-center gap-2">
              <ShieldAlert className="size-4 text-red-600" /> Danger Zone
            </h3>
            <p className="text-xs text-red-800 dark:text-red-400 mb-4">
              Deleting your organization account will remove all postings, close current applications, and delete candidate data.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="h-9 text-xs font-semibold">
                  Delete Organization Portal
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the Daraz Pakistan employer portal. All active postings will be cancelled immediately. This action is irreversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    I understand, delete portal
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2 mb-4 flex items-center gap-2">
              <Bell className="size-4 text-primary" /> Email Notifications
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">New Applicants</Label>
                  <p className="text-xs text-muted-foreground">
                    Get an email as soon as a student applies to your postings
                  </p>
                </div>
                <Switch
                  checked={notifNewApplicant}
                  onCheckedChange={setNotifNewApplicant}
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t border-border">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Daily Application Digest</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive a summary of all new candidate applications once per day
                  </p>
                </div>
                <Switch
                  checked={notifDailyDigest}
                  onCheckedChange={setNotifDailyDigest}
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t border-border">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">System and Compliance Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive safety reports, verification status changes, or terms updates
                  </p>
                </div>
                <Switch
                  checked={notifSystemAlerts}
                  onCheckedChange={setNotifSystemAlerts}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button
                  onClick={handleSaveNotifications}
                  disabled={isSaving}
                  className="h-9 text-xs"
                >
                  Save Notification Choices
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Billing & Plan Tab */}
        <TabsContent value="billing" className="space-y-6">
          {/* Current plan detail */}
          <div className="rounded-xl border border-border bg-white p-6 dark:bg-card">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2 mb-4 flex items-center gap-2">
              <CreditCard className="size-4 text-primary" /> Active Plan Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-foreground">Standard Recruiter Plan</h4>
                  <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-primary dark:bg-emerald-500/10">
                    Active
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your organization is currently on the Standard tier sponsored by Scholify Pakistan.
                </p>
                <div className="pt-2 text-xs text-muted-foreground flex items-center gap-4">
                  <div>
                    Active postings: <span className="font-semibold text-foreground">5 / 10 limit</span>
                  </div>
                  <div>
                    Renewal Date: <span className="font-semibold text-foreground">July 31, 2026</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-4 border border-border text-center dark:bg-slate-900/50">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Monthly Price</p>
                <p className="text-2xl font-black text-foreground mt-1">Free</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Sponsor discount applied</p>
              </div>
            </div>
          </div>

          {/* Pricing upgrades summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-white p-5 dark:bg-card flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-base text-foreground">Premium Hiring Tier</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Expand your limits for larger hiring campaigns.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0" /> Unlimited public job & internship postings
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0" /> Priority feature highlight on candidates feed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0" /> Full CV search access (across entire database)
                  </li>
                </ul>
              </div>
              <Button
                variant="outline"
                className="mt-6 w-full h-9 border-primary/40 hover:bg-primary/5 text-primary text-xs"
                onClick={() => toast.success("Premium package selection initiated!")}
              >
                Upgrade to Premium
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-white p-5 dark:bg-card flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-base text-foreground font-sans">Enterprise Dedicated</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Custom workflows and API integrations for enterprise teams.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0" /> Dedicated account manager support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0" /> Direct integration with Workday/Greenhouse ATS
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0" /> Custom branding and landing pages
                  </li>
                </ul>
              </div>
              <Button
                variant="outline"
                className="mt-6 w-full h-9 text-xs"
                onClick={() => toast.info("Our team has been notified. We will reach out within 24 hours.")}
              >
                Contact Enterprise Sales
              </Button>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
