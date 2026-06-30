/**
 * [lang] route group layout
 *
 * 命中非默认 locale 时进入这个分支：
 * - generateStaticParams 仅输出"非默认 locale"，避免和 (site) 路由产生 URL 冲突
 * - 用 SiteShell 包裹，传入当前 locale
 *
 * URL 形态：
 *   - /<locale>/             → homepage in <locale>
 *   - /<locale>/[...slug]    → 该 locale 的 MDX pages
 *   - 其余路由（blog/products/...）在 D3 镜像
 */

import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import {
  getLocales,
  getDefaultLocale,
  isI18nEnabled,
  isValidLocale,
} from "@/lib/zoefile";

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

/**
 * 仅生成"非默认 locale"。默认 locale 走 (site) 不带前缀。
 * 单语言站：返回 [] 等同关闭 [lang] 整棵子树（不会被静态导出）。
 */
export async function generateStaticParams(): Promise<{ lang: string }[]> {
  if (!isI18nEnabled()) return [{ lang: "__placeholder__" }];
  const def = getDefaultLocale();
  const langs = getLocales().filter((loc) => loc !== def);
  if (langs.length === 0) return [{ lang: "__placeholder__" }];
  return langs.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === getDefaultLocale()) {
    notFound();
  }
  return <SiteShell locale={lang}>{children}</SiteShell>;
}
