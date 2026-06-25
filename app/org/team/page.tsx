"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, UserPlus, Users } from "lucide-react";
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

type Role = "Admin" | "Recruiter" | "Viewer";

interface Member {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: Role;
}

const INITIAL_MEMBERS: Member[] = [
  { id: "m1", name: "Sara Ahmed", initials: "SA", email: "sara@daraz.pk", role: "Admin" },
  { id: "m2", name: "Bilal Khan", initials: "BK", email: "bilal@daraz.pk", role: "Recruiter" },
  { id: "m3", name: "Hina Raza", initials: "HR", email: "hina@daraz.pk", role: "Viewer" },
];

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Recruiter");

  function sendInvite() {
    // TODO: API — POST team invitation
    toast.success("Invitation sent");
    setInviteEmail("");
    setInviteRole("Recruiter");
    setInviteOpen(false);
  }

  function removeMember(id: string) {
    // TODO: API — DELETE team member
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success("Team member removed");
  }

  return (
    <div className="mx-auto max-w-3xl">
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a team member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your organization on Scholify.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="inviteEmail">Email address</Label>
                  <Input
                    id="inviteEmail"
                    type="email"
                    placeholder="name@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="inviteRole">Role</Label>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as Role)}>
                    <SelectTrigger id="inviteRole" className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Recruiter">Recruiter</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={sendInvite} disabled={!inviteEmail.trim()}>
                  Send invite
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {members.length === 0 ? (
        <EmptyState
          Icon={Users}
          title="No team members yet"
          description="Invite colleagues to help post and review applications."
        />
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-white p-5 dark:bg-card"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                {m.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{m.name}</p>
                <p className="truncate text-sm text-muted-foreground">{m.email}</p>
              </div>
              <Badge variant="secondary">{m.role}</Badge>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" /> Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove {m.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      They will lose access to your organization on Scholify. You can
                      invite them again later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => removeMember(m.id)}>
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
