import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getAllTags } from "@/lib/content";
import { loadZoeConfig } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: getLabel(config, 'blog.tags'),
    description: getLabel(config, 'blog.browseTags'),
  };
}

export default function TagsPage() {
  const config = loadZoeConfig();
  const tags = getAllTags();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{getLabel(config, 'blog.tags')}</h1>
        <p className="mt-2 text-muted-foreground">
          {getLabel(config, 'blog.browseTags')}
        </p>
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link key={tag.slug} href={`/blog/tag/${tag.slug}`}>
              <Badge
                variant="secondary"
                className="text-base px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                {tag.name}
                <span className="ml-2 text-muted-foreground">({tag.count})</span>
              </Badge>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          {getLabel(config, 'blog.noTags')}
        </div>
      )}
    </div>
  );
}
