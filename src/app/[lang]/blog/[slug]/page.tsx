import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getPostTranslations } from "@/lib/content";
import {
  loadZoeConfig,
  isValidLocale,
  getDefaultLocale,
  getLocales,
  getSiteMetadata,
  isI18nEnabled,
  buildAlternatesForTranslations,
} from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { BlogPostView } from "@/components/views/blog-post-view";

interface PostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/**
 * See note in (site)/blog/[slug]/page.tsx — explicit OG URL avoids Next.js
 * double-encoding non-ASCII slugs in auto-injected metadata routes.
 */
function buildLangOgImageUrl(lang: string, slug: string, siteUrl: string | undefined): string | undefined {
  if (!siteUrl) return undefined;
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/${lang}/blog/${encodeURIComponent(slug)}/opengraph-image-fx5gi7`;
}

export async function generateStaticParams(): Promise<{ lang: string; slug: string }[]> {
  if (!isI18nEnabled()) return [{ lang: "__placeholder__", slug: "__placeholder__" }];
  const def = getDefaultLocale();
  const nonDefaultLocales = getLocales().filter((l) => l !== def);
  if (nonDefaultLocales.length === 0)
    return [{ lang: "__placeholder__", slug: "__placeholder__" }];

  const params: { lang: string; slug: string }[] = [];
  for (const lang of nonDefaultLocales) {
    const posts = getAllPosts(false, lang);
    if (posts.length === 0) {
      params.push({ lang, slug: "__placeholder__" });
      continue;
    }
    for (const post of posts) {
      params.push({ lang, slug: post.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLocale(lang) || lang === getDefaultLocale()) return {};

  const post = getPostBySlug(slug, lang);
  const config = loadZoeConfig(lang);

  if (!post) {
    return { title: getLabel(config, "blog.postNotFound") };
  }

  const translations = getPostTranslations(post);
  const slugByLocale = new Map<string, string>();
  for (const [loc, p] of translations) slugByLocale.set(loc, p.slug);
  const alternates = buildAlternatesForTranslations(
    slugByLocale,
    (s) => `/blog/${s}`,
  );

  const site = getSiteMetadata();
  const ogImage = post.banner
    ? post.banner
    : buildLangOgImageUrl(lang, post.slug, site.url);

  return {
    title: post.title,
    description: post.description || post.excerpt,
    alternates: Object.keys(alternates).length ? alternates : undefined,
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      type: "article",
      publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
      modifiedTime: post.modifiedDate ? new Date(post.modifiedDate).toISOString() : undefined,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || post.excerpt,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function LangPostPage({ params }: PostPageProps) {
  const { lang, slug } = await params;
  if (!isValidLocale(lang) || lang === getDefaultLocale()) notFound();
  return <BlogPostView slug={slug} locale={lang} />;
}
