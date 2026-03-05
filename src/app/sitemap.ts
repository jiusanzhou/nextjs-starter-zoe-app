import type { MetadataRoute } from 'next';
import { loadZoeConfig } from '@/lib/zoefile';
import { getAllPosts, getAllTags, getAllPages } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const config = loadZoeConfig();
  const siteUrl = config.url || 'https://example.com';

  const entries: MetadataRoute.Sitemap = [];

  // Static routes from navs
  const staticPaths = new Set<string>();
  staticPaths.add('/');

  if (config.navs) {
    for (const nav of config.navs) {
      if (nav.href.startsWith('/')) {
        staticPaths.add(nav.href);
      }
      if (nav.items) {
        for (const sub of nav.items) {
          if (sub.href.startsWith('/')) {
            staticPaths.add(sub.href);
          }
        }
      }
    }
  }

  for (const path of staticPaths) {
    entries.push({
      url: `${siteUrl}${path === '/' ? '' : path}`,
      lastModified: new Date(),
      changeFrequency: path === '/' ? 'daily' : 'weekly',
      priority: path === '/' ? 1 : 0.8,
    });
  }

  // Blog posts
  const posts = getAllPosts();
  for (const post of posts) {
    entries.push({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.modifiedDate || post.date),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // Tags
  const tags = getAllTags();
  for (const tag of tags) {
    entries.push({
      url: `${siteUrl}/blog/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    });
  }

  // Pages
  const pages = getAllPages();
  for (const page of pages) {
    entries.push({
      url: `${siteUrl}/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}
