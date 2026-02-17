/**
 * Git Content Loader
 * 从远程 Git 仓库加载内容，类似 gatsby-source-git
 */

import fs from 'fs';
import path from 'path';
import { simpleGit, SimpleGit } from 'simple-git';
import { getProjectRoot } from './zoefile';

export interface GitContentSource {
  name: string;
  remote: string;
  branch?: string;
  patterns?: string[];
  local?: string;
}

const GIT_CACHE_DIR = '.cache/git-content';

/**
 * 获取 Git 缓存目录
 */
function getGitCacheDir(): string {
  return path.join(getProjectRoot(), GIT_CACHE_DIR);
}

/**
 * 确保目录存在
 */
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 克隆或更新 Git 仓库
 */
export async function syncGitContent(source: GitContentSource): Promise<string> {
  const cacheDir = getGitCacheDir();
  ensureDir(cacheDir);

  const localPath = source.local || path.join(cacheDir, source.name);
  const branch = source.branch || 'main';

  const git: SimpleGit = simpleGit();

  if (fs.existsSync(localPath)) {
    // 更新现有仓库
    const repoGit = simpleGit(localPath);
    try {
      await repoGit.fetch('origin', branch);
      await repoGit.checkout(branch);
      await repoGit.pull('origin', branch);
      console.log(`[git-content] Updated: ${source.name}`);
    } catch (error) {
      console.warn(`[git-content] Failed to update ${source.name}:`, error);
    }
  } else {
    // 克隆新仓库
    try {
      await git.clone(source.remote, localPath, ['--branch', branch, '--single-branch', '--depth', '1']);
      console.log(`[git-content] Cloned: ${source.name}`);
    } catch (error) {
      console.error(`[git-content] Failed to clone ${source.name}:`, error);
      throw error;
    }
  }

  return localPath;
}

/**
 * 同步所有 Git 内容源
 */
export async function syncAllGitContent(sources: GitContentSource[]): Promise<string[]> {
  const paths: string[] = [];

  for (const source of sources) {
    try {
      const localPath = await syncGitContent(source);
      paths.push(localPath);
    } catch (error) {
      console.error(`[git-content] Skipping ${source.name} due to error`);
    }
  }

  return paths;
}

/**
 * 检查 Git 内容是否需要同步
 */
export function needsSync(source: GitContentSource): boolean {
  const localPath = source.local || path.join(getGitCacheDir(), source.name);
  
  if (!fs.existsSync(localPath)) {
    return true;
  }

  // 检查上次同步时间（可以基于 .git/FETCH_HEAD 的修改时间）
  const fetchHeadPath = path.join(localPath, '.git', 'FETCH_HEAD');
  if (!fs.existsSync(fetchHeadPath)) {
    return true;
  }

  const stats = fs.statSync(fetchHeadPath);
  const lastFetch = stats.mtime.getTime();
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  // 如果超过1小时未同步，则需要同步
  return (now - lastFetch) > oneHour;
}
