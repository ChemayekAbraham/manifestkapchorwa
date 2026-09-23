"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-inner">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Something Went Wrong</h1>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We encountered an unexpected error while loading this page. Please try refreshing or return to the church homepage.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="default" className="gap-2">
              <Home className="h-4 w-4" />
              Church Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
