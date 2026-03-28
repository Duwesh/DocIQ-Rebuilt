import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { syncUserToDatabase } from "@/lib/sync-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await syncUserToDatabase();

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 lg:pl-64">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
