/**
 * Git Content Sync Script
 * 在构建前同步 Git 内容
 * 
 * 使用方式：
 * - 在 package.json 中添加 prebuild 脚本
 * - 或手动运行: npx tsx scripts/sync-git-content.ts
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { simpleGit } from 'simple-git';

interface GitContentSource {
  name: string;
  remote: string;
  branch?: string;
  local?: string;
}

interface ZoeConfig {
  gitContent?: GitContentSource[];
}

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'zoe-site.yaml');
const GIT_CACHE_DIR = path.join(ROOT, '.cache/git-content');

async function loadConfig(): Promise<ZoeConfig> {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.log('[sync-git] No zoe-site.yaml found');
    return {};
  }
  
  const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
  return yaml.load(content) as ZoeConfig;
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function syncGitContent(source: GitContentSource): Promise<void> {
  const localPath = source.local || path.join(GIT_CACHE_DIR, source.name);
  const branch = source.branch || 'main';

  console.log(`[sync-git] Syncing: ${source.name} from ${source.remote}`);

  if (fs.existsSync(localPath)) {
    // 更新现有仓库
    const git = simpleGit(localPath);
    try {
      await git.fetch('origin', branch);
      await git.checkout(branch);
      await git.pull('origin', branch);
      console.log(`[sync-git] Updated: ${source.name}`);
    } catch (error) {
      console.warn(`[sync-git] Failed to update ${source.name}, trying fresh clone...`);
      fs.rmSync(localPath, { recursive: true, force: true });
      await cloneRepo(source, localPath, branch);
    }
  } else {
    await cloneRepo(source, localPath, branch);
  }
}

async function cloneRepo(source: GitContentSource, localPath: string, branch: string): Promise<void> {
  ensureDir(path.dirname(localPath));
  const git = simpleGit();
  
  try {
    await git.clone(source.remote, localPath, [
      '--branch', branch,
      '--single-branch',
      '--depth', '1'
    ]);
    console.log(`[sync-git] Cloned: ${source.name}`);
  } catch (error) {
    console.error(`[sync-git] Failed to clone ${source.name}:`, error);
  }
}

async function main(): Promise<void> {
  console.log('[sync-git] Starting git content sync...');
  
  const config = await loadConfig();
  const sources = config.gitContent || [];

  if (sources.length === 0) {
    console.log('[sync-git] No gitContent configured, skipping');
    return;
  }

  ensureDir(GIT_CACHE_DIR);

  for (const source of sources) {
    try {
      await syncGitContent(source);
    } catch (error) {
      console.error(`[sync-git] Error syncing ${source.name}:`, error);
    }
  }

  console.log('[sync-git] Git content sync completed');
}

main().catch(console.error);
