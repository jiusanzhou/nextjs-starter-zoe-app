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

/**
 * Site verification tokens for search engines / webmaster tools.
 * Renders <meta name="..." content="..."/> in the document head.
 *
 * Supported keys map to Next.js Metadata `verification` plus extras
 * (baidu, sogou, 360, shenma, naver, pinterest, custom others).
 */
export interface VerificationConfig {
  /** Google Search Console — `google-site-verification` */
  google?: string | string[];
  /** Bing Webmaster Tools — `msvalidate.01` */
  bing?: string | string[];
  /** Yandex Webmaster — `yandex-verification` */
  yandex?: string | string[];
  /** Yahoo Site Explorer — `y_key` */
  yahoo?: string | string[];
  /** 百度站长 — `baidu-site-verification` */
  baidu?: string | string[];
  /** 360 站长平台 — `360-site-verification` */
  "360"?: string | string[];
  /** 搜狗站长 — `sogou_site_verification` */
  sogou?: string | string[];
  /** 神马搜索 — `shenma-site-verification` */
  shenma?: string | string[];
  /** Naver — `naver-site-verification` */
  naver?: string | string[];
  /** Pinterest — `p:domain_verify` */
  pinterest?: string | string[];
  /** Facebook — `facebook-domain-verification` */
  facebook?: string | string[];
  /** Any extra `<meta name=key content=value>` entries */
  other?: Record<string, string | string[]>;
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

/**
 * Independent / commercial product entry.
 * Different from GitHub `projects` (OSS repos), `products` describe
 * standalone products you've shipped — SaaS, sites, tools, apps, etc.
 */
export interface Product {
  /** Unique slug for routing / keys */
  slug?: string;
  /** Display name, e.g. `zshare` */
  name: string;
  /** Short one-liner shown under the name */
  tagline?: string;
  /** Optional longer description */
  description?: string;
  /** Main destination, e.g. https://zshare.wencai.app */
  url?: string;
  /** Cover image — recommended 1200x630 (reuse the product's og:image) */
  image?: string;
  /** Optional small square logo */
  logo?: string;
  /** Lifecycle status badge */
  status?: 'idea' | 'building' | 'live' | 'paused' | 'sunset';
  /** Free-form launch date string, e.g. `2025-12` or `2024` */
  launchedAt?: string;
  /** Free-form category, e.g. `SaaS`, `OSS`, `Tool`, `Site` */
  category?: string;
  /** Tech / topic tags */
  tags?: string[];
  /** Pin to the top of the page / be eligible for hero card */
  featured?: boolean;
  /** Optional GitHub repo URL when applicable */
  repo?: string;
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
  /**
   * Social/share image used as default og:image and twitter:image.
   * Recommended: 1200x630 PNG/JPG. Falls back to author.avatar / logo when not set.
   */
  image?: string;
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

  /**
   * Site verification meta tags for search engines and other services.
   * Each value is the unique verification token provided by the service.
   * Use string for a single token, or string[] for multiple (rare).
   *
   * Example:
   *   verification:
   *     google: abc123def456
   *     bing: xyz789
   *     baidu: code...
   */
  verification?: VerificationConfig;

  // App Release Configuration (for /releases page)
  releaseRepo?: string | ReleaseRepoConfig[];
  
  // App Releases Configuration (for app-landing page, MDX inline use)
  releases?: ReleaseRepoConfig[];

  // Help/QA System Configuration
  helpqa?: HelpQAConfig;

  // GitHub Projects Configuration
  projects?: ProjectsConfig;

  // Independent Products Configuration
  products?: Product[];
  
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

export type SectionType = 'hero' | 'features' | 'logos' | 'testimonials' | 'stats' | 'pricing' | 'faq' | 'cta' | 'posts' | 'projects' | 'products' | 'contact' | 'quote' | 'custom';

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

export interface ProductsSection {
  type: 'products';
  title?: string;
  description?: string;
  /** How many products to show on the section (homepage). Default 6. */
  limit?: number;
  /** Override the products array; falls back to siteConfig.products */
  items?: Product[];
  /** Show the 'View more' button */
  showMore?: boolean;
  /** Custom href for the 'View more' button (default /products) */
  moreHref?: string;
}

export interface ContactSection {
  type: 'contact';
  title?: string;
  description?: string;
  style?: 'form' | 'card' | 'simple';
  email?: string;
  links?: { icon?: string; title: string; href: string; description?: string }[];
}

export interface QuoteSection {
  type: 'quote';
  title?: string;
  description?: string;
  // Main quote content (supports inline markdown link rendering downstream)
  quote: string;
  // Optional attribution / source line
  cite?: string;
  // Optional link rendered as a small action below the quote
  link?: { text: string; href: string };
  align?: 'center' | 'left';
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
  | ProductsSection
  | ContactSection
  | QuoteSection
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
