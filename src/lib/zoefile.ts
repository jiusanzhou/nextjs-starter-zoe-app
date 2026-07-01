/**
 * Zoefile Loader
 * 加载和解析 zoe-site.yaml 配置文件
 *
 * i18n 设计:
 * - `loadZoeConfig()` 不传参 = 返回默认 locale（向后兼容，等同未启用 i18n 时的旧行为）
 * - `loadZoeConfig(locale)` 返回应用了该 locale overrides 的配置
 * - 单语言站不需要做任何改动
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { ZoeSiteConfig, I18nConfig } from '@/types';

// 缓存：rawConfig（未应用 locale overrides）+ 按 locale 缓存的最终配置
let cachedRawConfig: ZoeSiteConfig | null = null;
const cachedByLocale = new Map<string, ZoeSiteConfig>();

/**
 * 获取项目根目录
 */
export function getProjectRoot(): string {
  return process.cwd();
}

/**
 * 深度合并两个对象
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceValue = source[key];
    const targetValue = result[key];
    
    if (
      sourceValue !== undefined &&
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      !Array.isArray(sourceValue) &&
      typeof targetValue === 'object' &&
      targetValue !== null &&
      !Array.isArray(targetValue)
    ) {
      // 递归合并对象
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as T[keyof T];
    } else if (sourceValue !== undefined) {
      // 直接覆盖（包括数组）
      result[key] = sourceValue as T[keyof T];
    }
  }
  
  return result;
}

/**
 * 加载 zoe-site.yaml 原始配置（不带 locale overrides）
 *
 * 支持两种来源：
 *   - CI 模式（设置了 `ZOE_CONFIG_PATH` 或 `ZOE_CONFIG_LIST`）：完全使用外部
 *     注入的配置，theme 自带的 zoe-site.yaml 被忽略
 *   - 常规模式：
 *       1. `_example/zoe-site.yaml`（仅 dev / USE_EXAMPLE_CONTENT=true）
 *       2. theme 根目录的 `zoe-site.yaml`
 *
 * 内部缓存。开发模式下禁用 raw 缓存（方便热改 yaml）。
 */
function loadRawConfig(): ZoeSiteConfig {
  const isDev = process.env.NODE_ENV === 'development';
  if (cachedRawConfig && !isDev) {
    return cachedRawConfig;
  }

  const root = getProjectRoot();
  const externalList = readExternalConfigList();

  // 收集所有要合并的配置路径
  const layers: string[] = [];

  if (externalList.length > 0) {
    // CI 模式：仅使用外部配置
    layers.push(...externalList);
  } else {
    // 常规模式
    const useExample = process.env.NODE_ENV === 'development' || process.env.USE_EXAMPLE_CONTENT === 'true';
    const exampleConfigPath = path.join(root, '_example/zoe-site.yaml');
    if (useExample && fs.existsSync(exampleConfigPath)) {
      layers.push(exampleConfigPath);
    }
    const themeConfigPath = path.join(root, 'zoe-site.yaml');
    if (fs.existsSync(themeConfigPath)) {
      layers.push(themeConfigPath);
    }
  }

  if (layers.length === 0) {
    throw new Error(`Configuration file not found. Set ZOE_CONFIG_PATH or place zoe-site.yaml at ${root}`);
  }

  // 依次 deep merge（前面的作为基础，后面的覆盖）
  let config: Record<string, unknown> = {};
  for (const filePath of layers) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const layer = yaml.load(fileContent) as Record<string, unknown>;
    if (layer && typeof layer === 'object') {
      config = deepMerge(config, layer);
    }
  }

  // 处理变量替换，例如 ${zoe.title}
  cachedRawConfig = processVariables(config, config);

  // dev 模式下，每次重新读 yaml 后也要清掉 per-locale 缓存
  if (isDev) {
    cachedByLocale.clear();
  }

  return cachedRawConfig;
}

/**
 * 加载 zoe-site.yaml 配置文件
 *
 * @param locale 可选 locale，若 i18n 已启用且该 locale 存在 overrides，
 *               则将 overrides 合并到顶层（深合并；数组直接替换）
 * @returns 解析后的配置；若未启用 i18n 或 locale 未提供，返回原始（默认）配置
 *
 * 注意：所有 callsite 不传 locale 时的行为与未启用 i18n 等价，向后兼容。
 */
