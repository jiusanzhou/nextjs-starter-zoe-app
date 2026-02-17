/**
 * Zoe Site Configuration Types
 * TypeScript 类型定义，替代 Gatsby 的 GraphQL Schema
 */

export interface Author {
  name: string;
  email?: string;
  homepage?: string;
  avatar?: string;
  minibio?: string;
  github?: string;
  twitter?: string;
  facebook?: string;
  telegram?: string;
  linkedin?: string;
  wechat?: string;
}

export interface Organization {
  name: string;
  url?: string;
  logo?: string;
}

export interface Copyright {
  from?: number | string;
  holder?: string;
  location?: string;
  content?: string;
}

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  items?: NavItem[];
}

export interface BlogConfig {
  title?: string;
  description?: string;
  basePath?: string;
  postsPerPage?: number;
}

export interface ContentType {
  name: string;
  path: string;
  template?: string;
}

export interface RSSConfig {
  enabled?: boolean;
  path?: string;
  title?: string;
}

export interface CommentsConfig {
  provider?: 'giscus' | 'disqus' | 'utterances';
  repo?: string;
  repoId?: string;
  category?: string;
  categoryId?: string;
}

export interface AnalyticsConfig {
  googleId?: string;
  plausibleDomain?: string;
}

export interface ZoeSiteConfig {
  title: string;
  description?: string;
  url?: string;
  logo?: string;
  lang?: string;
  version?: string;

  author?: Author;
  organization?: Organization;
  copyright?: Copyright;

  primaryColor?: string;

  navs?: NavItem[];
  socials?: Record<string, string>;

  blog?: BlogConfig;
  contentDirs?: string[];
  contentTypes?: ContentType[];

  rss?: RSSConfig;
  comments?: CommentsConfig;
  analytics?: AnalyticsConfig;
}
