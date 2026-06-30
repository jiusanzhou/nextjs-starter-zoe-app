/**
 * Content Loader
 * 内容加载器 - 替代 Gatsby 的 gatsby-source-filesystem + gatsby-plugin-mdx
 *
 * i18n 说明：
 * - 每篇内容的 frontmatter 可声明 `lang`（"zh" / "en" 等），未声明时视为默认 locale
 * - 同一篇内容的多语言版本通过 frontmatter.translationOf 配对（值为 canonical slug）
 * - get* 函数接受可选 `locale` 参数：不传 → 不过滤（保留旧行为）；传了 → 仅返回该 locale 内容
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { loadZoeConfig, getProjectRoot, getDefaultLocale, isI18nEnabled, getLocales } from './zoefile';
import type { Post, PostMeta, Page, PageMeta, Project, ProjectMeta, GitContentSource } from '@/types';

// 缓存 Git 内容目录
let gitContentDirsCache: string[] | null = null;

/**
 * 获取 Git 内容目录（同步方式，用于构建时）
 */
function getGitContentDirs(): string[] {
  if (gitContentDirsCache) {
    return gitContentDirsCache;
  }

  const config = loadZoeConfig();
  const root = getProjectRoot();
  const gitSources = config.gitContent || [];
  
  gitContentDirsCache = gitSources
    .map((source: GitContentSource) => {
      const localPath = source.local || path.join(root, '.cache/git-content', source.name);
      return fs.existsSync(localPath) ? localPath : null;
    })
    .filter((p): p is string => p !== null);

  return gitContentDirsCache;
}

/**
 * 获取内容目录路径（包含 Git 内容）
 * 开发模式下使用 _example/content 作为 fallback（用户内容优先）
 */
/**
 * 获取所有内容目录
 *
 * CI 模式（设置了 `ZOE_CONTENT_DIRS`）：
 *   完全使用环境变量指定的绝对路径，theme 自带的 content 被忽略
 *
 * 常规模式：
 *   1. zoe-site.yaml 里的 `contentDirs`（相对 theme root，或绝对路径）
 *   2. Git 同步的内容目录
 *   3. _example/content（仅 dev / USE_EXAMPLE_CONTENT=true）
 */
function getContentDirs(): string[] {
  const config = loadZoeConfig();
  const root = getProjectRoot();

  // CI 模式：环境变量优先且唯一
  const envDirs = (process.env.ZOE_CONTENT_DIRS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  if (envDirs.length > 0) {
    return envDirs;
  }

  // 常规模式
  const dirs = config.contentDirs || ['content'];
  const localDirs = dirs.map(dir => path.isAbsolute(dir) ? dir : path.join(root, dir));

  // 合并 Git 内容目录
  const gitDirs = getGitContentDirs();

  // 开发模式下，_example 作为 fallback（排在最后）
  const useExample = process.env.NODE_ENV === 'development' || process.env.USE_EXAMPLE_CONTENT === 'true';
  const exampleContentDir = path.join(root, '_example/content');

  const fallbackDirs: string[] = [];
  if (useExample && fs.existsSync(exampleContentDir)) {
    const hasContent = fs.readdirSync(exampleContentDir).some(name => {
      const subDir = path.join(exampleContentDir, name);
      return fs.statSync(subDir).isDirectory() && fs.readdirSync(subDir).length > 0;
    });
    if (hasContent) {
      fallbackDirs.push(exampleContentDir);
    }
  }

  return [...localDirs, ...gitDirs, ...fallbackDirs];
}

/**
 * 将字符串转换为 slug
 */
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * 扫描目录中的 MDX/MD 文件
 */
function scanMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanMarkdownFiles(fullPath));
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * 解析 Markdown 文件
 *
 * 支持文件名 locale 后缀：`xxx.en.md` / `xxx.zh-CN.mdx`
 * - 文件名匹配 `<base>.<locale>.<ext>` 且 `<locale>` 在 i18n.locales 配置中
 *   → 推断 lang = locale，slug 用 `<base>`
 * - frontmatter.lang / frontmatter.slug 仍然优先
 */
function parseMarkdownFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);
  const stats = fs.statSync(filePath);
  const reading = readingTime(content);

  // 从文件名生成 slug（先剥掉 .<locale> 后缀，如果是已配置的 locale）
  let fileName = path.basename(filePath, path.extname(filePath));
  let inferredLang: string | undefined;
  if (isI18nEnabled()) {
    const supportedLocales = getLocales();
    const match = fileName.match(/^(.+)\.([a-zA-Z]{2}(?:-[A-Za-z0-9]+)?)$/);
    if (match && supportedLocales.includes(match[2])) {
      fileName = match[1];
      inferredLang = match[2];
    }
  }
  const slug = frontmatter.slug || slugify(fileName);

  return {
    frontmatter,
    content,
    slug,
    filePath,
    inferredLang,
    createdAt: frontmatter.date || stats.birthtime.toISOString(),
    modifiedAt: frontmatter.modifiedDate || stats.mtime.toISOString(),
    readingTime: Math.ceil(reading.minutes),
  };
}

