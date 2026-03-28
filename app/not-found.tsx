import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 text-center max-w-xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-blue-50">
            <FileX className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold tracking-tight mb-4">404</h1>

        <h2 className="text-2xl font-semibold mb-3">Page not found</h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn’t exist or may have been moved. If
          this was a document, it might have been deleted or you don’t have
          access.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="px-6">Go to Dashboard</Button>
          </Link>

          <Link href="/">
            <Button variant="outline" className="px-6 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Footer hint */}
        <p className="text-sm text-gray-500 mt-10">
          Error code: 404 • Resource not found
        </p>
      </div>
    </div>
  );
}
