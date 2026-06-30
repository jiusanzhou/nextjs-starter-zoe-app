import type { Metadata } from "next";
import { getAllTags } from "@/lib/content";
import { loadZoeConfig, getDefaultLocale, isI18nEnabled } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { BlogTagView } from "@/components/views/blog-tag-view";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

const PLACEHOLDER_SLUG = "__placeholder__";

// i18n: default route covers default-locale tags only.
// Non-default locales are handled by [lang]/blog/tag/[slug].
function defaultLocaleFilter(): string | undefined {
  return isI18nEnabled() ? getDefaultLocale() : undefined;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const tags = getAllTags(defaultLocaleFilter());
    if (tags.length === 0) {
      return [{ slug: PLACEHOLDER_SLUG }];
    }
    return tags.map((tag) => ({ slug: tag.slug }));
  } catch (error) {
    console.warn('[blog/tag] Failed to generate static params:', error);
    return [{ slug: PLACEHOLDER_SLUG }];
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = loadZoeConfig();
  const tags = getAllTags(defaultLocaleFilter());
  const tag = tags.find((t) => t.slug === slug);

  if (!tag) {
    return { title: getLabel(config, 'blog.tagNotFound') };
  }

  return {
    title: `${getLabel(config, 'blog.tagPrefix')}${tag.name}`,
    description: getLabel(config, 'blog.tagDescription', { name: tag.name }),
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  if (slug === PLACEHOLDER_SLUG) {
    const { notFound } = await import("next/navigation");
    notFound();
  }
  return <BlogTagView slug={slug} locale={defaultLocaleFilter()} />;
}
