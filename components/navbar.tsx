"use client";

import Link from "next/link";
import { UserButton, OrganizationSwitcher, useAuth } from "@clerk/nextjs";
import { FileText, LayoutDashboard } from "lucide-react";
import { MobileSidebar } from "./mobile-sidebar";

export function Navbar() {
  const { userId } = useAuth();

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileSidebar />
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">DocIQ</span>
          </Link>
          <OrganizationSwitcher hidePersonal afterCreateOrganizationUrl="/dashboard" afterSelectOrganizationUrl="/dashboard" />
        </div>
        <div className="flex items-center gap-6">
          {userId && (
            <Link 
              href="/dashboard" 
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
