import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-highland-100 text-highland-800 shadow-inner">
          <Compass className="h-8 w-8" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-neutral-900">404 — Page Not Found</h1>
        <p className="text-sm text-neutral-600 leading-relaxed">
          The page or ministry resource you are looking for does not exist or may have been moved.
        </p>
        <div className="pt-2">
          <Link href="/">
            <Button variant="default" className="gap-2">
              <Home className="h-4 w-4" />
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
