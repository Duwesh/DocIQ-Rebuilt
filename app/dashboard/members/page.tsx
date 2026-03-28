import { OrganizationMembershipList } from "@clerk/nextjs";

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Team Members</h1>
      <OrganizationMembershipList />
    </div>
  );
}
