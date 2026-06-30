import type { Metadata } from "next";
import { loadZoeConfig, getDefaultLocale, isI18nEnabled } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { BlogTagsView } from "@/components/views/blog-tags-view";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: getLabel(config, 'blog.tags'),
    description: getLabel(config, 'blog.tagsDescription'),
  };
}

export default function TagsPage() {
  // i18n: default route shows tags from default-locale posts only;
  // [lang]/blog/tags handles non-default locales.
  const locale = isI18nEnabled() ? getDefaultLocale() : undefined;
  return <BlogTagsView locale={locale} />;
}
