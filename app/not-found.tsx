import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-muted-foreground mb-8">The document you're looking for was lost in the cloud.</p>
      <Link href="/" className="rounded-md bg-primary px-6 py-2 text-white hover:bg-primary/90 transition">
        Return Home
      </Link>
    </div>
  );
}
