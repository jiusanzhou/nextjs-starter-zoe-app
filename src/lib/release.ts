/**
 * App Release Provider
 * Fetches release information from GitHub/Gitee APIs
 */

import yaml from 'js-yaml';
import type { Release, ReleaseConfig, ReleaseMeta, ReleaseAssets } from '@/types/release';

// Meta extraction regex - matches ```yaml version ... ```
const META_REGEXP = /```yaml version([\s\S]*?)```/;

interface GitHubRelease {
  id: number;
  name: string;
  tag_name: string;
  url: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  body: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}

interface GiteeRelease {
  id: number;
  name: string;
  tag_name: string;
  url: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  body: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}

/**
 * Parse release metadata from release notes
 */
function parseMeta(note: string): ReleaseMeta | null {
  const match = META_REGEXP.exec(note);
  if (!match) return null;
  try {
    return yaml.load(match[1]) as ReleaseMeta;
  } catch {
    return null;
  }
}

/**
 * Match assets to regex patterns
 */
function matchAssets(
  assets: Array<{ name: string; browser_download_url: string }>,
  patterns: Record<string, string>
): ReleaseAssets {
  const result: ReleaseAssets = {};
  
  for (const [key, pattern] of Object.entries(patterns)) {
    const regex = new RegExp(pattern);
    for (const asset of assets) {
      if (regex.test(asset.name)) {
        result[key] = asset.browser_download_url;
        break;
      }
    }
  }
  
  return result;
}

/**
 * Adapt GitHub release to common format
 */
function adaptGitHubRelease(
  release: GitHubRelease,
  repo: string,
  assetPatterns: Record<string, string> = {}
): Release | null {
  if (release.draft) return null;

  let releaseNote = release.body || '';
  const meta = parseMeta(releaseNote);
  
  // Remove meta block from release notes
  releaseNote = releaseNote.replace(META_REGEXP, '').trim();

  const assets = matchAssets(release.assets || [], assetPatterns);

  // Merge meta assets if present
  if (meta?.assets) {
    Object.assign(assets, meta.assets);
  }

  return {
    provider: 'github',
    id: String(release.id),
    repo,
    title: release.name || release.tag_name,
    version: meta?.version || release.tag_name,
    created_at: release.created_at,
    published_at: release.published_at,
    prerelease: release.prerelease,
    release_note: releaseNote,
    assets,
    urls: meta?.urls,
    meta: meta ?? undefined,
  };
}

/**
 * Adapt Gitee release to common format
 */
function adaptGiteeRelease(
  release: GiteeRelease,
  repo: string,
  assetPatterns: Record<string, string> = {}
): Release | null {
  if (release.draft) return null;

  let releaseNote = release.body || '';
  const meta = parseMeta(releaseNote);
  
  // Remove meta block from release notes
  releaseNote = releaseNote.replace(META_REGEXP, '').trim();

  const assets = matchAssets(release.assets || [], assetPatterns);

  // Merge meta assets if present
  if (meta?.assets) {
    Object.assign(assets, meta.assets);
  }

  return {
    provider: 'gitee',
    id: String(release.id),
    repo,
    title: release.name || release.tag_name,
    version: meta?.version || release.tag_name,
    created_at: release.created_at,
    published_at: release.created_at, // Gitee doesn't have published_at
    prerelease: release.prerelease,
    release_note: releaseNote,
    assets,
    urls: meta?.urls,
    meta: meta ?? undefined,
  };
}

/**
 * Fetch releases from GitHub API
 */
export async function fetchGitHubReleases(
  repo: string,
  assetPatterns: Record<string, string> = {}
): Promise<Release[]> {
  const url = `https://api.github.com/repos/${repo}/releases`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'nextjs-starter-zoe-app',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch GitHub releases: ${response.status}`);
      return [];
    }

    const data: GitHubRelease[] = await response.json();
    
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map(r => adaptGitHubRelease(r, repo, assetPatterns))
      .filter((r): r is Release => r !== null);
  } catch (error) {
    console.error('Error fetching GitHub releases:', error);
    return [];
  }
}

/**
 * Fetch releases from Gitee API
 */
export async function fetchGiteeReleases(
  repo: string,
  assetPatterns: Record<string, string> = {}
): Promise<Release[]> {
  const url = `https://gitee.com/api/v5/repos/${repo}/releases`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch Gitee releases: ${response.status}`);
      return [];
    }

    const data: GiteeRelease[] = await response.json();
    
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map(r => adaptGiteeRelease(r, repo, assetPatterns))
      .filter((r): r is Release => r !== null)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (error) {
    console.error('Error fetching Gitee releases:', error);
    return [];
  }
}

/**
 * Fetch releases from multiple sources
 */
export async function fetchReleases(
  configs: ReleaseConfig[]
): Promise<Release[]> {
  const allReleases = await Promise.all(
    configs.map(async (config) => {
      const provider = config.provider || 'github';
      const patterns = config.assetRegexPatterns || {};
      
      if (provider === 'github') {
        return fetchGitHubReleases(config.repo, patterns);
      } else if (provider === 'gitee') {
        return fetchGiteeReleases(config.repo, patterns);
      }
      return [];
    })
  );

  return allReleases.flat();
}

/**
 * Get the latest stable release
 */
export function getLatestRelease(
  releases: Release[],
  includePrerelease: boolean = false
): Release | undefined {
  return releases.find(r => includePrerelease || !r.prerelease);
}

/**
 * Group releases by version major.minor
 */
export function groupReleasesByVersion(releases: Release[]): Map<string, Release[]> {
  const groups = new Map<string, Release[]>();
  
  for (const release of releases) {
    // Extract major.minor from version (e.g., "v1.2.3" -> "1.2")
    const match = release.version.match(/v?(\d+)\.(\d+)/);
    const key = match ? `${match[1]}.${match[2]}` : 'other';
    
    const existing = groups.get(key) || [];
    existing.push(release);
    groups.set(key, existing);
  }
  
  return groups;
}
