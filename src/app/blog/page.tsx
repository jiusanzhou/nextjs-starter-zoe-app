import type { Metadata } from "next";
import Link from "next/link";
import { Archive, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostsList } from "@/components/post-card";
import { loadZoeConfig } from "@/lib/zoefile";
import { getPostsMeta } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: config.blog?.title || "博客",
    description: config.blog?.description,
  };
}

export default function BlogPage() {
  const config = loadZoeConfig();
  const posts = getPostsMeta();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {config.blog?.title || "博客"}
          </h1>
          {config.blog?.description && (
            <p className="mt-2 text-muted-foreground">
              {config.blog.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/blog/archives" className="flex items-center gap-1">
              <Archive className="h-4 w-4" />
              归档
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/blog/tags" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              标签
            </Link>
          </Button>
        </div>
      </div>

      {/* 使用 tile 模式展示列表，类似 Gatsby 版本 */}
      <PostsList posts={posts} mode="tile" />
    </div>
  );
}
