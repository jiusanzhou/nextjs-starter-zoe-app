import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
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

      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          暂无文章
        </div>
      )}
    </div>
  );
}
