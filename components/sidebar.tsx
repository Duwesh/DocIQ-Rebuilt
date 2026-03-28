import { SidebarContent } from "./mobile-sidebar";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 z-30 hidden h-full w-64 border-r bg-background lg:block">
      <div className="flex flex-col gap-2 p-4">
        <SidebarContent />
      </div>
    </aside>
  );
}
