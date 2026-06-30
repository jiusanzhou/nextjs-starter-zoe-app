/**
 * Shared blog tag detail renderer (locale-aware).
 *
 * Default route `(site)/blog/tag/[slug]` passes the default locale.
 * Non-default routes `[lang]/blog/tag/[slug]` pass `lang`.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { Tag, ChevronRight } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getAllTags, getPostsByTag } from "@/lib/content";
import { loadZoeConfig, getLocalePrefix } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";

interface BlogTagViewProps {
  slug: string;
  locale?: string;
}

export function BlogTagView({ slug, locale }: BlogTagViewProps) {
  const config = loadZoeConfig(locale);
  const tags = getAllTags(locale);
  const tag = tags.find((t) => t.slug === slug);

  if (!tag) {
    notFound();
  }

  const posts = getPostsByTag(slug, locale);
  const dateFormat = getLabel(config, 'blog.dateFormat');
  const minReadLabel = getLabel(config, 'blog.minRead');
  const prefix = getLocalePrefix(locale);

  return (
    <div className="blog-tag">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href={`${prefix}/blog`} className="hover:text-foreground transition-colors">
          {getLabel(config, 'blog')}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`${prefix}/blog/tags`} className="hover:text-foreground transition-colors">
          {getLabel(config, 'blog.tags')}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{tag.name}</span>
      </nav>

      {/* Hero */}
      <div className="mb-10 rounded-2xl border bg-gradient-to-br from-primary/5 via-transparent to-accent/5 px-6 py-10 sm:px-10 sm:py-14">
        <div className="flex items-center gap-3 mb-3">
          <Tag className="h-6 w-6 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {tag.name}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          {getLabel(config, 'blog.postsCount', { count: tag.count })}
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              basePath={`${prefix}/blog`}
              dateFormat={dateFormat}
              minReadLabel={minReadLabel}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          {getLabel(config, 'blog.noPosts')}
        </div>
      )}
    </div>
  );
}
