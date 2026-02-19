/**
 * Changelog Types
 * 更新日志类型定义
 */

export interface ChangelogMeta {
  slug: string;
  version: string;
  title?: string;
  date: string;
  breaking?: boolean;
  tags?: string[];
}

export interface Changelog extends ChangelogMeta {
  content: string;
}

export interface ChangelogConfig {
  title?: string;
  description?: string;
  // 从 GitHub Releases 获取
  github?: {
    repo: string;
    // 是否包含预发布版本
    includePrerelease?: boolean;
  };
}