/**
 * 解析 frontmatter 的 lang 字段。
 * - 显式声明 → 直接用
 * - 缺省 + fallback（如文件名推断）→ 用 fallback
 * - 缺省 + i18n 启用 → 默认 locale
 * - 缺省 + i18n 未启用 → undefined（保留旧语义）
 */
function resolveContentLang(frontmatterLang: unknown, fallback?: string): string | undefined {
  if (typeof frontmatterLang === 'string' && frontmatterLang.trim()) {
    return frontmatterLang.trim();
  }
  if (fallback) {
    return fallback;
  }
  if (isI18nEnabled()) {
    return getDefaultLocale();
  }
  return undefined;
}

/**
 * 通用的 locale 过滤器：i18n 未启用或 locale 为 undefined 时不过滤
 * 内容 lang 为 undefined 时视为默认 locale
 */
function filterByLocale<T extends { lang?: string }>(items: T[], locale?: string): T[] {
  if (!locale || !isI18nEnabled()) return items;
  const def = getDefaultLocale();
  return items.filter((item) => (item.lang || def) === locale);
}

/**
 * 获取所有博客文章
 *
 * @param includeDrafts 是否包含未发布的草稿
 * @param locale       可选 locale；传入时按 lang 字段过滤（lang 缺省视为默认 locale）
 *
 * 兼容性：旧的 `getAllPosts(true)` / `getAllPosts()` 调用方式完全保留。
 * 也支持 `getAllPosts({ includeDrafts, locale })` 的对象形式。
 */
