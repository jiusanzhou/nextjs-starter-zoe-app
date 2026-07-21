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
 * URL 编码 + trailing slash 规范化。
 * - 每个 segment 用 encodeURIComponent（中文/大小写敏感的 slug 都稳定编码）
 * - 始终以 / 结尾，与 next.config trailingSlash: true 对齐
 * - 输入 `/` 保持不变
 * - 输入 '' → '/'
 */
function normalizePath(relativePath: string): string {
  if (!relativePath || relativePath === '/') return '/';
  const segments = relativePath.split('/').filter(Boolean).map(encodeURIComponent);
  return '/' + segments.join('/') + '/';
}

/**
 * Sitemap (i18n-aware).
 *
 * SEO 修复要点（2026-07 修）：
 * - 所有 URL 强制带 trailing slash（与站点 trailingSlash: true 保持一致，否则每条都会 301）
 * - 中文 slug 用 encodeURIComponent 转义（避免 Google 抓取时再做一次规范化触发 301）
 * - lastModified 使用文章真实的 modifiedDate/date（不再全站统一 new Date()，避免 Google 忽略未来时间）
 * - Tag 页不再收录到 sitemap（避免 GSC 报 "已抓取-未编入索引" 类问题）
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
  // 只收纯路径（/ 开头且不含 hash 锚点），锚点跳转不该进 sitemap。
  // 后面 MDX pages / blog posts 会覆盖 nav 里指向内容页的项，用 set 去重。
  const staticPaths = new Set<string>();
  staticPaths.add('/');
  const isRoutablePath = (href: string) =>
    href.startsWith('/') && !href.startsWith('/#') && !href.includes('#');
  if (config.navs) {
    for (const nav of config.navs) {
      if (isRoutablePath(nav.href)) staticPaths.add(nav.href);
      if (nav.items) {
        for (const sub of nav.items) {
          if (isRoutablePath(sub.href)) staticPaths.add(sub.href);
        }
      }
    }
  }

  // 追踪所有已经生成 entry 的规范 URL（含 locale 前缀），后续 MDX pages/blog 遇到
  // 已存在的规范 URL 就跳过，避免同一 URL 出现两条。
  const emittedUrls = new Set<string>();

  for (const path of staticPaths) {
    const normalized = normalizePath(path);
    for (const loc of locales) {
      const prefix = getLocalePrefix(loc);
      // prefix 已经保证末尾无斜杠；normalized 已经保证首末都有斜杠
      const url = `${siteUrl}${prefix}${normalized}`;
      const entry: MetadataRoute.Sitemap[number] = {
        url,
        lastModified: new Date(),
        changeFrequency: path === '/' ? 'daily' : 'weekly',
        priority: path === '/' ? 1 : 0.8,
      };
      if (i18nOn) {
        entry.alternates = {
          languages: buildLanguagesMap((l) => `${getLocalePrefix(l)}${normalized}`),
        };
      }
      entries.push(entry);
      emittedUrls.add(url);
    }
  }

  // Blog posts — per-locale + alternates
  for (const loc of locales) {
    const localeForFilter = i18nOn ? loc : undefined;
    const posts = getAllPosts(false, localeForFilter);
    for (const post of posts) {
      const prefix = getLocalePrefix(loc);
      const postPath = normalizePath(`/blog/${post.slug}`);
      // 用文章真实的最后修改时间，缺失退化到发布日期，最后退化到 now
      const lastMod = post.modifiedDate
        ? new Date(post.modifiedDate)
        : post.date
          ? new Date(post.date)
          : new Date();
      const entry: MetadataRoute.Sitemap[number] = {
        url: `${siteUrl}${prefix}${postPath}`,
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.6,
      };
      if (i18nOn) {
        const translations = getPostTranslations(post);
        if (translations.size > 1) {
          const langs: Record<string, string> = {};
          for (const [tloc, tpost] of translations) {
            langs[tloc] = `${siteUrl}${getLocalePrefix(tloc)}${normalizePath(`/blog/${tpost.slug}`)}`;
          }
          const defPost = translations.get(defaultLocale);
          langs['x-default'] = defPost
            ? `${siteUrl}${getLocalePrefix(defaultLocale)}${normalizePath(`/blog/${defPost.slug}`)}`
            : entry.url;
          entry.alternates = { languages: langs };
        }
      }
      entries.push(entry);
    }
  }

  // Tag pages: 之前已经加入 sitemap，但 tag 内容页对 Google 意义不大，
  // 且 tag 页容易被 GSC 判 "重复内容/低质量" 拒绝收录。为避免 sitemap 里
  // 挂大量弱页面，改为不再放入 sitemap（页面自身可访问，但不主动推给 Google）。
  // 如未来给 tag 页写介绍文案想让它进搜索结果，可以再放开这段。
  void getAllTags;

  // MDX Pages — per-locale + alternates by translationOf/slug
  for (const loc of locales) {
    const localeForFilter = i18nOn ? loc : undefined;
    const pages = getAllPages(localeForFilter);
    for (const page of pages) {
      const prefix = getLocalePrefix(loc);
      const pagePath = normalizePath(`/${page.slug}`);
      const url = `${siteUrl}${prefix}${pagePath}`;
      // 已经在 static nav 里 emit 过了就跳过（例如 /about 同时在 nav 和 pages 里）
      if (emittedUrls.has(url)) continue;
      const entry: MetadataRoute.Sitemap[number] = {
        url,
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
            langs[ploc] = `${siteUrl}${getLocalePrefix(ploc)}${normalizePath(`/${p.slug}`)}`;
          }
          const defPage = matching.find((p) => (p.lang || defaultLocale) === defaultLocale);
          langs['x-default'] = defPage
            ? `${siteUrl}${getLocalePrefix(defaultLocale)}${normalizePath(`/${defPage.slug}`)}`
            : entry.url;
          entry.alternates = { languages: langs };
        }
      }
      entries.push(entry);
      emittedUrls.add(url);
    }
  }

  return entries;
}
