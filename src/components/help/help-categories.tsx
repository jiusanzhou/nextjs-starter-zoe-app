import Link from "next/link";
import { HelpCircle } from "lucide-react";
import type { HelpCategory } from "@/lib/helpqa";
import { cn } from "@/lib/utils";

interface HelpCategoriesListProps {
  categories: HelpCategory[];
  basePath?: string;
  title?: string;
}

const colorPalette = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", "#6366f1",
];

function getColor(color: string | undefined, index: number): string {
  if (color) return color;
  return colorPalette[index % colorPalette.length];
}

export function HelpCategoriesList({
  categories,
  basePath = "/help",
  title,
}: HelpCategoriesListProps) {
  return (
    <div className="py-6">
      {title && (
        <h2 className="text-lg font-semibold mb-5 px-1">{title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category, index) => {
          if (!category.name) return null;

          const color = getColor(category.color, index);

          return (
            <Link
              key={category.id}
              href={`${basePath}/categories/${category.id}`}
              className={cn(
                "help-category-card flex flex-col items-center justify-center p-6 md:p-8 rounded-xl border bg-card",
                "hover:shadow-md hover:-translate-y-0.5 transition-all"
              )}
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl mb-3"
                style={{ backgroundColor: color + "15" }}
              >
                <HelpCircle
                  className="h-6 w-6"
                  style={{ color }}
                />
              </div>
              <span className="text-sm md:text-base font-medium text-center truncate max-w-full">
                {category.name}
              </span>
              {category.description && (
                <span className="text-xs text-muted-foreground mt-1 text-center line-clamp-2">
                  {category.description}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
