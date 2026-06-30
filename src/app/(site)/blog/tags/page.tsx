import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "lucide-react";
import { getAllTags } from "@/lib/content";
import { loadZoeConfig } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: getLabel(config, 'blog.tags'),
    description: getLabel(config, 'blog.tagsDescription'),
  };
}

export default function TagsPage() {
  const config = loadZoeConfig();
  const tags = getAllTags();

  // Calculate size tier based on post count
  const maxCount = tags.length > 0 ? Math.max(...tags.map(t => t.count)) : 1;
  function getSizeTier(count: number): "lg" | "md" | "sm" {
    const ratio = count / maxCount;
    if (ratio > 0.6) return "lg";
    if (ratio > 0.3) return "md";
    return "sm";
  }

  return (
    <div className="blog-tags">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          {getLabel(config, 'blog.tags')}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {getLabel(config, 'blog.tagsDescription')}
        </p>
      </div>

      {tags.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => {
            const tier = getSizeTier(tag.count);
            return (
              <Link
                key={tag.slug}
                href={`/blog/tag/${tag.slug}`}
                className="group feature-card rounded-xl border bg-card p-5 hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary flex-shrink-0" />
                      <h3 className={`font-semibold group-hover:text-primary transition-colors truncate ${
                        tier === "lg" ? "text-lg" : tier === "md" ? "text-base" : "text-sm"
                      }`}>
                        {tag.name}
                      </h3>
                    </div>
                  </div>
                  <span className="flex-shrink-0 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-sm font-medium tabular-nums">
                    {tag.count}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {getLabel(config, 'blog.postsCount', { count: tag.count })}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          {getLabel(config, 'blog.noTags')}
        </div>
      )}
    </div>
  );
}
