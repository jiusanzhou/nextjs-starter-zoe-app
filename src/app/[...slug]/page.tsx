import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPages, getPageBySlug, markdownToHtml } from "@/lib";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const pages = getAllPages();
  return pages.map((page) => ({
    slug: page.slug.split("/").filter(Boolean),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const page = getPageBySlug(slugPath);

  if (!page) {
    return { title: "页面未找到" };
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const page = getPageBySlug(slugPath);

  if (!page) {
    notFound();
  }

  // 移除 markdown 内容开头的一级标题（避免与 header 重复）
  let content = page.content;
  const firstH1Match = content.match(/^#\s+.+\n/);
  if (firstH1Match && firstH1Match[0].includes(page.title)) {
    content = content.replace(/^#\s+.+\n/, '');
  }

  // 检查是否为 MDX 内容（包含 JSX 语法）
  const isMdx = page.isMdx || content.includes('<') && (
    content.includes('/>') || 
    content.includes('</') ||
    content.includes('import ')
  );

  if (isMdx) {
    // 使用 next-mdx-remote 编译 MDX
    const { content: mdxContent } = await compileMDX({
      source: content,
      components: mdxComponents,
      options: {
        parseFrontmatter: false,
      },
    });

    return (
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
          {page.description && (
            <p className="mt-4 text-xl text-muted-foreground">
              {page.description}
            </p>
          )}
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-pre:bg-muted prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
          {mdxContent}
        </div>
      </article>
    );
  }

  // 普通 Markdown
  const html = await markdownToHtml(content);

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
        {page.description && (
          <p className="mt-4 text-xl text-muted-foreground">
            {page.description}
          </p>
        )}
      </header>

      <div
        className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-pre:bg-muted prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
