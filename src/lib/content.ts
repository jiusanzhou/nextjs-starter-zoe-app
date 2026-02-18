/**
 * Content Loader
 * 内容加载器 - 替代 Gatsby 的 gatsby-source-filesystem + gatsby-plugin-mdx
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { loadZoeConfig, getProjectRoot } from './zoefile';
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
 * 开发模式下优先使用 _example/content
 */
function getContentDirs(): string[] {
  const config = loadZoeConfig();
  const root = getProjectRoot();
  
  // 检查是否应该使用 _example 目录
  const useExample = process.env.NODE_ENV === 'development' || process.env.USE_EXAMPLE_CONTENT === 'true';
  const exampleContentDir = path.join(root, '_example/content');
  
  if (useExample && fs.existsSync(exampleContentDir)) {
    // 检查 _example/content 是否有内容
    const hasContent = fs.readdirSync(exampleContentDir).some(name => {
      const subDir = path.join(exampleContentDir, name);
      return fs.statSync(subDir).isDirectory() && fs.readdirSync(subDir).length > 0;
    });
    
    if (hasContent) {
      // 合并 Git 内容目录
      const gitDirs = getGitContentDirs();
      return [exampleContentDir, ...gitDirs];
    }
  }
  
  // 默认使用配置的目录
  const dirs = config.contentDirs || ['content'];
  const localDirs = dirs.map(dir => path.join(root, dir));
  
  // 合并 Git 内容目录
  const gitDirs = getGitContentDirs();
  
  return [...localDirs, ...gitDirs];
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
 */
function parseMarkdownFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);
  const stats = fs.statSync(filePath);
  const reading = readingTime(content);

  // 从文件名生成 slug
  const fileName = path.basename(filePath, path.extname(filePath));
  const slug = frontmatter.slug || slugify(fileName);

  return {
    frontmatter,
    content,
    slug,
    filePath,
    createdAt: frontmatter.date || stats.birthtime.toISOString(),
    modifiedAt: frontmatter.modifiedDate || stats.mtime.toISOString(),
    readingTime: Math.ceil(reading.minutes),
  };
}

/**
 * 获取所有博客文章
 */
export function getAllPosts(includeDrafts = false): Post[] {
  const contentDirs = getContentDirs();
  const posts: Post[] = [];

  for (const contentDir of contentDirs) {
    const postsDir = path.join(contentDir, 'posts');
    const files = scanMarkdownFiles(postsDir);

    for (const file of files) {
      const parsed = parseMarkdownFile(file);
      const { frontmatter, content, slug, createdAt, modifiedAt, readingTime } = parsed;

      // 处理标签
      const tags = (frontmatter.tags || []).map((tag: string) => ({
        name: tag,
        slug: slugify(tag),
      }));

      posts.push({
        slug,
        title: frontmatter.title || slug,
        description: frontmatter.description,
        excerpt: frontmatter.excerpt || content.slice(0, 140).replace(/\n/g, ' '),
        date: createdAt,
        modifiedDate: modifiedAt,
        tags,
        banner: frontmatter.banner,
        published: frontmatter.published !== false,
        pinned: frontmatter.pinned || false,
        readingTime,
        content,
        rawContent: content,
      });
    }
  }

  // 按日期排序（最新在前），置顶文章优先
  const sortedPosts = posts.sort((a, b) => {
    // 置顶文章优先
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    // 同为置顶或同为非置顶，按日期排序
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // includeDrafts 参数控制是否包含草稿
  if (includeDrafts) {
    return sortedPosts;
  }
  
  return sortedPosts.filter(post => post.published);
}

/**
 * 获取文章元数据列表（不包含内容，用于列表页）
 */
export function getPostsMeta(): PostMeta[] {
  return getAllPosts().map(({ content, rawContent, ...meta }) => meta);
}

/**
 * 根据 slug 获取单篇文章
 */
export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find(post => post.slug === slug);
}

/**
 * 获取所有标签
 */
export function getAllTags(): { name: string; slug: string; count: number }[] {
  const posts = getAllPosts();
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
export function getPostsByTag(tagSlug: string): Post[] {
  return getAllPosts().filter(post =>
    post.tags?.some(tag => tag.slug === tagSlug)
  );
}

/**
 * 获取所有页面
 */
export function getAllPages(): Page[] {
  const contentDirs = getContentDirs();
  const pages: Page[] = [];

  for (const contentDir of contentDirs) {
    const pagesDir = path.join(contentDir, 'pages');
    const files = scanMarkdownFiles(pagesDir);

    for (const file of files) {
      const parsed = parseMarkdownFile(file);
      const { frontmatter, content, slug } = parsed;
      
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
      });
    }
  }

  return pages;
}

/**
 * 获取页面元数据列表
 */
export function getPagesMeta(): PageMeta[] {
  return getAllPages().map(({ content, ...meta }) => meta);
}

/**
 * 根据 slug 获取单个页面
 */
export function getPageBySlug(slug: string): Page | undefined {
  return getAllPages().find(page => page.slug === slug);
}

/**
 * 获取所有项目
 */
export function getAllProjects(): Project[] {
  const contentDirs = getContentDirs();
  const projects: Project[] = [];

  for (const contentDir of contentDirs) {
    const projectsDir = path.join(contentDir, 'projects');
    const files = scanMarkdownFiles(projectsDir);

    for (const file of files) {
      const parsed = parseMarkdownFile(file);
      const { frontmatter, content, slug } = parsed;

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
      });
    }
  }

  // 置顶项目排在前面
  return projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });
}

/**
 * 获取项目元数据列表
 */
export function getProjectsMeta(): ProjectMeta[] {
  return getAllProjects().map(({ content, ...meta }) => meta);
}

/**
 * 根据 slug 获取单个项目
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find(project => project.slug === slug);
}
