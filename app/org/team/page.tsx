"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Clock, Loader2, Trash2, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { EmptyState } from "@/components/dashboard/EmptyState";
import { formatDate } from "@/components/dashboard/dashboard.utils";
import {
  inviteMember,
  listTeam,
  patchMemberRole,
  removeMember,
  revokeInvitation,
  type InviteRole,
  type PendingInviteDto,
  type TeamMemberDto,
  type TeamRole,
} from "@/lib/api/organizations";
import { handleApiError } from "@/lib/api/handle-error";

const ROLE_BADGE: Record<TeamRole, string> = {
  owner: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  member: "bg-secondary text-secondary-foreground",
};

function RoleBadge({ role }: { role: TeamRole }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${ROLE_BADGE[role]}`}>
      {role}
    </span>
  );
}

function initials(email: string, name?: string | null) {
  if (name) return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return email.slice(0, 2).toUpperCase();
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMemberDto[]>([]);
  const [invitations, setInvitations] = useState<PendingInviteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<InviteRole>("member");
  const [inviting, setInviting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const team = await listTeam();
      setMembers(team.members);
      setInvitations(team.invitations);
    } catch (err) {
      handleApiError(err, "Couldn't load team.");
    } finally {
      setLoading(false);
    }
  }

  async function sendInvite() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      const inv = await inviteMember({ email: inviteEmail.trim(), role: inviteRole });
      setInvitations((prev) => [...prev, inv]);
      toast.success(`Invitation sent to ${inviteEmail.trim()}`);
      setInviteEmail("");
      setInviteRole("member");
      setInviteOpen(false);
    } catch (err) {
      handleApiError(err, "Couldn't send invitation.");
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(userId: string) {
    setBusyId(userId);
    try {
      await removeMember(userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
      toast.success("Team member removed");
    } catch (err) {
      handleApiError(err, "Couldn't remove member.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleRoleChange(userId: string, role: InviteRole) {
    setBusyId(userId);
    try {
      const updated = await patchMemberRole(userId, role);
      setMembers((prev) => prev.map((m) => (m.userId === userId ? updated : m)));
      toast.success("Role updated");
    } catch (err) {
      handleApiError(err, "Couldn't update role.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleRevoke(id: string) {
    setBusyId(id);
    try {
      await revokeInvitation(id);
      setInvitations((prev) => prev.filter((i) => i.id !== id));
      toast.success("Invitation revoked");
    } catch (err) {
      handleApiError(err, "Couldn't revoke invitation.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Team"
        subtitle="Manage who can post and review on behalf of your organization"
        action={
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="size-4" /> Invite member
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6">
              <DialogHeader>
                <DialogTitle>Invite a team member</DialogTitle>
                <DialogDescription>
                  They'll receive an email with a signup link valid for 7 days.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="inviteEmail">Email address</Label>
                  <Input
                    id="inviteEmail"
                    type="email"
                    placeholder="name@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendInvite()}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="inviteRole">Role</Label>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as InviteRole)}>
                    <SelectTrigger id="inviteRole" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin — can manage team &amp; settings</SelectItem>
                      <SelectItem value="member">Member — can post &amp; review applicants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteOpen(false)} disabled={inviting}>
                  Cancel
                </Button>
                <Button onClick={sendInvite} disabled={!inviteEmail.trim() || inviting}>
                  {inviting && <Loader2 className="size-4 animate-spin" />}
                  Send invite
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" /> Loading team…
        </div>
      ) : members.length === 0 && invitations.length === 0 ? (
        <EmptyState
          Icon={Users}
          title="No team members yet"
          description="Invite colleagues to help post and review applications."
        />
      ) : (
        <div className="space-y-6">
          {/* Active members */}
          {members.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Members ({members.length})
              </h3>
              {members.map((m) => (
                <div
                  key={m.userId}
                  className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 dark:bg-card"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                    {initials(m.email, m.fullName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {m.fullName ?? m.email}
                    </p>
                    {m.fullName && (
                      <p className="truncate text-sm text-muted-foreground">{m.email}</p>
                    )}
                    {m.designation && (
                      <p className="text-xs text-muted-foreground">{m.designation}</p>
                    )}
                  </div>

                  <RoleBadge role={m.role} />

                  {/* Role change — only for non-owners */}
                  {m.role !== "owner" && (
                    <Select
                      value={m.role === "admin" ? "admin" : "member"}
                      onValueChange={(v) => handleRoleChange(m.userId, v as InviteRole)}
                      disabled={busyId === m.userId}
                    >
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {m.role !== "owner" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busyId === m.userId}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          {busyId === m.userId
                            ? <Loader2 className="size-4 animate-spin" />
                            : <Trash2 className="size-4" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove {m.fullName ?? m.email}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            They will lose access to your organization on Scholify. You can invite them again later.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemove(m.userId)}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pending invitations */}
          {invitations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Pending invitations ({invitations.length})
              </h3>
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    <Clock className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{inv.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Invited {formatDate(inv.invitedAt)} · expires {formatDate(inv.expiresAt)}
                    </p>
                  </div>
                  <RoleBadge role={inv.role} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={busyId === inv.id}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        {busyId === inv.id
                          ? <Loader2 className="size-4 animate-spin" />
                          : <Trash2 className="size-4" />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke invitation?</AlertDialogTitle>
                        <AlertDialogDescription>
                          The invitation sent to {inv.email} will be cancelled. You can send a new one any time.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRevoke(inv.id)}>Revoke</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
