import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  loadZoeConfig,
  isValidLocale,
  getDefaultLocale,
  getLocales,
  isI18nEnabled,
  buildAlternates,
} from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { ProductsView } from "@/components/views/products-view";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 3600;

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
    title: getLabel(config, "products"),
    description: getLabel(config, "products.description"),
    alternates: buildAlternates("/products"),
  };
}

export default async function LangProductsPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === getDefaultLocale()) notFound();
  return <ProductsView locale={lang} />;
}
