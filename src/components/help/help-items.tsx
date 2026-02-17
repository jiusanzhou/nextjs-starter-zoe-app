import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { HelpItem } from "@/lib/helpqa";
import { cn } from "@/lib/utils";

interface HelpItemsListProps {
  items: HelpItem[];
  basePath?: string;
  title?: string;
  showAll?: boolean;
  limit?: number;
}

export function HelpItemsList({
  items,
  basePath = "/help",
  title = "常见问题",
  showAll = true,
  limit,
}: HelpItemsListProps) {
  const displayItems = limit ? items.slice(0, limit) : items;

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-2 mb-4">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {showAll && items.length > (limit || 0) && (
          <Link
            href={basePath}
            className="text-sm text-primary hover:underline"
          >
            查看全部
          </Link>
        )}
      </div>
      <div className="divide-y divide-border rounded-lg border overflow-hidden">
        {displayItems.map((item) => (
          <Link
            key={item.id}
            href={`${basePath}/item/${item.id}`}
            className={cn(
              "flex items-center justify-between py-3 px-4 bg-background",
              "hover:bg-accent/50 transition-colors"
            )}
          >
            <span className="text-sm md:text-base flex-1">{item.title}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </Link>
        ))}
        {displayItems.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            暂无相关内容
          </div>
        )}
      </div>
    </div>
  );
}
