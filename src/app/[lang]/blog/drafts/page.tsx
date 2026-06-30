import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  loadZoeConfig,
  isValidLocale,
  getDefaultLocale,
  getLocales,
  isI18nEnabled,
} from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { BlogDraftsView } from "@/components/views/blog-drafts-view";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams(): Promise<{ lang: string }[]> {
  if (!isI18nEnabled()) return [{ lang: "__placeholder__" }];
  const def = getDefaultLocale();
  const langs = getLocales().filter((l) => l !== def);
  if (langs.length === 0) return [{ lang: "__placeholder__" }];
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === getDefaultLocale()) return {};
  const config = loadZoeConfig(lang);
  return {
    title: `${getLabel(config, 'blog.drafts')} - ${config.blog?.title || getLabel(config, 'blog')}`,
    description: getLabel(config, 'blog.drafts.description'),
  };
}

export default async function LangDraftsPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === getDefaultLocale()) notFound();
  return <BlogDraftsView locale={lang} />;
}
