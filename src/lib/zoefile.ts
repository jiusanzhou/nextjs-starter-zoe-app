/**
 * Zoefile Loader
 * 加载和解析 zoe-site.yaml 配置文件
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { ZoeSiteConfig } from '@/types';

let cachedConfig: ZoeSiteConfig | null = null;

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
 * 加载 zoe-site.yaml 配置文件
 *
 * CI 模式（设置了 `ZOE_CONFIG_PATH` 或 `ZOE_CONFIG_LIST`）：
 *   完全使用外部注入的配置，theme 自带的 zoe-site.yaml 被忽略。
 *
 * 常规模式：
 *   1. `_example/zoe-site.yaml`（仅 dev / USE_EXAMPLE_CONTENT=true）
 *   2. theme 根目录的 `zoe-site.yaml`
 */
export function loadZoeConfig(): ZoeSiteConfig {
  // 开发模式下禁用缓存，方便编辑 zoe-site.yaml 时实时生效
  const isDev = process.env.NODE_ENV === 'development';
  if (cachedConfig && !isDev) {
    return cachedConfig;
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

  // 依次 deep merge
  let config: Record<string, unknown> = {};
  for (const filePath of layers) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const layer = yaml.load(fileContent) as Record<string, unknown>;
    if (layer && typeof layer === 'object') {
      config = deepMerge(config, layer);
    }
  }

  // 处理变量替换，例如 ${zoe.title}
  cachedConfig = processVariables(config, config);

  return cachedConfig;
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
 */
export function getSiteMetadata() {
  const config = loadZoeConfig();

  return {
    title: config.title,
    description: config.description || '',
    url: config.url || '',
    logo: config.logo,
    image: config.image,
    lang: config.lang || 'en',
    author: config.author,
    verification: config.verification,
  };
}
