import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tag, ChevronRight } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getAllTags, getPostsByTag } from "@/lib/content";
import { loadZoeConfig } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

const PLACEHOLDER_SLUG = "__placeholder__";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const tags = getAllTags();
    if (tags.length === 0) {
      return [{ slug: PLACEHOLDER_SLUG }];
    }
    return tags.map((tag) => ({ slug: tag.slug }));
  } catch (error) {
    console.warn('[blog/tag] Failed to generate static params:', error);
    return [{ slug: PLACEHOLDER_SLUG }];
  }
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = loadZoeConfig();
  const tags = getAllTags();
  const tag = tags.find((t) => t.slug === slug);

  if (!tag) {
    return { title: getLabel(config, 'blog.tagNotFound') };
  }

  return {
    title: `${getLabel(config, 'blog.tagPrefix')}${tag.name}`,
    description: getLabel(config, 'blog.tagDescription', { name: tag.name }),
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const config = loadZoeConfig();
  const tags = getAllTags();
  const tag = tags.find((t) => t.slug === slug);

  if (!tag || slug === PLACEHOLDER_SLUG) {
    notFound();
  }

  const posts = getPostsByTag(slug);
  const dateFormat = getLabel(config, 'blog.dateFormat');
  const minReadLabel = getLabel(config, 'blog.minRead');

  return (
    <div className="blog-tag">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/blog" className="hover:text-foreground transition-colors">
          {getLabel(config, 'blog')}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/blog/tags" className="hover:text-foreground transition-colors">
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
