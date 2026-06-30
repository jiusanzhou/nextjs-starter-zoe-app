/**
 * (site) route group layout
 *
 * 所有"默认 locale"路由都在这个 route group 下：渲染 SiteShell 并不带 locale 参数
 * （SiteShell 内部会取 default locale）。
 *
 * 非默认 locale 走 `app/[lang]/layout.tsx`（同样渲染 SiteShell，但传入 lang）。
 *
 * 注意：root `app/layout.tsx` 现在只渲染 <html><body> + ThemeProvider + Analytics。
 */

import { SiteShell } from "@/components/site-shell";

export default function SiteGroupLayout({ children }: { children: React.ReactNode }) {
  // 不传 locale → SiteShell 用默认 locale 加载 config（向后兼容单语言站）
  return <SiteShell>{children}</SiteShell>;
}
