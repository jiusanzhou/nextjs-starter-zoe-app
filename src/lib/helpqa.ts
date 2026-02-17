/**
 * Help/QA System - GitHub Issues Integration
 * 从 GitHub/Gitee Issues 获取帮助内容
 */

export interface HelpCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
}

export interface HelpItem {
  id: string;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  isPinned: boolean;
  createdAt: string;
  categories: HelpCategory[];
}

interface GitHubLabel {
  id: number;
  name: string;
  description: string | null;
  color: string;
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  created_at: string;
  assignee: object | null;
  labels: GitHubLabel[];
}

interface HelpQAConfig {
  provider?: 'github' | 'gitee';
  repo: string;
  labelPrefix?: string;
  state?: 'open' | 'closed' | 'all';
}

/**
 * 解析 label description 的 meta 信息
 * 格式: key:value, key2:value2 或纯文本描述
 */
function parseMetaDescription(s: string | null): Record<string, string | null> {
  if (!s) return {};
  
  // 如果没有 : 和 , 分隔符，当作普通描述
  if (!s.includes(':') && !s.includes(',')) {
    return { description: s };
  }
  
  const res: Record<string, string | null> = {};
  s.split(',').forEach((part) => {
    const [key, ...valueParts] = part.split(':');
    res[key.trim()] = valueParts.length > 0 ? valueParts.join(':').trim() : null;
  });
  return res;
}

/**
 * 解析 GitHub Label 为 HelpCategory
 */
function parseCategory(label: GitHubLabel, labelPrefix?: string): HelpCategory | null {
  let name = label.name;
  
  if (labelPrefix) {
    const parts = label.name.split(':');
    if (parts[0] !== labelPrefix) {
      return null;
    }
    name = parts.slice(1).join(':').trim();
  }
  
  const meta = parseMetaDescription(label.description);
  
  return {
    id: String(label.id),
    name,
    color: `#${label.color}`,
    description: meta.description || undefined,
    icon: meta.icon || undefined,
  };
}

/**
 * 解析 GitHub Issue 为 HelpItem
 */
function parseHelpItem(
  issue: GitHubIssue,
  labelPrefix?: string,
  stateFilter?: string
): HelpItem | null {
  if (stateFilter && stateFilter !== issue.state) {
    return null;
  }
  
  if (!issue.labels || issue.labels.length === 0) {
    return null;
  }
  
  const categories = issue.labels
    .map((label) => parseCategory(label, labelPrefix))
    .filter((c): c is HelpCategory => c !== null);
  
  // 如果没有匹配的 label，跳过
  if (categories.length === 0) {
    return null;
  }
  
  return {
    id: String(issue.id),
    number: issue.number,
    title: issue.title,
    body: issue.body || '',
    state: issue.state as 'open' | 'closed',
    isPinned: issue.assignee !== null,
    createdAt: issue.created_at,
    categories,
  };
}

/**
 * 从 GitHub API 获取 Labels
 */
async function fetchGitHubLabels(repo: string): Promise<GitHubLabel[]> {
  const url = `https://api.github.com/repos/${repo}/labels`;
  
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      }),
    },
    next: { revalidate: 3600 },
  });
  
  if (!res.ok) {
    console.error(`Failed to fetch labels from ${repo}: ${res.status}`);
    return [];
  }
  
  return res.json();
}

/**
 * 从 GitHub API 获取 Issues
 */
async function fetchGitHubIssues(repo: string): Promise<GitHubIssue[]> {
  const url = `https://api.github.com/repos/${repo}/issues?state=all&per_page=100`;
  
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      }),
    },
    next: { revalidate: 3600 },
  });
  
  if (!res.ok) {
    console.error(`Failed to fetch issues from ${repo}: ${res.status}`);
    return [];
  }
  
  return res.json();
}

/**
 * 获取所有帮助分类
 */
export async function getHelpCategories(config: HelpQAConfig): Promise<HelpCategory[]> {
  const { repo, labelPrefix = 'help' } = config;
  
  const labels = await fetchGitHubLabels(repo);
  
  return labels
    .map((label) => parseCategory(label, labelPrefix))
    .filter((c): c is HelpCategory => c !== null);
}

/**
 * 获取所有帮助项目
 */
export async function getHelpItems(config: HelpQAConfig): Promise<HelpItem[]> {
  const { repo, labelPrefix = 'help', state } = config;
  
  const issues = await fetchGitHubIssues(repo);
  
  return issues
    .map((issue) => parseHelpItem(issue, labelPrefix, state))
    .filter((item): item is HelpItem => item !== null)
    .sort((a, b) => b.number - a.number);
}

/**
 * 获取热门（置顶）帮助项目
 */
export async function getPinnedHelpItems(config: HelpQAConfig): Promise<HelpItem[]> {
  const items = await getHelpItems(config);
  return items.filter((item) => item.isPinned);
}

/**
 * 获取指定分类下的帮助项目
 */
export async function getHelpItemsByCategory(
  config: HelpQAConfig,
  categoryId: string
): Promise<HelpItem[]> {
  const items = await getHelpItems(config);
  return items.filter((item) =>
    item.categories.some((cat) => cat.id === categoryId)
  );
}

/**
 * 根据 ID 获取单个帮助项目
 */
export async function getHelpItemById(
  config: HelpQAConfig,
  itemId: string
): Promise<HelpItem | null> {
  const items = await getHelpItems(config);
  return items.find((item) => item.id === itemId) || null;
}

/**
 * 根据 number 获取单个帮助项目
 */
export async function getHelpItemByNumber(
  config: HelpQAConfig,
  number: number
): Promise<HelpItem | null> {
  const items = await getHelpItems(config);
  return items.find((item) => item.number === number) || null;
}
