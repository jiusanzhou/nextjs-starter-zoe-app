import type { MetadataRoute } from 'next';
import {
  loadZoeConfig,
  isI18nEnabled,
  getLocales,
  getDefaultLocale,
  getLocalePrefix,
} from '@/lib/zoefile';
import {
  getAllPosts,
  getAllTags,
  getAllPages,
  getPostTranslations,
} from '@/lib/content';

export const dynamic = 'force-static';

/**
 * Sitemap (i18n-aware).
 *
 * - 单语言站：保持旧行为
 * - 多语言站：每个内容项按 locale 展开成多条 entry，并填 `alternates.languages`
 *   把 hreflang 关联到所有可用翻译版本
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const config = loadZoeConfig();
  const siteUrl = (config.url || 'https://example.com').replace(/\/$/, '');

  const i18nOn = isI18nEnabled();
  const locales = i18nOn ? getLocales() : [getDefaultLocale()];
  const defaultLocale = getDefaultLocale();

  const entries: MetadataRoute.Sitemap = [];

  function buildLanguagesMap(buildHref: (loc: string) => string): Record<string, string> {
    const map: Record<string, string> = {};
    for (const loc of locales) {
      map[loc] = `${siteUrl}${buildHref(loc)}`;
    }
    map['x-default'] = `${siteUrl}${buildHref(defaultLocale)}`;
    return map;
  }

  // Static routes from navs — duplicate per locale
  const staticPaths = new Set<string>();
  staticPaths.add('/');
  if (config.navs) {
    for (const nav of config.navs) {
      if (nav.href.startsWith('/')) staticPaths.add(nav.href);
      if (nav.items) {
        for (const sub of nav.items) {
          if (sub.href.startsWith('/')) staticPaths.add(sub.href);
        }
      }
    }
  }

  for (const path of staticPaths) {
    const tail = path === '/' ? '' : path;
    for (const loc of locales) {
      const prefix = getLocalePrefix(loc);
      const url = `${siteUrl}${prefix}${tail}`;
      const entry: MetadataRoute.Sitemap[number] = {
        url,
        lastModified: new Date(),
        changeFrequency: path === '/' ? 'daily' : 'weekly',
        priority: path === '/' ? 1 : 0.8,
      };
      if (i18nOn) {
        entry.alternates = {
          languages: buildLanguagesMap((l) => `${getLocalePrefix(l)}${tail}`),
        };
      }
      entries.push(entry);
    }
  }

  // Blog posts — per-locale + alternates
  for (const loc of locales) {
    const localeForFilter = i18nOn ? loc : undefined;
    const posts = getAllPosts(false, localeForFilter);
    for (const post of posts) {
      const prefix = getLocalePrefix(loc);
      const entry: MetadataRoute.Sitemap[number] = {
        url: `${siteUrl}${prefix}/blog/${post.slug}`,
        lastModified: new Date(post.modifiedDate || post.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      };
      if (i18nOn) {
        const translations = getPostTranslations(post);
        if (translations.size > 1) {
          const langs: Record<string, string> = {};
          for (const [tloc, tpost] of translations) {
            langs[tloc] = `${siteUrl}${getLocalePrefix(tloc)}/blog/${tpost.slug}`;
          }
          // x-default → default locale 版本（若该 post 没有 default locale 翻译则用当前）
          const defPost = translations.get(defaultLocale);
          langs['x-default'] = defPost
            ? `${siteUrl}${getLocalePrefix(defaultLocale)}/blog/${defPost.slug}`
            : entry.url;
          entry.alternates = { languages: langs };
        }
      }
      entries.push(entry);
    }
  }

  // Tags — only default locale for now (per-locale tag listing not split)
  const tags = getAllTags(defaultLocale);
  for (const tag of tags) {
    entries.push({
      url: `${siteUrl}/blog/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    });
  }

  // MDX Pages — per-locale + alternates by translationOf/slug
  for (const loc of locales) {
    const localeForFilter = i18nOn ? loc : undefined;
    const pages = getAllPages(localeForFilter);
    for (const page of pages) {
      const prefix = getLocalePrefix(loc);
      const entry: MetadataRoute.Sitemap[number] = {
        url: `${siteUrl}${prefix}/${page.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      };
      if (i18nOn) {
        // Find translations across locales by translationOf/slug
        const key = page.translationOf || page.slug;
        const allPages = getAllPages();
        const matching = allPages.filter((p) => (p.translationOf || p.slug) === key);
        if (matching.length > 1) {
          const langs: Record<string, string> = {};
          for (const p of matching) {
            const ploc = p.lang || defaultLocale;
            langs[ploc] = `${siteUrl}${getLocalePrefix(ploc)}/${p.slug}`;
          }
          const defPage = matching.find((p) => (p.lang || defaultLocale) === defaultLocale);
          langs['x-default'] = defPage
            ? `${siteUrl}${getLocalePrefix(defaultLocale)}/${defPage.slug}`
            : entry.url;
          entry.alternates = { languages: langs };
        }
      }
      entries.push(entry);
    }
  }

  return entries;
}
