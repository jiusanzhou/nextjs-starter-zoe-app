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
 * 开发模式下会合并 _example/zoe-site.yaml 的配置
 */
export function loadZoeConfig(): ZoeSiteConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const root = getProjectRoot();
  const configPath = path.join(root, 'zoe-site.yaml');
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }

  const fileContent = fs.readFileSync(configPath, 'utf-8');
  let config = yaml.load(fileContent) as ZoeSiteConfig;

  // 开发模式下合并 _example/zoe-site.yaml
  const useExample = process.env.NODE_ENV === 'development' || process.env.USE_EXAMPLE_CONTENT === 'true';
  const exampleConfigPath = path.join(root, '_example/zoe-site.yaml');
  
  if (useExample && fs.existsSync(exampleConfigPath)) {
    const exampleContent = fs.readFileSync(exampleConfigPath, 'utf-8');
    const exampleConfig = yaml.load(exampleContent) as Partial<ZoeSiteConfig>;
    
    // _example 配置作为基础，根目录配置覆盖
    config = deepMerge(exampleConfig as ZoeSiteConfig, config);
  }

  // 处理变量替换，例如 ${zoe.title}
  cachedConfig = processVariables(config, config);
  
  return cachedConfig;
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
    lang: config.lang || 'en',
    author: config.author,
  };
}
