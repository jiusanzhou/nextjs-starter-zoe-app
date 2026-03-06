"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PostMeta } from "@/types";

// --- Grid mode PostCard (modern, no shadcn Card dependency) ---

interface PostCardProps {
  post: PostMeta;
  basePath?: string;
  dateFormat?: string;
  minReadLabel?: string;
  featured?: boolean;
}

export function PostCard({
  post,
  basePath = "/blog",
  dateFormat = "MMM dd, yyyy",
  minReadLabel = "min read",
  featured = false,
}: PostCardProps) {
  return (
    <Link
      href={`${basePath}/${post.slug}`}
      className={cn(
        "post-card feature-card group block rounded-xl border bg-card overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all",
        featured && "sm:col-span-2"
      )}
    >
      {/* Banner / Gradient placeholder */}
      <div className={cn("overflow-hidden bg-muted relative", featured ? "aspect-[21/9]" : "aspect-[16/9]")}>
        {post.banner ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.banner}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/5 via-primary/10 to-muted" />
        )}
        {post.pinned && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("p-5 space-y-3", featured && "p-6")}>
        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={post.date}>
            {format(new Date(post.date), dateFormat)}
          </time>
          {post.readingTime && (
            <>
              <span className="text-border">&middot;</span>
              <span>
                {post.readingTime} {minReadLabel}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className={cn(
          "font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors",
          featured ? "text-xl sm:text-2xl" : "text-lg"
        )}>
          {post.title}
        </h3>

        {/* Description */}
        {post.description && (
          <p className={cn(
            "text-sm text-muted-foreground leading-relaxed",
            featured ? "line-clamp-3" : "line-clamp-2"
          )}>
            {post.description}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.slice(0, featured ? 5 : 3).map((tag) => (
              <span
                key={tag.slug}
                className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// --- Tile mode (list style) ---

interface PostTileProps {
  post: PostMeta;
  basePath?: string;
  dateFormat?: string;
}

export function PostTile({
  post,
  basePath = "/blog",
  dateFormat = "MMM dd, yyyy",
}: PostTileProps) {
  return (
    <Link
      href={`${basePath}/${post.slug}`}
      className="post-tile group flex items-start gap-4 py-4 -mx-3 px-3 rounded-lg border-b last:border-0 hover:bg-muted/50 transition-colors"
    >
      {/* Thumbnail (only if banner exists) */}
      {post.banner && (
        <div className="hidden sm:block w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.banner}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Body */}
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        {post.description && (
          <p className="text-sm text-muted-foreground truncate">
            {post.description}
          </p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-1.5 pt-0.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.slug}
                className="text-xs px-2 py-0.5 rounded-full border text-muted-foreground"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Trailing: date and pinned */}
      <div className="flex flex-col items-end flex-shrink-0 text-sm text-muted-foreground">
        {post.pinned && (
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mb-1" />
        )}
        <time dateTime={post.date} className="hidden md:block whitespace-nowrap text-xs">
          {format(new Date(post.date), dateFormat)}
        </time>
      </div>
    </Link>
  );
}

// --- Posts List (grid / tile modes) ---

interface PostsListProps {
  posts: PostMeta[];
  basePath?: string;
  mode?: "grid" | "tile";
  preview?: boolean;
  limit?: number;
  showMore?: boolean;
  moreHref?: string;
  viewMoreLabel?: string;
  emptyLabel?: string;
  dateFormat?: string;
  minReadLabel?: string;
  pinnedSection?: boolean;
}

export function PostsList({
  posts,
  basePath = "/blog",
  mode = "grid",
  preview = false,
  limit = 6,
  showMore = true,
  moreHref = "/blog",
  viewMoreLabel = "View More",
  emptyLabel = "No posts yet",
  dateFormat = "MMM dd, yyyy",
  minReadLabel = "min read",
  pinnedSection = false,
}: PostsListProps) {
  const displayPosts = preview ? posts.slice(0, limit) : posts;

  return (
    <div>
      {mode === "grid" ? (
        <div className={cn(
          "grid gap-6",
          pinnedSection ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
        )}>
          {displayPosts.map((post, idx) => (
            <PostCard
              key={post.slug}
              post={post}
              basePath={basePath}
              dateFormat={dateFormat}
              minReadLabel={minReadLabel}
              featured={pinnedSection && idx === 0 && displayPosts.length > 1}
            />
          ))}
        </div>
      ) : (
        <div className="divide-y-0">
          {displayPosts.map((post) => (
            <PostTile
              key={post.slug}
              post={post}
              basePath={basePath}
              dateFormat={dateFormat}
            />
          ))}
        </div>
      )}

      {preview && showMore && posts.length > limit && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" asChild>
            <Link href={moreHref} className="flex items-center gap-2">
              {viewMoreLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {displayPosts.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">{emptyLabel}</p>
        </div>
      )}
    </div>
  );
}
