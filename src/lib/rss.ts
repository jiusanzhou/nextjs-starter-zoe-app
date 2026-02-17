/**
 * RSS Feed Generator
 * 构建时生成 RSS Feed
 */

import { getAllPosts } from './content';
import { loadZoeConfig } from './zoefile';

export function generateRSSFeed(): string {
  const config = loadZoeConfig();
  const posts = getAllPosts();

  if (!config.rss?.enabled) {
    return '';
  }

  const siteUrl = config.url || '';
  const blogPath = config.blog?.basePath || '/blog';
  const feedTitle = config.rss?.title || `${config.title} RSS Feed`;

  const items = posts
    .slice(0, 20) // 最多 20 篇
    .map((post) => {
      const postUrl = `${siteUrl}${blogPath}/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.description || post.excerpt || ''}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${post.tags?.map((tag) => `<category>${tag.name}</category>`).join('\n      ') || ''}
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${feedTitle}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${config.description || ''}]]></description>
    <language>${config.lang || 'en'}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}${config.rss?.path || '/rss.xml'}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return rss;
}
