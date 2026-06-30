import type { Metadata } from "next";
import { getAllPages, getPageBySlug } from "@/lib";
import { loadZoeConfig } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { MdxPageView } from "@/components/views/mdx-page-view";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  try {
    // 仅生成默认 locale 的页面（非默认 locale 由 [lang]/[...slug] 负责）
    const pages = getAllPages();
    if (pages.length === 0) {
      return [{ slug: ["__placeholder__"] }];
    }
    return pages.map((page) => ({
      slug: page.slug.split("/").filter(Boolean),
    }));
  } catch (error) {
    console.warn("[slug] Failed to generate static params:", error);
    return [{ slug: ["__placeholder__"] }];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const page = getPageBySlug(slugPath);
  const config = loadZoeConfig();

  if (!page) {
    return { title: getLabel(config, "page.notFound") };
  }
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  return <MdxPageView slugPath={slugPath} />;
}
