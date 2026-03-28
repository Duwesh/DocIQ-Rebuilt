"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar when navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left font-bold text-xl">DocIQ</SheetTitle>
        </SheetHeader>
        {/* We reuse the Sidebar content but remove the 'fixed' and 'hidden' classes */}
        <div className="flex flex-col gap-2 p-4">
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Extract sidebar content to reuse it
import { LayoutDashboard, Users, Settings, FolderClosed } from "lucide-react";
import Link from "next/link";

export function SidebarContent() {
  const pathname = usePathname();
  
  const routes = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      label: "Documents",
      icon: FolderClosed,
      href: "/dashboard/documents",
    },
    {
      label: "Organization",
      icon: Users,
      href: "/dashboard/organization",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  return (
    <>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            pathname === route.href
              ? "bg-secondary text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-primary"
          }`}
        >
          <route.icon className="h-4 w-4" />
          <span>{route.label}</span>
        </Link>
      ))}
    </>
  );
}