export function loadZoeConfig(locale?: string): ZoeSiteConfig {
  const raw = loadRawConfig();

  // 未启用 i18n 或未指定 locale → 返回 raw
  if (!isI18nEnabled(raw) || !locale) {
    return raw;
  }

  // 已缓存
  const cached = cachedByLocale.get(locale);
  if (cached) return cached;

  const i18n = raw.i18n!;
  const overrides = i18n.overrides?.[locale];

  let resolved: ZoeSiteConfig;
  if (overrides) {
    resolved = deepMerge(
      raw as unknown as Record<string, unknown>,
      overrides as unknown as Record<string, unknown>
    ) as unknown as ZoeSiteConfig;
  } else {
    resolved = raw;
  }

  // 重新跑一次变量替换，让 overrides 中的 ${zoe.x} 也生效
  resolved = processVariables(resolved, resolved);

  // 设置 lang 字段为当前 locale（覆盖默认）
  resolved = { ...resolved, lang: locale };

  // 给所有 href 字段加 locale 前缀（仅非默认 locale 且 routing=prefix-except-default 时）
  const prefix = getLocalePrefix(locale);
  if (prefix) {
    resolved = prefixInternalHrefs(resolved, prefix) as ZoeSiteConfig;
  }

  cachedByLocale.set(locale, resolved);
  return resolved;
}

/**
 * 递归把对象/数组中所有 string-typed `href` 字段从 "/foo" 改写为
 * "<prefix>/foo"。外链 / 锚点 / protocol-relative 保持不变。
 *
 * 仅在非默认 locale 下调用——让 yaml 里写 `href: /blog` 的导航自动
 * 在 EN 站渲染成 `/en/blog`，避免用户手动写 `/en/blog`。
 */
function prefixInternalHrefs(value: unknown, prefix: string): unknown {
  if (value == null) return value;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value.map((v) => prefixInternalHrefs(v, prefix));
  }
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k === 'href' && typeof v === 'string') {
        out[k] = rewriteHref(v, prefix);
      } else {
        out[k] = prefixInternalHrefs(v, prefix);
      }
    }
    return out;
  }
  return value;
}

function rewriteHref(href: string, prefix: string): string {
  if (!href) return href;
  if (!href.startsWith('/')) return href; // 外链 (http/https/mailto/tel) 或锚点
  if (href.startsWith('//')) return href; // protocol-relative
  // 已经带前缀（罕见情况，用户手写过）
  if (href === prefix || href.startsWith(`${prefix}/`)) return href;
  return `${prefix}${href === '/' ? '' : href}`;
}

/**
 * 读取外部注入的配置清单
 * - ZOE_CONFIG_PATH=/abs/path/to/zoe-site.yaml (单文件)
 * - ZOE_CONFIG_LIST=/abs/path/to/config-list.txt (多文件清单，每行一个绝对路径)
 */
function readExternalConfigList(): string[] {
  const result: string[] = [];

  const single = process.env.ZOE_CONFIG_PATH;
  if (single && fs.existsSync(single)) {
    result.push(single);
  }

  const listFile = process.env.ZOE_CONFIG_LIST;
  if (listFile && fs.existsSync(listFile)) {
    const lines = fs.readFileSync(listFile, 'utf-8')
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#'));
    for (const line of lines) {
      if (fs.existsSync(line)) result.push(line);
    }
  }

  return result;
}

/**
 * 通过路径获取对象的值
 */
function getValueByPath(obj: unknown, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as object)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  
  return typeof current === 'string' ? current : undefined;
}

/**
 * 处理配置中的变量替换
 */
function processVariables(obj: unknown, rootConfig: unknown): ZoeSiteConfig {
  if (typeof obj === 'string') {
    return obj.replace(/\$\{zoe\.([^}]+)\}/g, (_, path) => {
      return getValueByPath(rootConfig, path) || '';
    }) as unknown as ZoeSiteConfig;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => processVariables(item, rootConfig)) as unknown as ZoeSiteConfig;
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = processVariables(value, rootConfig);
    }
    return result as unknown as ZoeSiteConfig;
  }
  
  return obj as ZoeSiteConfig;
}

/**
 * 获取站点元数据（用于 SEO）
 *
 * @param locale 可选 locale；传入时会基于该 locale 的配置返回元数据
 */
export function getSiteMetadata(locale?: string) {
  const config = loadZoeConfig(locale);

  return {
    title: config.title,
    description: config.description || '',
    slogan: config.slogan || '',
    url: config.url || '',
    logo: config.logo,
    image: config.image,
    lang: config.lang || 'en',
    author: config.author,
    verification: config.verification,
  };
}

// =============================================================
// i18n helpers
// =============================================================

/**
 * 判断 i18n 是否启用（基于原始或已解析配置）
 */
export function isI18nEnabled(config?: ZoeSiteConfig): boolean {
  const c = config ?? loadRawConfig();
  const i18n = c.i18n;
  return !!(i18n && i18n.enabled !== false && Array.isArray(i18n.locales) && i18n.locales.length > 0);
}

/**
 * 获取 i18n 配置对象（未启用时返回 undefined）
 */
export function getI18nConfig(): I18nConfig | undefined {
  const raw = loadRawConfig();
  return isI18nEnabled(raw) ? raw.i18n : undefined;
}

/**
 * 获取所有可用 locale 列表
 * 未启用 i18n 时返回 [config.lang || 'en']（兼容旧站）
 */
export function getLocales(): string[] {
  const raw = loadRawConfig();
  if (isI18nEnabled(raw)) {
    return raw.i18n!.locales;
  }
  return [raw.lang || 'en'];
}

