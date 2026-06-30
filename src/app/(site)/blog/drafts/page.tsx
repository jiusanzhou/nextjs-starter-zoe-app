import type { Metadata } from "next";
import { loadZoeConfig, getDefaultLocale, isI18nEnabled } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { BlogDraftsView } from "@/components/views/blog-drafts-view";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: `${getLabel(config, 'blog.drafts')} - ${config.blog?.title || getLabel(config, 'blog')}`,
    description: getLabel(config, 'blog.drafts.description'),
  };
}

export default function DraftsPage() {
  // i18n: default route shows default-locale drafts only.
  const locale = isI18nEnabled() ? getDefaultLocale() : undefined;
  return <BlogDraftsView locale={locale} />;
}
