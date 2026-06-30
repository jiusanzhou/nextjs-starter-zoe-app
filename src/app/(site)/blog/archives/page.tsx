import type { Metadata } from "next";
import { loadZoeConfig, getDefaultLocale, isI18nEnabled } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { BlogArchivesView } from "@/components/views/blog-archives-view";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: getLabel(config, 'blog.archives'),
    description: getLabel(config, 'blog.archiveDescription'),
  };
}

export default function ArchivesPage() {
  // i18n: default route shows default-locale archives only;
  // [lang]/blog/archives handles non-default locales.
  const locale = isI18nEnabled() ? getDefaultLocale() : undefined;
  return <BlogArchivesView locale={locale} />;
}
