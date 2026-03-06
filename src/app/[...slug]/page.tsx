import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPages, getPageBySlug, markdownToHtml } from "@/lib";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";
import { loadZoeConfig } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";

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
  const config = loadZoeConfig();

  if (!page) {
    return { title: getLabel(config, 'page.notFound') };
  }

  return {
    title: page.title,
    description: page.description,
  };
}

const proseClasses = "prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-pre:bg-muted prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none";

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const page = getPageBySlug(slugPath);

  if (!page) {
    notFound();
  }

  let content = page.content.replace(/^\s+/, '');
  const firstH1Match = content.match(/^#\s+.+\n/);
  if (firstH1Match && firstH1Match[0].includes(page.title)) {
    content = content.replace(/^#\s+.+\n/, '');
  }

  const isMdx = page.isMdx || content.includes('<') && (
    content.includes('/>') ||
    content.includes('</') ||
    content.includes('import ')
  );

  if (isMdx) {
    const { content: mdxContent } = await compileMDX({
      source: content,
      components: mdxComponents,
      options: {
        parseFrontmatter: false,
      },
    });

    return (
      <article className="page-dynamic max-w-3xl mx-auto">
        <header className="mb-10 pb-6 border-b">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{page.title}</h1>
          {page.description && (
            <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
              {page.description}
            </p>
          )}
        </header>

        <div className={proseClasses}>
          {mdxContent}
        </div>
      </article>
    );
  }

  const html = await markdownToHtml(content);

  return (
    <article className="page-dynamic max-w-3xl mx-auto">
      <header className="mb-10 pb-6 border-b">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{page.title}</h1>
        {page.description && (
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
            {page.description}
          </p>
        )}
      </header>

      <div
        className={proseClasses}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