export function getAllPosts(
  includeDrafts: boolean | { includeDrafts?: boolean; locale?: string } = false,
  locale?: string
): Post[] {
  // 支持两种调用形式
  const opts =
    typeof includeDrafts === 'object'
      ? { includeDrafts: !!includeDrafts.includeDrafts, locale: includeDrafts.locale }
      : { includeDrafts, locale };

  const contentDirs = getContentDirs();
  const posts: Post[] = [];

  for (const contentDir of contentDirs) {
    const postsDir = path.join(contentDir, 'posts');
    const files = scanMarkdownFiles(postsDir);

    for (const file of files) {
      const parsed = parseMarkdownFile(file);
      const { frontmatter, content, slug, createdAt, modifiedAt, readingTime, inferredLang } = parsed;

      // 处理标签
      const tags = (frontmatter.tags || []).map((tag: string) => ({
        name: tag,
        slug: slugify(tag),
      }));

      const lang = resolveContentLang(frontmatter.lang, inferredLang);

      posts.push({
        slug,
        title: frontmatter.title || slug,
        description: frontmatter.description,
        excerpt: frontmatter.excerpt || content.slice(0, 140).replace(/\n/g, ' '),
        date: createdAt,
        modifiedDate: modifiedAt,
        tags,
        banner: frontmatter.banner,
        published: frontmatter.published === true,
        pinned: frontmatter.pinned || false,
        readingTime,
        content,
        rawContent: content,
        lang,
        translationOf:
          typeof frontmatter.translationOf === 'string' ? frontmatter.translationOf : undefined,
      });
    }
  }

  // 去重：同 (slug, lang) 只保留第一个（用户内容目录排在 _example 前面，所以优先）
  // 注意：i18n 启用后允许"同 slug 不同 lang"共存
  const seen = new Set<string>();
  const uniquePosts = posts.filter((post) => {
    const key = `${post.slug}__${post.lang || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const sortedPosts = uniquePosts.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const visible = opts.includeDrafts ? sortedPosts : sortedPosts.filter((post) => post.published);

  // 提供 locale 时按 lang 过滤
  return filterByLocale(visible, locale ?? opts.locale);
}

/**
 * 获取文章元数据列表（不包含内容，用于列表页）
 */
export function getPostsMeta(locale?: string): PostMeta[] {
  return getAllPosts(false, locale).map(({ content, rawContent, ...meta }) => meta);
}

/**
 * 根据 slug 获取单篇文章
 *
 * @param slug   文章 slug
 * @param locale 可选 locale；提供时仅在该 locale 文章中查找
 */
export function getPostBySlug(slug: string, locale?: string): Post | undefined {
  const decoded = decodeURIComponent(slug);
  const posts = getAllPosts(false, locale);
  return posts.find((post) => post.slug === decoded);
}

/**
 * 获取一篇文章的所有翻译版本
 * 通过 translationOf 字段（或 slug 作 fallback）配对
 *
 * @returns Map<locale, Post>
 */
export function getPostTranslations(post: Post | PostMeta): Map<string, Post> {
  const def = getDefaultLocale();
  const key = post.translationOf || post.slug;
  const all = getAllPosts(false);
  const map = new Map<string, Post>();
  for (const p of all) {
    if ((p.translationOf || p.slug) === key) {
      map.set(p.lang || def, p);
    }
  }
  return map;
}

/**
 * 获取所有标签
 */
export function getAllTags(locale?: string): { name: string; slug: string; count: number }[] {
  const posts = getAllPosts(false, locale);
  const tagMap = new Map<string, { name: string; slug: string; count: number }>();

  for (const post of posts) {
    for (const tag of post.tags || []) {
      const existing = tagMap.get(tag.slug);
      if (existing) {
        existing.count++;
      } else {
        tagMap.set(tag.slug, { ...tag, count: 1 });
      }
    }
  }

  return Array.from(tagMap.values()).sort((a, b) => b.count - a.count);
}

/**
 * 根据标签获取文章
 */
export function getPostsByTag(tagSlug: string, locale?: string): Post[] {
  return getAllPosts(false, locale).filter((post) =>
    post.tags?.some((tag) => tag.slug === tagSlug)
  );
}

/**
 * 获取所有页面
 */
export function getAllPages(locale?: string): Page[] {
  const contentDirs = getContentDirs();
  const pages: Page[] = [];

  for (const contentDir of contentDirs) {
    const pagesDir = path.join(contentDir, 'pages');
    const files = scanMarkdownFiles(pagesDir);

    for (const file of files) {
      const parsed = parseMarkdownFile(file);
      const { frontmatter, content, slug, inferredLang } = parsed;

      // 检查文件扩展名是否为 .mdx
      const isMdx = file.endsWith('.mdx');

      pages.push({
        slug,
        title: frontmatter.title || slug,
        description: frontmatter.description,
        layout: frontmatter.layout || 'default',
        container: frontmatter.container,
        isMdx,
        content,
        lang: resolveContentLang(frontmatter.lang, inferredLang),
        translationOf:
          typeof frontmatter.translationOf === 'string' ? frontmatter.translationOf : undefined,
      });
    }
  }

  // 去重：同 (slug, lang) 只保留第一个
  const seen = new Set<string>();
  const uniquePages = pages.filter((page) => {
    const key = `${page.slug}__${page.lang || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return filterByLocale(uniquePages, locale);
}

/**
 * 获取页面元数据列表
 */
export function getPagesMeta(locale?: string): PageMeta[] {
  return getAllPages(locale).map(({ content, ...meta }) => meta);
}

/**
 * 根据 slug 获取单个页面
 */
export function getPageBySlug(slug: string, locale?: string): Page | undefined {
  return getAllPages(locale).find((page) => page.slug === slug);
}

/**
 * 获取所有项目
 */
export function getAllProjects(locale?: string): Project[] {
  const contentDirs = getContentDirs();
  const projects: Project[] = [];

  for (const contentDir of contentDirs) {
    const projectsDir = path.join(contentDir, 'projects');
    const files = scanMarkdownFiles(projectsDir);

    for (const file of files) {
      const parsed = parseMarkdownFile(file);
      const { frontmatter, content, slug, inferredLang } = parsed;

      projects.push({
        slug,
        title: frontmatter.title || slug,
        description: frontmatter.description,
        repo: frontmatter.repo,
        url: frontmatter.url,
        banner: frontmatter.banner,
        tags: frontmatter.tags || [],
        featured: frontmatter.featured || false,
        content,
        lang: resolveContentLang(frontmatter.lang, inferredLang),
        translationOf:
          typeof frontmatter.translationOf === 'string' ? frontmatter.translationOf : undefined,
      });
    }
  }

  // 去重：同 (slug, lang) 只保留第一个
  const seen = new Set<string>();
  const uniqueProjects = projects.filter((project) => {
    const key = `${project.slug}__${project.lang || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const sorted = uniqueProjects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return filterByLocale(sorted, locale);
}

/**
 * 获取项目元数据列表
 */
export function getProjectsMeta(locale?: string): ProjectMeta[] {
  return getAllProjects(locale).map(({ content, ...meta }) => meta);
}

/**
 * 根据 slug 获取单个项目
 */
export function getProjectBySlug(slug: string, locale?: string): Project | undefined {
  return getAllProjects(locale).find((project) => project.slug === slug);
}
