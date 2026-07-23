import { Card } from "@/components/ui/card";

export default function AdminGuidePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Feature Guide</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reference for every admin panel feature- what it does, when to use it, and edge cases to watch for.
        </p>
      </div>

      <Section title="Platform Overview" badge="Stats">
        <GuideItem
          label="Dashboard stats"
          path="/admin"
          description="Live count of users, organizations, pending verification queue, postings, applications, and verified students. Stats refresh on every page visit- no auto-refresh."
          tip="If Pending Verifications shows a non-zero number highlighted in amber, new orgs are waiting for review."
        />
      </Section>

      <Section title="Organization Verification" badge="Trust & Safety">
        <GuideItem
          label="Org queue"
          path="/admin/orgs"
          description="Lists all registered organizations. Filter by status (pending/approved/rejected/suspended). Search by name or industry."
          tip="Newly registered orgs start as 'pending'. They cannot publish postings until approved."
        />
        <GuideItem
          label="Approve an org"
          path="/admin/orgs/[id]"
          description="Set status to 'approved'. The org's team members instantly get access to publish postings. A reason is optional but recorded in the audit log."
          tip="Only approve if the org is legitimate- verified organizations appear on public posting cards."
        />
        <GuideItem
          label="Reject an org"
          path="/admin/orgs/[id]"
          description="Set status to 'rejected'. The org account still exists (team can still log in) but cannot publish. Add a reason so the org understands why."
          tip="Rejection is reversible- you can approve later if they resubmit documentation."
        />
        <GuideItem
          label="Suspend an org"
          path="/admin/orgs/[id]"
          description="Set status to 'suspended'. Use for policy violations by previously approved orgs. Their active postings remain visible but no new postings can be created."
          tip="Suspension is the nuclear option. For minor issues, prefer 'rejected' (which they can remedy) over suspension."
        />
      </Section>

      <Section title="Student Verification" badge="Trust">
        <GuideItem
          label="Verify a student"
          path="/admin/students"
          description="Grant a student a 'verified' badge, which appears on their profile. Used after manually confirming university enrollment (e.g., via uploaded documents or email confirmation)."
          tip="Profile completion % is shown as a bar. Students with 80%+ and a working email are good candidates for verification."
        />
        <GuideItem
          label="Revoke verification"
          path="/admin/students"
          description="Remove the verified badge- e.g. if the student has graduated or their details were found to be inaccurate."
        />
      </Section>

      <Section title="Postings Management" badge="Content">
        <GuideItem
          label="All postings list"
          path="/admin/postings"
          description="Paginated table of every posting across all organizations plus platform posts. Filter by status, type, or search by title. Platform posts are tagged separately."
          tip="Use 'All Status' + 'All Types' first to get a full count. Then filter to 'active' to see what students currently see."
        />
        <GuideItem
          label="Force status change"
          path="/admin/postings"
          description="Publish (draft → active), Pause (active → paused), or Close (any → closed) a posting directly, regardless of which org posted it. Logged in audit trail."
          tip="Use 'Close' for policy-violating postings rather than deleting- deleting is permanent and loses all application data."
        />
        <GuideItem
          label="Delete a posting"
          path="/admin/postings"
          description="Soft-deletes the posting (removes from all public views). Confirmation prompt required. All applications attached to the posting remain in the database."
          tip="Deletion is permanent from the user's perspective. Always prefer Close or Pause unless the content is actively harmful."
        />
        <GuideItem
          label="Create platform posting"
          path="/admin/postings/create"
          description="Create a new scholarship or internship on behalf of the Scholify platform org. Use for scraped/curated content from LinkedIn, company websites, or HEC announcements. Set Apply Method to 'External' and paste the original source URL so students apply at the source."
          tip="Requires the 'scholify-platform' org to exist in the database (created during db:seed). Platform postings show 'Platform post' tag in the admin list."
        />
      </Section>

      <Section title="Users & Roles" badge="Access Control">
        <GuideItem
          label="User list"
          path="/admin/users"
          description="All registered users with their current roles. Filter by email search or specific role. Users without roles have no access to any authenticated features beyond basic login."
          tip="The 'Unverified email' badge means the user registered but never clicked the verification link- they cannot log in."
        />
        <GuideItem
          label="Grant a role"
          path="/admin/users"
          description="Expand a user row and click any role button to grant it immediately. Multiple roles are allowed- e.g. a user can be both 'student' and 'platform_moderator'."
          tip="To grant platform_admin: find the target user, expand their row, click '+ platform admin'. The change takes effect on their next login (cookie refresh)."
        />
        <GuideItem
          label="Revoke a role"
          path="/admin/users"
          description="Click the × on any role chip to remove it. The user loses access on their next action (their existing cookie is still valid until it expires in 15 min)."
          tip="Never revoke your own platform_admin role- there is no 'sudo' recovery path from the UI. You'd need a direct DB update."
        />
      </Section>

      <Section title="Feature Flags" badge="Config">
        <GuideItem
          label="Toggle a flag"
          path="/admin/feature-flags"
          description="Enable or disable named platform features without a code deploy. Each flag has a key (used in code), an enabled state, and an optional JSON payload for config values."
          tip="Flags are read by the backend at request time- no restart needed. Frontend flags require a browser reload to pick up the change."
        />
        <GuideItem
          label="Creating new flags"
          path="/admin/feature-flags"
          description="Flags are created automatically the first time they are toggled via this panel. They don't need to be pre-seeded- toggling a new key creates it."
          tip="The developer team defines which flag keys the code reads. Check with the dev team before creating a flag with a new key- it won't do anything unless the code checks for it."
        />
      </Section>

      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <strong className="text-foreground">Audit trail</strong>- every action you take in this panel (verifying an org, changing a posting status, granting a role, toggling a flag) is written to the <code>audit_logs</code> table with your user ID, the target entity, the before/after state, and your IP address. This is not surfaced in the UI yet but is queryable in the database.
      </div>
    </div>
  );
}

function Section({ title, badge, children }: { title: string; badge: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-3 border-b border-border pb-2">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{badge}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function GuideItem({
  label,
  path,
  description,
  tip,
}: {
  label: string;
  path: string;
  description: string;
  tip?: string;
}) {
  return (
    <Card className="rounded-lg border-border p-4 space-y-1.5 gap-0">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="font-semibold text-sm text-foreground">{label}</span>
        <code className="text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5">{path}</code>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      {tip && (
        <div className="flex gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded px-2.5 py-1.5">
          <span className="shrink-0 font-bold">Tip:</span>
          <span>{tip}</span>
        </div>
      )}
    </Card>
  );
}
