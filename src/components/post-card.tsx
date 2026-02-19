"use client";

import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Star, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PostMeta } from "@/types";

interface PostCardProps {
  post: PostMeta;
  basePath?: string;
}

// Grid 模式的卡片（带封面图）
export function PostCard({ post, basePath = "/blog" }: PostCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden group">
      <Link href={`${basePath}/${post.slug}`}>
        {/* Banner 图片 */}
        {post.banner && (
          <div className="aspect-video overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.banner}
              alt={post.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader className={cn(!post.banner && "pt-6", "text-left")}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            {post.pinned && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
            <time dateTime={post.date}>
              {format(new Date(post.date), "yyyy年MM月dd日", { locale: zhCN })}
            </time>
            {post.readingTime && (
              <>
                <span>·</span>
                <span>{post.readingTime} 分钟阅读</span>
              </>
            )}
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-left">
            {post.title}
          </CardTitle>
          {post.description && (
            <CardDescription className="line-clamp-2 text-left">
              {post.description}
            </CardDescription>
          )}
        </CardHeader>
        {(post.tags && post.tags.length > 0) && (
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2 justify-start">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.slug} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Link>
    </Card>
  );
}

// Tile 模式的卡片（列表样式，类似 Gatsby 版本）
interface PostTileProps {
  post: PostMeta;
  basePath?: string;
}

export function PostTile({ post, basePath = "/blog" }: PostTileProps) {
  return (
    <Link
      href={`${basePath}/${post.slug}`}
      className="flex items-start gap-4 py-4 group border-b last:border-0 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors"
    >
      {/* Leading: 封面图 */}
      {post.banner ? (
        <div className="hidden sm:block w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.banner}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="hidden sm:flex w-24 h-16 rounded-lg bg-muted items-center justify-center flex-shrink-0 text-muted-foreground text-xs">
          No Image
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
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-1.5 pt-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.slug} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {/* Trailing: 日期和置顶 */}
      <div className="flex flex-col items-end flex-shrink-0 text-sm text-muted-foreground">
        {post.pinned && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mb-1" />}
        <time dateTime={post.date} className="hidden md:block whitespace-nowrap">
          {format(new Date(post.date), "yyyy-MM-dd")}
        </time>
      </div>
    </Link>
  );
}

// 文章列表组件（支持 grid/tile 两种模式）
interface PostsListProps {
  posts: PostMeta[];
  basePath?: string;
  mode?: "grid" | "tile";
  preview?: boolean;
  limit?: number;
  showMore?: boolean;
  moreHref?: string;
}

export function PostsList({
  posts,
  basePath = "/blog",
  mode = "grid",
  preview = false,
  limit = 3,
  showMore = true,
  moreHref = "/blog",
}: PostsListProps) {
  const displayPosts = preview ? posts.slice(0, limit) : posts;
  
  return (
    <div>
      {mode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayPosts.map((post) => (
            <PostCard key={post.slug} post={post} basePath={basePath} />
          ))}
        </div>
      ) : (
        <div className="divide-y-0">
          {displayPosts.map((post) => (
            <PostTile key={post.slug} post={post} basePath={basePath} />
          ))}
        </div>
      )}
      
      {preview && showMore && posts.length > limit && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" asChild>
            <Link href={moreHref} className="flex items-center gap-1">
              查看更多 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
      
      {displayPosts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          暂无文章
        </div>
      )}
    </div>
  );
}
