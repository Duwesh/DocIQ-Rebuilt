"use client";

import Link from "next/link";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { FileText } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">DocIQ</span>
          </Link>
          <OrganizationSwitcher hidePersonal afterCreateOrganizationUrl="/dashboard" afterSelectOrganizationUrl="/dashboard" />
        </div>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
