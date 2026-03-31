import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  Building2,
  FileStack,
  HardDrive,
  Sparkles,
  Users,
  ExternalLink,
  Calendar,
  Clock,
} from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DocumentTable,
  DocumentTableSkeleton,
} from "@/components/document-table";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";

async function RegistrySection({
  orgId,
}: {
  orgId: string | null | undefined;
}) {
  // Retrieve all documents belonging to this organization
  const documents = await db.document.findMany({
    where: {
      organizationId: orgId || "none_for_personal",
    },
    orderBy: { createdAt: "desc" },
  });

  // KPI Calculations
  const totalCount = documents.length;
  const totalSize = documents.reduce(
    (sum, doc) => sum + (doc.fileSize || 0),
    0,
  );
  const analyzedCount = documents.filter((doc) => !!doc.aiSummary).length;
  const analysisRate = totalCount > 0 ? (analyzedCount / totalCount) * 100 : 0;

  return (
    <>
      {/* ================= KPI GRID ================= */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Document Count */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden group hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground uppercase text-xs font-bold tracking-wider">
            <span>Managed Files</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <FileStack className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black transition-all group-hover:text-blue-600">
              {totalCount}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5 underline decoration-blue-500/30 decoration-offset-2">
              Real-time document registry
            </p>
          </CardContent>
        </Card>

        {/* Total Storage */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden group hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground uppercase text-xs font-bold tracking-wider">
            <span>Cloud Utilization</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
              <HardDrive className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">
              {formatFileSize(totalSize)}
            </div>
            <div className="mt-4 h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-indigo-500 to-blue-500 rounded-full"
                style={{ width: totalSize > 0 ? "45%" : "0%" }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Analyzed Count */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden group hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground uppercase text-xs font-bold tracking-wider">
            <span>AI Coverage</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-4xl font-black">{analyzedCount}</div>
              <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-none px-1.5 py-0 h-5">
                {Math.round(analysisRate)}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Enhanced with AI summaries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ================= DOCUMENTS SECTION ================= */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-foreground/80">
              Workspace Ledger
            </h2>
            <p className="text-sm text-muted-foreground">
              Historical registry of all uploaded intelligence assets.
            </p>
          </div>
        </div>

        {documents.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold px-2 flex items-center gap-2">
              Document Registry
              <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200 font-bold tracking-wider">
                {totalCount} TOTAL FILES
              </span>
            </h2>
            <DocumentTable documents={documents} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 rounded-[3rem] bg-zinc-50 dark:bg-zinc-950 border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-muted-foreground text-center px-6 shadow-sm">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm mb-6 border">
              <FileStack className="h-10 w-10 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Zero Documents Found
            </h3>
            <p className="mt-2 text-sm max-w-xs mx-auto font-medium">
              This organization workspace is empty. Visit the dashboard to
              upload your first intelligence asset.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default async function OrganizationPage() {
  const { userId, orgId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch organization details from our database
  const organization = orgId
    ? await db.organization.findUnique({
        where: { clerkOrgId: orgId },
        include: {
          members: {
            include: { user: true },
          },
        },
      })
    : null;

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* ================= HERO SECTION ================= */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 p-8 text-white shadow-2xl md:p-12 border border-white/5">
        {/* Abstract background elements */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-[100px]" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-400 backdrop-blur-md border border-white/10 italic">
              <Sparkles className="h-3 w-3" /> Core Organization Workspace
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-7xl text-white">
                {organization?.name || "Personal Library"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-zinc-400 font-medium">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {organization?.members.length || 1}{" "}
                  {organization?.members.length === 1 ? "Owner" : "Members"}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Established{" "}
                  {organization?.createdAt
                    ? new Date(organization.createdAt).toLocaleDateString()
                    : "Active Service"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 rounded-[2rem] bg-white/5 p-5 backdrop-blur-md border border-white/10 shadow-inner">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1">
                Authenticated
              </p>
              <p className="font-bold text-lg leading-tight">
                {user?.fullName || "Active Member"}
              </p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-500/20 transform rotate-2 ring-4 ring-white/10 group-hover:rotate-0 transition-transform">
              {user?.firstName?.[0] ||
                user?.emailAddresses[0].emailAddress[0].toUpperCase() ||
                "U"}
            </div>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="h-32 animate-pulse bg-muted/20" />
              <Card className="h-32 animate-pulse bg-muted/20" />
              <Card className="h-32 animate-pulse bg-muted/20" />
            </div>
            <DocumentTableSkeleton />
          </div>
        }
      >
        <RegistrySection orgId={orgId} />
      </Suspense>
    </div>
  );
}
