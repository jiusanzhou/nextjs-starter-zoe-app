/**
 * GitHub Projects Provider
 * 从 GitHub API 获取指定用户/组织的仓库列表（按 tag/topic 筛选）
 */

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  archived: boolean;
  fork: boolean;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface ProjectFromGitHub {
  id: string;
  name: string;
  title: string;
  description: string;
  url: string;
  homepage?: string;
  repo: string;
  language?: string;
  stars: number;
  forks: number;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  owner: string;
  ownerAvatar: string;
}

export interface ProjectsConfig {
  provider?: 'github';
  tag?: string;  // topic/tag 筛选
  owners: string[];  // 用户名/组织名列表
}

/**
 * 从 GitHub API 获取用户的所有公开仓库
 */
async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const url = `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`;
  
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'nextjs-starter-zoe-app',
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch repos for ${username}: ${res.status}`);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching repos for ${username}:`, error);
    return [];
  }
}

/**
 * 按 topic 筛选仓库
 */
function filterReposByTopic(repos: GitHubRepo[], topic?: string): GitHubRepo[] {
  if (!topic) return repos;
  
  return repos.filter((repo) =>
    repo.topics.some((t) => t.toLowerCase() === topic.toLowerCase())
  );
}

/**
 * 转换 GitHub 仓库为项目格式
 */
function adaptRepo(repo: GitHubRepo): ProjectFromGitHub {
  return {
    id: String(repo.id),
    name: repo.name,
    title: repo.name,
    description: repo.description || '',
    url: repo.html_url,
    homepage: repo.homepage || undefined,
    repo: repo.full_name,
    language: repo.language || undefined,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    topics: repo.topics,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    owner: repo.owner.login,
    ownerAvatar: repo.owner.avatar_url,
  };
}

/**
 * 获取所有配置的项目
 */
export async function getGitHubProjects(config: ProjectsConfig): Promise<ProjectFromGitHub[]> {
  const { owners, tag } = config;
  
  if (!owners || owners.length === 0) {
    return [];
  }
  
  // 并行获取所有 owner 的仓库
  const allReposArrays = await Promise.all(
    owners.map((owner) => fetchUserRepos(owner))
  );
  
  // 合并所有仓库
  let allRepos = allReposArrays.flat();
  
  // 排除 fork 和 archived
  allRepos = allRepos.filter((repo) => !repo.fork && !repo.archived);
  
  // 按 topic 筛选
  if (tag) {
    allRepos = filterReposByTopic(allRepos, tag);
  }
  
  // 按 star 数排序
  allRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  
  return allRepos.map(adaptRepo);
}

/**
 * 搜索 GitHub 仓库（备用方案，支持更复杂的查询）
 */
export async function searchGitHubRepos(
  query: string,
  options: { topic?: string; user?: string } = {}
): Promise<ProjectFromGitHub[]> {
  let q = query;
  if (options.topic) q += ` topic:${options.topic}`;
  if (options.user) q += ` user:${options.user}`;
  
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&per_page=30`;
  
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'nextjs-starter-zoe-app',
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      console.error(`Failed to search repos: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    return (data.items || []).map(adaptRepo);
  } catch (error) {
    console.error('Error searching repos:', error);
    return [];
  }
}
