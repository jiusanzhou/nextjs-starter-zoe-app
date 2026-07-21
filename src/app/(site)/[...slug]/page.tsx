import type { Metadata } from "next";
import { getAllPages, getPageBySlug } from "@/lib";
import {
  loadZoeConfig,
  getDefaultLocale,
  isI18nEnabled,
  buildAlternatesForTranslations,
} from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { MdxPageView } from "@/components/views/mdx-page-view";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  try {
    // 仅生成默认 locale 的页面（非默认 locale 由 [lang]/[...slug] 负责）
    const locale = isI18nEnabled() ? getDefaultLocale() : undefined;
    const pages = getAllPages(locale);
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
  const locale = isI18nEnabled() ? getDefaultLocale() : undefined;
  const page = getPageBySlug(slugPath, locale);
  const config = loadZoeConfig();

  if (!page) {
    return { title: getLabel(config, "page.notFound") };
  }

  // canonical / hreflang：按 translationOf | slug 找同一逻辑页面的所有 locale 版本
  let alternates: Metadata["alternates"] | undefined;
  if (isI18nEnabled()) {
    const key = page.translationOf || page.slug;
    const all = getAllPages();
    const translations = new Map<string, string>();
    for (const p of all) {
      if ((p.translationOf || p.slug) === key) {
        translations.set(p.lang || getDefaultLocale(), p.slug);
      }
    }
    if (translations.size > 0) {
      alternates = buildAlternatesForTranslations(
        translations,
        (s) => `/${s}`,
        getDefaultLocale(),
      );
    }
  }

  return {
    title: page.title,
    description: page.description,
    alternates,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const locale = isI18nEnabled() ? getDefaultLocale() : undefined;
  return <MdxPageView slugPath={slugPath} locale={locale} />;
}
