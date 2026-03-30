import { FileText } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8 border-t border-white/5">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-semibold text-white">DocIQ</span>
          </div>

          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DocIQ. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
