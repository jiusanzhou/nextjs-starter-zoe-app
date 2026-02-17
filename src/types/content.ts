/**
 * Content Types
 * 内容类型定义
 */

export interface PostTag {
  name: string;
  slug: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  date: string;
  modifiedDate?: string;
  tags?: PostTag[];
  banner?: string;
  published?: boolean;
  pinned?: boolean;
  readingTime?: number;
}

export interface Post extends PostMeta {
  content: string;
  rawContent?: string;
}

export interface PageMeta {
  slug: string;
  title: string;
  description?: string;
  layout?: string;
  container?: string;
}

export interface Page extends PageMeta {
  content: string;
}

export interface ProjectMeta {
  slug: string;
  title: string;
  description?: string;
  repo?: string;
  url?: string;
  banner?: string;
  tags?: string[];
  featured?: boolean;
}

export interface Project extends ProjectMeta {
  content: string;
}
