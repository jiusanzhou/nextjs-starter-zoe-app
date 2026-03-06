import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, Calendar, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AuthorCard } from "@/components/author-card";
import { Comments } from "@/components/comments";
import { CodeBlockEnhancer } from "@/components/code-block-enhancer";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { loadZoeConfig } from "@/lib/zoefile";
import { markdownToHtml } from "@/lib/mdx";
import { getLabel } from "@/lib/i18n";

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
    return { title: getLabel(loadZoeConfig(), 'blog.postNotFound') };
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

  const htmlContent = await markdownToHtml(post.content);
  const dateFormat = getLabel(config, 'blog.dateFormat');

  // Get prev/next posts
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex(p => p.slug === post.slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <article className="blog-post">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/blog" className="hover:text-foreground transition-colors">
          {getLabel(config, 'blog')}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate max-w-[300px] text-foreground">{post.title}</span>
      </nav>

      {/* Hero Section */}
      {post.banner ? (
        <div className="blog-post-hero relative -mx-4 sm:-mx-6 lg:-mx-8 mb-10 rounded-xl overflow-hidden">
          <div className="aspect-[21/9] sm:aspect-[3/1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.banner}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {format(new Date(post.date), dateFormat)}
                </time>
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} {getLabel(config, 'blog.minRead')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="blog-post-hero relative mb-10 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-muted px-6 py-10 sm:px-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>
                {format(new Date(post.date), dateFormat)}
              </time>
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} {getLabel(config, 'blog.minRead')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 max-w-3xl mx-auto">
          {post.tags.map((tag) => (
            <Link key={tag.slug} href={`/blog/tag/${tag.slug}`}>
              <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        <CodeBlockEnhancer />
        <div
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-pre:bg-transparent prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <Separator className="my-10" />

        {/* Author - Compact inline style */}
        {config.author && (
          <div className="flex items-center gap-4 py-4">
            {config.author.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.author.avatar}
                alt={config.author.name || "Author"}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-border flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{getLabel(config, 'blog.writtenBy')}</p>
              <p className="font-semibold">{config.author.name}</p>
              {config.author.minibio && (
                <p className="text-sm text-muted-foreground truncate">{config.author.minibio}</p>
              )}
            </div>
          </div>
        )}

        {/* Prev / Next Navigation */}
        {(prevPost || nextPost) && (
          <>
            <Separator className="my-8" />
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex items-start gap-3 rounded-xl border p-4 hover:bg-muted/50 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{getLabel(config, 'blog.prevPost')}</p>
                    <p className="font-medium line-clamp-2 group-hover:text-primary transition-colors">{prevPost.title}</p>
                  </div>
                </Link>
              ) : <div />}
              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex items-start gap-3 rounded-xl border p-4 hover:bg-muted/50 transition-colors text-right sm:flex-row-reverse"
                >
                  <ArrowRight className="h-5 w-5 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{getLabel(config, 'blog.nextPost')}</p>
                    <p className="font-medium line-clamp-2 group-hover:text-primary transition-colors">{nextPost.title}</p>
                  </div>
                </Link>
              )}
            </nav>
          </>
        )}

        {/* Comments */}
        {config.comments?.provider && (
          <>
            <Separator className="my-8" />
            <section className="mt-8">
              <h2 className="text-xl font-semibold mb-6">{getLabel(config, 'blog.comments')}</h2>
              <Comments
                provider={config.comments.provider}
                repo={config.comments.repo}
                repoId={config.comments.repoId}
                category={config.comments.category}
                categoryId={config.comments.categoryId}
              />
            </section>
          </>
        )}
      </div>
    </article>
  );
}
