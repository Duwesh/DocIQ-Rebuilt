import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId, orgId } = await auth();

  if (!userId) redirect("/sign-in");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Documents</h1>
        <p className="text-muted-foreground">
          Organization ID: {orgId || "Personal Space"}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Document cards will go here */}
      </div>
    </div>
  );
}
