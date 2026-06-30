import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTags } from "@/lib/content";
import {
  loadZoeConfig,
  isValidLocale,
  getDefaultLocale,
  getLocales,
  isI18nEnabled,
} from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { BlogTagView } from "@/components/views/blog-tag-view";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export const dynamicParams = false;

const PLACEHOLDER_SLUG = "__placeholder__";

export async function generateStaticParams(): Promise<{ lang: string; slug: string }[]> {
  if (!isI18nEnabled()) return [{ lang: "__placeholder__", slug: PLACEHOLDER_SLUG }];
  const def = getDefaultLocale();
  const nonDefaultLocales = getLocales().filter((l) => l !== def);
  if (nonDefaultLocales.length === 0) {
    return [{ lang: "__placeholder__", slug: PLACEHOLDER_SLUG }];
  }

  const params: { lang: string; slug: string }[] = [];
  for (const lang of nonDefaultLocales) {
    const tags = getAllTags(lang);
    if (tags.length === 0) {
      params.push({ lang, slug: PLACEHOLDER_SLUG });
      continue;
    }
    for (const tag of tags) {
      params.push({ lang, slug: tag.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLocale(lang) || lang === getDefaultLocale()) return {};

  const config = loadZoeConfig(lang);
  const tags = getAllTags(lang);
  const tag = tags.find((t) => t.slug === slug);

  if (!tag) {
    return { title: getLabel(config, 'blog.tagNotFound') };
  }

  return {
    title: `${getLabel(config, 'blog.tagPrefix')}${tag.name}`,
    description: getLabel(config, 'blog.tagDescription', { name: tag.name }),
  };
}

export default async function LangTagPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isValidLocale(lang) || lang === getDefaultLocale()) notFound();
  if (slug === PLACEHOLDER_SLUG) notFound();
  return <BlogTagView slug={slug} locale={lang} />;
}
