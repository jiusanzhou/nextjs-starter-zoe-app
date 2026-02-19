/**
 * Changelog Loader
 * 更新日志加载器 - 支持本地 Markdown 和 GitHub Releases
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { loadZoeConfig, getProjectRoot } from './zoefile';
import type { Changelog, ChangelogMeta, ChangelogConfig } from '@/types';

/**
 * 获取内容目录
 */
function getContentDirs(): string[] {
  const config = loadZoeConfig();
  const root = getProjectRoot();
  
  const useExample = process.env.NODE_ENV === 'development' || process.env.USE_EXAMPLE_CONTENT === 'true';
  const exampleContentDir = path.join(root, '_example/content');
  
  if (useExample && fs.existsSync(exampleContentDir)) {
    return [exampleContentDir];
  }
  
  const dirs = config.contentDirs || ['content'];
  return dirs.map((dir: string) => path.join(root, dir));
}

/**
 * 解析版本号，用于排序
 */
function parseVersion(version: string): number[] {
  // 移除 v 前缀
  const clean = version.replace(/^v/, '');
  // 提取数字部分
  const parts = clean.split(/[.-]/).map(p => {
    const num = parseInt(p, 10);
    return isNaN(num) ? 0 : num;
  });
  return parts;
}

/**
 * 比较版本号
 */
function compareVersions(a: string, b: string): number {
  const partsA = parseVersion(a);
  const partsB = parseVersion(b);
  
  const maxLen = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < maxLen; i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;
    if (numA > numB) return -1;
    if (numA < numB) return 1;
  }
  return 0;
}

/**
 * 从文件名解析版本号
 * 支持格式: v1.0.0.md, 1.0.0.md, 2024-01-01-v1.0.0.md
 */
function parseVersionFromFilename(filename: string): string | null {
  const name = path.basename(filename, path.extname(filename));
  
  // 尝试匹配 v1.0.0 或 1.0.0 格式
  const versionMatch = name.match(/v?(\d+\.\d+(?:\.\d+)?(?:-[\w.]+)?)/i);
  if (versionMatch) {
    return versionMatch[0].startsWith('v') ? versionMatch[0] : `v${versionMatch[1]}`;
  }
  
  return null;
}

/**
 * 从本地 content/changelog 目录加载更新日志
 */
export function getLocalChangelogs(): Changelog[] {
  const contentDirs = getContentDirs();
  const changelogs: Changelog[] = [];

  for (const contentDir of contentDirs) {
    const changelogDir = path.join(contentDir, 'changelog');
    
    if (!fs.existsSync(changelogDir)) {
      continue;
    }

    const files = fs.readdirSync(changelogDir)
      .filter(f => /\.(md|mdx)$/.test(f));

    for (const file of files) {
      const filePath = path.join(changelogDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);
      const stats = fs.statSync(filePath);

      // 解析版本号
      const version = frontmatter.version || parseVersionFromFilename(file) || file.replace(/\.(md|mdx)$/, '');
      const slug = version.replace(/^v/, '').replace(/\./g, '-');

      changelogs.push({
        slug,
        version,
        title: frontmatter.title || `版本 ${version}`,
        date: frontmatter.date || stats.mtime.toISOString().split('T')[0],
        breaking: frontmatter.breaking || false,
        tags: frontmatter.tags || [],
        content,
      });
    }
  }

  // 按版本号排序（最新在前）
  return changelogs.sort((a, b) => compareVersions(a.version, b.version));
}

/**
 * 从 GitHub Releases 获取更新日志
 */
export async function getGitHubChangelogs(
  repo: string,
  includePrerelease = false
): Promise<Changelog[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/releases`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: { revalidate: 3600 }, // 缓存 1 小时
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch GitHub releases: ${response.status}`);
      return [];
    }

    const releases = await response.json();

    return releases
      .filter((release: any) => includePrerelease || !release.prerelease)
      .map((release: any) => ({
        slug: release.tag_name.replace(/^v/, '').replace(/\./g, '-'),
        version: release.tag_name,
        title: release.name || `版本 ${release.tag_name}`,
        date: release.published_at?.split('T')[0] || '',
        breaking: release.body?.toLowerCase().includes('breaking') || false,
        tags: release.prerelease ? ['预发布'] : [],
        content: release.body || '',
      }));
  } catch (error) {
    console.error('Error fetching GitHub releases:', error);
    return [];
  }
}

/**
 * 获取所有更新日志（合并本地和 GitHub）
 */
export async function getAllChangelogs(): Promise<Changelog[]> {
  const config = loadZoeConfig();
  const changelogConfig: ChangelogConfig = config.changelog || {};

  // 获取本地更新日志
  const localChangelogs = getLocalChangelogs();

  // 如果配置了 GitHub，获取 GitHub releases
  let githubChangelogs: Changelog[] = [];
  if (changelogConfig.github?.repo) {
    githubChangelogs = await getGitHubChangelogs(
      changelogConfig.github.repo,
      changelogConfig.github.includePrerelease
    );
  }

  // 合并并去重（本地优先）
  const allChangelogs = [...localChangelogs];
  const localVersions = new Set(localChangelogs.map(c => c.version.toLowerCase()));

  for (const gh of githubChangelogs) {
    if (!localVersions.has(gh.version.toLowerCase())) {
      allChangelogs.push(gh);
    }
  }

  // 按版本号排序
  return allChangelogs.sort((a, b) => compareVersions(a.version, b.version));
}

/**
 * 获取更新日志元数据列表（不含内容）
 */
export async function getChangelogsMeta(): Promise<ChangelogMeta[]> {
  const changelogs = await getAllChangelogs();
  return changelogs.map(({ content, ...meta }) => meta);
}

/**
 * 根据 slug 获取单个更新日志
 */
export async function getChangelogBySlug(slug: string): Promise<Changelog | undefined> {
  const changelogs = await getAllChangelogs();
  return changelogs.find(c => c.slug === slug);
}

/**
 * 根据版本号获取更新日志
 */
export async function getChangelogByVersion(version: string): Promise<Changelog | undefined> {
  const changelogs = await getAllChangelogs();
  const normalizedVersion = version.toLowerCase().replace(/^v/, '');
  return changelogs.find(c => 
    c.version.toLowerCase().replace(/^v/, '') === normalizedVersion
  );
}
