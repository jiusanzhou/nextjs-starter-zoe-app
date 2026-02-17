import Link from "next/link";
import { HelpCircle } from "lucide-react";
import type { HelpCategory } from "@/lib/helpqa";
import { cn } from "@/lib/utils";

interface HelpCategoriesListProps {
  categories: HelpCategory[];
  basePath?: string;
  title?: string;
}

// 生成基于索引的颜色（如果没有颜色）
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
  title = "帮助类别",
}: HelpCategoriesListProps) {
  // 补齐到 3 的倍数
  const columnCount = 3;
  const fixed = categories.length % columnCount;
  const paddedCategories = [...categories];
  if (fixed > 0) {
    for (let i = 0; i < columnCount - fixed; i++) {
      paddedCategories.push({} as HelpCategory);
    }
  }

  return (
    <div className="py-4">
      {title && (
        <h2 className="text-lg font-semibold mb-4 px-2">{title}</h2>
      )}
      <div className="bg-muted/50 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px">
          {paddedCategories.map((category, index) => {
            if (!category.name) {
              return (
                <div key={`empty-${index}`} className="bg-background" />
              );
            }

            const color = getColor(category.color, index);

            return (
              <Link
                key={category.id}
                href={`${basePath}/categories/${category.id}`}
                className={cn(
                  "flex flex-col items-center justify-center p-6 md:p-10 bg-background",
                  "hover:bg-accent/50 transition-colors"
                )}
              >
                <HelpCircle
                  className="h-6 w-6 md:h-8 md:w-8 mb-2 md:mb-4"
                  style={{ color }}
                />
                <span className="text-sm md:text-base text-center truncate max-w-full">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
