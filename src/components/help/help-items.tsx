import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HelpItem } from "@/lib/helpqa";
import { cn } from "@/lib/utils";

interface HelpItemsListProps {
  items: HelpItem[];
  basePath?: string;
  title?: string;
  showAll?: boolean;
  showBack?: boolean;
  limit?: number;
  backLabel?: string;
  viewAllLabel?: string;
  emptyLabel?: string;
}

export function HelpItemsList({
  items,
  basePath = "/help",
  title,
  showAll = true,
  showBack = false,
  limit,
  backLabel = "Back to Help Center",
  viewAllLabel = "View All",
  emptyLabel = "No content available",
}: HelpItemsListProps) {
  const displayItems = limit ? items.slice(0, limit) : items;

  return (
    <div className="py-4">
      {/* Back button */}
      {showBack && (
        <div className="mb-4 px-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between px-1 mb-4">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {showAll && items.length > (limit || 0) && (
          <Link
            href={basePath}
            className="text-sm text-primary hover:underline"
          >
            {viewAllLabel}
          </Link>
        )}
      </div>
      <div className="divide-y divide-border rounded-xl border overflow-hidden bg-card">
        {displayItems.map((item) => (
          <Link
            key={item.id}
            href={`${basePath}/item/${item.id}`}
            className={cn(
              "flex items-center justify-between py-3.5 px-4",
              "hover:bg-accent/50 transition-colors"
            )}
          >
            <span className="text-sm md:text-base flex-1">{item.title}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
          </Link>
        ))}
        {displayItems.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            {emptyLabel}
          </div>
        )}
      </div>
    </div>
  );
}
