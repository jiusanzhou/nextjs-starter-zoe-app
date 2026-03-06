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

export interface ReleaseRepoConfig {
  provider?: 'github' | 'gitee';
  repo: string;
  assetRegexPatterns?: Record<string, string>;
}

export interface GitContentSource {
  name: string;
  remote: string;
  branch?: string;
  patterns?: string[];
  local?: string;
}

export interface HelpQAConfig {
  provider?: 'github' | 'gitee';
  repo: string;
  labelPrefix?: string;
  state?: 'open' | 'closed' | 'all';
}

export interface ProjectsConfig {
  provider?: 'github';
  tag?: string;
  owners: string[];
}

export interface FooterLink {
  title: string;
  href: string;
  category?: string;
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
  theme?: string; // 主题名称: default, cyber, minimal, apple, github, vercel, stripe

  navs?: NavItem[];
  socials?: Record<string, string>;
  links?: FooterLink[];

  blog?: BlogConfig;
  contentDirs?: string[];
  contentTypes?: ContentType[];
  gitContent?: GitContentSource[];

  rss?: RSSConfig;
  comments?: CommentsConfig;
  analytics?: AnalyticsConfig;

  // App Release Configuration (for /releases page)
  releaseRepo?: string | ReleaseRepoConfig[];
  
  // App Releases Configuration (for app-landing page, MDX inline use)
  releases?: ReleaseRepoConfig[];

  // Help/QA System Configuration
  helpqa?: HelpQAConfig;

  // GitHub Projects Configuration
  projects?: ProjectsConfig;
  
  // Pricing Configuration
  pricing?: PricingConfig;
  
  // Changelog Configuration
  changelog?: ChangelogSiteConfig;

  // Homepage Hero Configuration (legacy fallback)
  hero?: HeroConfig;

  // Homepage Sections (typed section system)
  sections?: SectionConfigUnion[];

  // UI Labels (i18n override)
  labels?: Record<string, string>;
}

export interface HeroConfig {
  greeting?: string;
  typingTexts?: string[];
  description?: string;
  cta?: { text: string; href: string; variant?: 'default' | 'outline' }[];
  image?: string;
  video?: string;
  avatar?: string;
  badge?: string;
  align?: 'center' | 'left';
}

// Legacy section format (backward compat)
export interface SectionItem {
  icon?: string;
  title: string;
  description: string;
}

// --- New typed section system ---

export type SectionType = 'hero' | 'features' | 'logos' | 'testimonials' | 'stats' | 'pricing' | 'faq' | 'cta' | 'posts' | 'projects' | 'contact' | 'custom';

export interface HeroSection {
  type: 'hero';
  greeting?: string;
  typingTexts?: string[];
  description?: string;
  cta?: { text: string; href: string; variant?: 'default' | 'outline' }[];
  image?: string;
  video?: string;
  avatar?: string;
  badge?: string;
  align?: 'center' | 'left';
}

export interface FeaturesSection {
  type: 'features';
  title?: string;
  description?: string;
  columns?: 2 | 3 | 4;
  style?: 'cards' | 'icons' | 'bento';
  items: {
    icon?: string;
    title: string;
    description: string;
    image?: string;
    href?: string;
  }[];
}

export interface LogosSection {
  type: 'logos';
  title?: string;
  items: { name: string; logo: string; href?: string }[];
  style?: 'scroll' | 'grid';
}

export interface TestimonialsSection {
  type: 'testimonials';
  title?: string;
  description?: string;
  items: {
    content: string;
    author: string;
    role?: string;
    avatar?: string;
    company?: string;
  }[];
}

export interface StatsSection {
  type: 'stats';
  title?: string;
  items: { value: string; label: string; description?: string }[];
}

export interface PricingSectionConfig {
  type: 'pricing';
  title?: string;
  description?: string;
  plans: {
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    cta?: { text: string; href: string };
    highlighted?: boolean;
  }[];
}

export interface FAQSection {
  type: 'faq';
  title?: string;
  description?: string;
  items: { question: string; answer: string }[];
}

export interface CTASection {
  type: 'cta';
  title: string;
  description?: string;
  cta: { text: string; href: string; variant?: 'default' | 'outline' }[];
  style?: 'simple' | 'gradient' | 'card';
}

export interface PostsSection {
  type: 'posts';
  title?: string;
  description?: string;
  limit?: number;
  mode?: 'grid' | 'tile';
}

export interface ProjectsSection {
  type: 'projects';
  title?: string;
  description?: string;
  limit?: number;
}

export interface ContactSection {
  type: 'contact';
  title?: string;
  description?: string;
  style?: 'form' | 'card' | 'simple';
  email?: string;
  links?: { icon?: string; title: string; href: string; description?: string }[];
}

export interface CustomSection {
  type?: 'custom';
  title?: string;
  description?: string;
  items?: SectionItem[];
  position?: 'left' | 'right' | 'center';
}

export type SectionConfigUnion =
  | HeroSection
  | FeaturesSection
  | LogosSection
  | TestimonialsSection
  | StatsSection
  | PricingSectionConfig
  | FAQSection
  | CTASection
  | PostsSection
  | ProjectsSection
  | ContactSection
  | CustomSection;

// Changelog Config (site-level)
export interface ChangelogSiteConfig {
  title?: string;
  description?: string;
  github?: {
    repo: string;
    includePrerelease?: boolean;
  };
}

// Pricing Types
export interface FeatureDefinition {
  id: string;
  name: string;
  tooltip?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  priceUnit?: string;
  originalPrice?: number;
  currency?: string;
  // 新格式: { featureId: value } 或旧格式数组
  features?: Record<string, boolean | string | number> | Array<{ name: string; included: boolean | string }>;
  cta?: string;
  ctaLink?: string;
  popular?: boolean;
  badge?: string;
}

export interface PricingConfig {
  enabled?: boolean;
  title?: string;
  description?: string;
  yearlyDiscount?: number;
  showToggle?: boolean;
  // 全局功能定义
  featureDefinitions?: FeatureDefinition[];
  plans: PricingPlan[];
}
