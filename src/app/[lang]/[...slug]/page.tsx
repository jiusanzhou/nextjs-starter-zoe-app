/**
 * [lang]/[...slug] route — 非默认 locale 下的 MDX 页面
 *
 * generateStaticParams: 对每个"非默认 locale"，列出该 locale 下所有 page 的
 * slug，组合 (lang, slug) 输出。
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPages, getPageBySlug } from "@/lib";
import { loadZoeConfig, isValidLocale, getDefaultLocale, getLocales, isI18nEnabled } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { MdxPageView } from "@/components/views/mdx-page-view";

interface PageProps {
  params: Promise<{ lang: string; slug: string[] }>;
}

export async function generateStaticParams(): Promise<{ lang: string; slug: string[] }[]> {
  if (!isI18nEnabled()) return [{ lang: "__placeholder__", slug: ["__placeholder__"] }];
  const def = getDefaultLocale();
  const nonDefaultLocales = getLocales().filter((l) => l !== def);
  if (nonDefaultLocales.length === 0) return [{ lang: "__placeholder__", slug: ["__placeholder__"] }];

  const params: { lang: string; slug: string[] }[] = [];
  for (const lang of nonDefaultLocales) {
    const pages = getAllPages(lang);
    if (pages.length === 0) {
      params.push({ lang, slug: ["__placeholder__"] });
      continue;
    }
    for (const page of pages) {
      params.push({ lang, slug: page.slug.split("/").filter(Boolean) });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLocale(lang) || lang === getDefaultLocale()) {
    return {};
  }
  const slugPath = slug.join("/");
  const page = getPageBySlug(slugPath, lang);
  const config = loadZoeConfig(lang);

  if (!page) {
    return { title: getLabel(config, "page.notFound") };
  }
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function LangDynamicPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isValidLocale(lang) || lang === getDefaultLocale()) {
    notFound();
  }
  const slugPath = slug.join("/");
  return <MdxPageView slugPath={slugPath} locale={lang} />;
}
