import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PostMeta } from "@/types";

interface PostCardProps {
  post: PostMeta;
  basePath?: string;
}

export function PostCard({ post, basePath = "/blog" }: PostCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Link href={`${basePath}/${post.slug}`}>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
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
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          {post.description && (
            <CardDescription className="line-clamp-2">
              {post.description}
            </CardDescription>
          )}
        </CardHeader>
        {(post.tags && post.tags.length > 0) && (
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 4).map((tag) => (
                <Badge key={tag.slug} variant="secondary">
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
