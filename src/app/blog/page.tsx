import type { Metadata } from "next";
import Link from "next/link";
import { Archive, Tag, Search } from "lucide-react";
import { PostsList } from "@/components/post-card";
import { loadZoeConfig } from "@/lib/zoefile";
import { getPostsMeta } from "@/lib/content";
import { getLabel } from "@/lib/i18n";
import { BlogViewToggle } from "@/components/blog-view-toggle";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: config.blog?.title || getLabel(config, 'blog'),
    description: config.blog?.description,
  };
}

export default function BlogPage() {
  const config = loadZoeConfig();
  const posts = getPostsMeta();
  const pinnedPosts = posts.filter(p => p.pinned);
  const regularPosts = posts.filter(p => !p.pinned);
  const dateFormat = getLabel(config, 'blog.dateFormat');
  const minReadLabel = getLabel(config, 'blog.minRead');

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <div className="blog-hero relative overflow-hidden rounded-2xl border bg-card px-6 py-12 sm:px-10 sm:py-16 mb-10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            {config.blog?.title || getLabel(config, 'blog')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {config.blog?.description || getLabel(config, 'blog.heroDescription')}
          </p>

          {/* Search + Nav Row */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={getLabel(config, 'blog.searchPlaceholder')}
                className="w-full rounded-lg border bg-background pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                readOnly
              />
            </div>
            <div className="flex gap-2">
              <Link
                href="/blog/archives"
                className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                <Archive className="h-4 w-4" />
                {getLabel(config, 'blog.archives')}
              </Link>
              <Link
                href="/blog/tags"
                className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                <Tag className="h-4 w-4" />
                {getLabel(config, 'blog.tags')}
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative gradient */}
        <div className="blog-hero-gradient absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      </div>

      {/* Featured / Pinned Posts */}
      {pinnedPosts.length > 0 && (
        <section className="mb-10">
          <PostsList
            posts={pinnedPosts}
            mode="grid"
            dateFormat={dateFormat}
            minReadLabel={minReadLabel}
            pinnedSection
          />
        </section>
      )}

      {/* All Posts with View Toggle */}
      <section>
        <BlogViewToggle
          posts={regularPosts}
          dateFormat={dateFormat}
          minReadLabel={minReadLabel}
          allPostsLabel={getLabel(config, 'blog.allPosts')}
          emptyLabel={getLabel(config, 'blog.noPosts')}
          gridLabel={getLabel(config, 'blog.gridView')}
          listLabel={getLabel(config, 'blog.listView')}
        />
      </section>
    </div>
  );
}
