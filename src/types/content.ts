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
  /**
   * Language tag of this content, e.g. "zh", "en".
   * Falls back to the site's default locale when absent.
   */
  lang?: string;
  /**
   * Pairing key for cross-locale translations. Two posts with the same
   * `translationOf` value (or sharing a stable canonical slug via this
   * field) are treated as translations of each other.
   *
   * Convention: use the canonical (original-language) slug here.
   */
  translationOf?: string;
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
  isMdx?: boolean;
  /** Language tag of this page. */
  lang?: string;
  /** Pairing key for cross-locale translations (see PostMeta.translationOf). */
  translationOf?: string;
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
  /** Language tag of this project entry. */
  lang?: string;
  /** Pairing key for cross-locale translations. */
  translationOf?: string;
}

export interface Project extends ProjectMeta {
  content: string;
}