/**
 * 获取默认 locale
 * - i18n 启用：取 i18n.defaultLocale 或 locales[0]
 * - 未启用：取 config.lang 或 'en'
 */
export function getDefaultLocale(): string {
  const raw = loadRawConfig();
  if (isI18nEnabled(raw)) {
    return raw.i18n!.defaultLocale || raw.i18n!.locales[0];
  }
  return raw.lang || 'en';
}

/**
 * 校验给定 locale 是否在 i18n.locales 列表中
 */
export function isValidLocale(locale: string): boolean {
  return getLocales().includes(locale);
}

/**
 * 解析 URL 段判断是否为 locale 前缀
 * 用法：在 `[lang]` 路由参数里传入，决定要走哪个 locale 的配置。
 *
 * - 若是有效 locale → 返回该 locale
 * - 否则 → 返回 undefined（外层路由应当继续走 `slug` 逻辑）
 */
export function parseLocaleFromSegment(segment: string | undefined | null): string | undefined {
  if (!segment) return undefined;
  return isValidLocale(segment) ? segment : undefined;
}

/**
 * 解析一个 LocalizedString（字符串 or { locale: 字符串 } map）
 *
 * 解析顺序：
 * 1. 直接是 string → 返回该 string（视为所有语言共享）
 * 2. 是 map：locale → defaultLocale → 任意首个 key
 * 3. 都没有 → 返回 ''
 */
export function resolveLocalized(
  value: string | Record<string, string> | undefined | null,
  locale?: string
): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;

  const target = locale || getDefaultLocale();
  if (value[target]) return value[target];

  const def = getDefaultLocale();
  if (value[def]) return value[def];

  const keys = Object.keys(value);
  return keys.length > 0 ? value[keys[0]] : '';
}

/**
 * 给定 locale 构造 URL 前缀（前置 `/`，末尾无斜杠）
 *
 * 例：
 *  - i18n disabled / locale=default + routing=prefix-except-default → ''
 *  - locale=en + routing=prefix-except-default(默认 zh) → '/en'
 *  - locale=zh + routing=prefix → '/zh'
 */
export function getLocalePrefix(locale?: string): string {
  if (!isI18nEnabled()) return '';
  const i18n = getI18nConfig()!;
  const routing = i18n.routing || 'prefix-except-default';
  const def = getDefaultLocale();
  const target = locale || def;

  if (routing === 'prefix-except-default' && target === def) {
    return '';
  }
  return `/${target}`;
}

/**
 * 测试钩子：清空内部缓存
 * 仅用于单测，正常请勿调用
 */
export function __resetZoeConfigCache() {
  cachedRawConfig = null;
  cachedByLocale.clear();
}

/**
 * 构造 Next.js Metadata.alternates 的 languages 映射 + canonical
 *
 * @param relativePath 不带 locale 前缀的"中性"路径，例如 "/blog/foo" 或 "/"
 * @returns { canonical, languages }，可直接展开到 metadata.alternates
 */
export function buildAlternates(relativePath: string): {
  canonical?: string;
  languages?: Record<string, string>;
} {
  if (!isI18nEnabled()) return {};
  const raw = loadRawConfig();
  const base = (raw.url || '').replace(/\/$/, '');
  if (!base) return {};

  const path = relativePath === '/' ? '' : relativePath;
  const def = getDefaultLocale();
  const languages: Record<string, string> = {};
  for (const loc of getLocales()) {
    languages[loc] = `${base}${getLocalePrefix(loc)}${path}`;
  }
  languages['x-default'] = `${base}${getLocalePrefix(def)}${path}`;
  return {
    canonical: `${base}${getLocalePrefix(def)}${path}`,
    languages,
  };
}

/**
 * 为 blog post / page 这种"内容自身就有多 locale 版本"的页面构造 alternates。
 *
 * @param translations Map<locale, slug>（来自 getPostTranslations / getAllPages 配对）
 * @param pathFn       (slug) => relative path（不含 locale 前缀），如 (s) => `/blog/${s}`
 */
export function buildAlternatesForTranslations(
  translations: Map<string, string>,
  pathFn: (slug: string) => string,
): { canonical?: string; languages?: Record<string, string> } {
  if (!isI18nEnabled() || translations.size === 0) return {};
  const raw = loadRawConfig();
  const base = (raw.url || '').replace(/\/$/, '');
  if (!base) return {};

  const def = getDefaultLocale();
  const languages: Record<string, string> = {};
  for (const [loc, slug] of translations) {
    languages[loc] = `${base}${getLocalePrefix(loc)}${pathFn(slug)}`;
  }
  const defSlug = translations.get(def);
  const canonical = defSlug
    ? `${base}${getLocalePrefix(def)}${pathFn(defSlug)}`
    : undefined;
  if (canonical) languages['x-default'] = canonical;
  return { canonical, languages };
}
