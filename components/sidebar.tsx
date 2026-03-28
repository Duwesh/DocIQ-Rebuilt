import Link from "next/link";
import { LayoutDashboard, Users, Settings, FolderClosed } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 z-30 hidden h-full w-64 border-r bg-background lg:block">
      <div className="flex flex-col gap-2 p-4">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary hover:bg-secondary">
          <LayoutDashboard className="h-4 w-4" />
          <span>Overview</span>
        </Link>
        <Link href="/dashboard/projects" className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary hover:bg-secondary">
          <FolderClosed className="h-4 w-4" />
          <span>Projects</span>
        </Link>
        <Link href="/dashboard/members" className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary hover:bg-secondary">
          <Users className="h-4 w-4" />
          <span>Members</span>
        </Link>
        <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary hover:bg-secondary">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
