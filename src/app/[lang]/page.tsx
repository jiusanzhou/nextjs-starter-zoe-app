import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePageView } from "@/components/views/home-view";
import {
  isValidLocale,
  getDefaultLocale,
  getSiteMetadata,
  getLocales,
  isI18nEnabled,
} from "@/lib/zoefile";

export const revalidate = 3600;

interface LangHomeProps {
  params: Promise<{ lang: string }>;
}

/** 仅生成非默认 locale 的 homepage */
export async function generateStaticParams(): Promise<{ lang: string }[]> {
  if (!isI18nEnabled()) return [{ lang: "__placeholder__" }];
  const def = getDefaultLocale();
  const langs = getLocales().filter((l) => l !== def);
  if (langs.length === 0) return [{ lang: "__placeholder__" }];
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LangHomeProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === getDefaultLocale()) {
    return {};
  }
  const site = getSiteMetadata(lang);
  return {
    title: site.title,
    description: site.description,
    openGraph: {
      title: site.title,
      description: site.description,
      locale: site.lang,
    },
  };
}

export default async function LangHomePage({ params }: LangHomeProps) {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === getDefaultLocale()) {
    notFound();
  }
  return <HomePageView locale={lang} />;
}
