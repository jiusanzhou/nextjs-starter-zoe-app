import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileEdit } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { loadZoeConfig } from "@/lib/zoefile";
import { getAllPosts } from "@/lib/content";
import { getLabel } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: `${getLabel(config, 'blog.drafts')} - ${config.blog?.title || getLabel(config, 'blog')}`,
    description: getLabel(config, 'blog.drafts.description'),
  };
}

export default function DraftsPage() {
  const config = loadZoeConfig();
  const allPosts = getAllPosts(true);
  const drafts = allPosts.filter((post) => !post.published);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileEdit className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold tracking-tight">{getLabel(config, 'blog.drafts')}</h1>
          </div>
          <p className="text-muted-foreground">
            {getLabel(config, 'blog.drafts.description')}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/blog" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            {getLabel(config, 'blog.back')}
          </Link>
        </Button>
      </div>

      {/* Draft List */}
      {drafts.length > 0 ? (
        <div className="divide-y rounded-lg border">
          {drafts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{post.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {getLabel(config, 'blog.drafts.badge')}
                  </Badge>
                </div>
                {post.description && (
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {post.description}
                  </p>
                )}
              </div>
              <time
                dateTime={post.date}
                className="text-sm text-muted-foreground ml-4 whitespace-nowrap"
              >
                {format(new Date(post.date), "yyyy-MM-dd")}
              </time>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <FileEdit className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{getLabel(config, 'blog.drafts.empty')}</p>
          <p className="text-sm mt-2">
            {getLabel(config, 'blog.drafts.frontmatterHint', { code: 'published: false' })}
          </p>
        </div>
      )}
    </div>
  );
}
