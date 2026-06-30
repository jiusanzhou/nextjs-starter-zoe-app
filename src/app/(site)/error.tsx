"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, RotateCcw, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-error flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative mb-8">
        <h1 className="text-[8rem] sm:text-[10rem] font-bold text-muted-foreground/10 select-none leading-none tracking-tighter">
          500
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive animate-pulse" />
          </div>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold mb-3">
        Something went wrong
      </h2>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        An unexpected error occurred. Please try again.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={() => reset()} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
