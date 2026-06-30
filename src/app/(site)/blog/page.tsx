import type { Metadata } from "next";
import {
  loadZoeConfig,
  buildAlternates,
  getDefaultLocale,
  isI18nEnabled,
} from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { BlogIndexView } from "@/components/views/blog-index-view";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: config.blog?.title || getLabel(config, "blog"),
    description: config.blog?.description,
    alternates: buildAlternates("/blog"),
  };
}

export default function BlogPage() {
  // When i18n is enabled, the default `/blog` route should only list posts
  // in the default locale; otherwise we end up mixing zh + en in one feed.
  // When i18n is disabled, leave locale undefined to preserve old behavior.
  const locale = isI18nEnabled() ? getDefaultLocale() : undefined;
  return <BlogIndexView locale={locale} />;
}
