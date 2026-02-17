import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { loadZoeConfig } from "@/lib/zoefile";
import { markdownToHtml } from "@/lib/mdx";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "文章未找到" };
  }

  return {
    title: post.title,
    description: post.description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modifiedDate,
      images: post.banner ? [post.banner] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const config = loadZoeConfig();

  if (!post) {
    notFound();
  }

  // 将 Markdown 转换为 HTML
  const htmlContent = await markdownToHtml(post.content);

  return (
    <article className="max-w-3xl mx-auto">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/blog" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回博客
        </Link>
      </Button>

      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>
              {format(new Date(post.date), "yyyy年MM月dd日", { locale: zhCN })}
            </time>
          </div>
          {post.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} 分钟阅读</span>
            </div>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag.slug} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <Separator className="my-8" />

      {/* Content */}
      <div 
        className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-pre:bg-muted prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />

      <Separator className="my-8" />

      {/* Author Card */}
      {config.author && (
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
          <Avatar className="h-16 w-16">
            <AvatarImage src={config.author.avatar} alt={config.author.name} />
            <AvatarFallback>{config.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{config.author.name}</div>
            {config.author.minibio && (
              <p className="text-sm text-muted-foreground">
                {config.author.minibio}
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
