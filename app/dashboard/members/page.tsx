import { OrganizationProfile } from "@clerk/nextjs";

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        <p className="text-muted-foreground">
          Manage your organization&apos;s members and their permissions.
        </p>
      </div>

      {/* This component handles members, roles, and settings automatically */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <OrganizationProfile
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-none border-none p-0",
            },
          }}
        />
      </div>
    </div>
  );
}
