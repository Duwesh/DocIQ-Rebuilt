import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FileUpload } from "@/components/file-upload";

export default async function DashboardPage() {
  const { userId, orgId } = await auth();

  if (!userId) redirect("/sign-in");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Documents</h1>
          <p className="text-muted-foreground">Manage and analyze your files with AI.</p>
        </div>
      </div>
      <FileUpload />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Document cards will be fetched and rendered here in Phase 5 */}
      </div>
    </div>
  );
}
