"use client";

/**
 * <LanguageSwitcher />
 *
 * Header 右侧的语言切换菜单。
 *
 * 行为：
 * - 给定当前 locale + 全部 locales，渲染下拉菜单
 * - 切换时根据 `prefix-except-default` 路由策略改写 URL：
 *     - 默认 locale → /<...rest>
 *     - 其他 locale → /<locale>/<...rest>
 * - 自动从 <link rel="alternate" hreflang="...">（由 Next.js metadata alternates 注入）
 *   读取当前页面的"已存在翻译" URL 并优先使用。这意味着博文等 per-locale slug
 *   不同的内容会跳到正确的翻译 URL；如果某 locale 没有 alternate（翻译不存在），
 *   则按默认行为改写 URL 前缀（最终会被 Next 的 generateStaticParams 处理为
 *   404 或回退到列表页）。
 * - 保留 query string 和 hash
 *
 * 注意：目前只支持 prefix-except-default。`prefix` 策略 D3 再做。
 */

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherProps {
  currentLocale: string;
  locales: string[];
  defaultLocale: string;
  localeNames?: Record<string, string>;
  /**
   * 可选：每个 locale 对应的页面路径（含 locale 前缀）。
   * - string → 切换时直接跳该路径（用于"同一内容多语言版本但 slug 不同"的场景）
   * - null → 该 locale 不存在翻译，使用 fallbackHrefs[locale]，否则回退到 locale 根路径
   * 未在 overrides 里的 locale 走默认行为（保留当前 pathname 改前缀）
   */
  pathOverrides?: Record<string, string | null>;
  fallbackHrefs?: Record<string, string>;
}

export function LanguageSwitcher({
  currentLocale,
  locales,
  defaultLocale,
  localeNames,
  pathOverrides,
  fallbackHrefs,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * 从 DOM 读 <link rel="alternate" hreflang="..."> 作为 pathOverrides 的客户端来源。
   * Next.js metadata 的 alternates.languages 会把这些 link 渲染到 <head> 里。
   * 这样博文等"同 slug 多语言"内容能拿到正确的目标 URL。
   */
  const [domOverrides, setDomOverrides] = useState<Record<string, string | null>>({});
  useEffect(() => {
    if (typeof document === "undefined") return;
    const links = document.querySelectorAll<HTMLLinkElement>(
      'link[rel="alternate"][hreflang]',
    );
    const map: Record<string, string | null> = {};
    const found = new Set<string>();
    links.forEach((link) => {
      const lang = link.hreflang;
      const href = link.href;
      if (!lang || lang === "x-default" || !href) return;
      try {
        const url = new URL(href);
        map[lang] = url.pathname + url.search + url.hash;
        found.add(lang);
      } catch {
        /* ignore */
      }
    });
    // 对未出现的 locale（非当前 locale）标 null → 暗示该 locale 没翻译
    for (const loc of locales) {
      if (loc !== currentLocale && !found.has(loc)) {
        map[loc] = null;
      }
    }
    setDomOverrides(map);
  }, [pathname, locales, currentLocale]);

  // 合并：用户传入的 overrides 优先，DOM 自动探测作为 fallback
  const effectiveOverrides: Record<string, string | null> = {
    ...domOverrides,
    ...(pathOverrides || {}),
  };

  function buildHref(target: string): string {
    // 1. pathOverrides 优先
    if (target in effectiveOverrides) {
      const override = effectiveOverrides[target];
      if (typeof override === "string") return override;
      // null → fallback
      if (fallbackHrefs && fallbackHrefs[target]) return fallbackHrefs[target];
      // 默认 fallback：退回到 locale 根路径
      // 但更友好的是：如果当前在 /blog/* 路径，跳 /<lang>/blog 列表页
      const segments = pathname.split("/").filter(Boolean);
      let rest = segments;
      if (segments[0] && locales.includes(segments[0])) {
        rest = segments.slice(1);
      }
      // 只保留第一段（section root，如 blog / projects / products）
      const section = rest[0] || "";
      if (section) {
        return target === defaultLocale ? `/${section}` : `/${target}/${section}`;
      }
      return target === defaultLocale ? "/" : `/${target}`;
    }

    // 2. 默认行为：去掉当前路径里已有的 locale 前缀（如果有），换成 target
    const segments = pathname.split("/").filter(Boolean);
    let rest = segments;
    if (segments[0] && locales.includes(segments[0])) {
      rest = segments.slice(1);
    }
    const tail = rest.join("/");

    if (target === defaultLocale) {
      return tail ? `/${tail}` : "/";
    }
    return tail ? `/${target}/${tail}` : `/${target}`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Switch language"
      >
        <Globe className="h-4 w-4" />
        <span className="sr-only">Switch language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[8rem]">
        {locales.map((loc) => {
          const label = localeNames?.[loc] || loc.toUpperCase();
          const isActive = loc === currentLocale;
          const isMissingTranslation =
            loc in effectiveOverrides && effectiveOverrides[loc] === null;
          return (
            <DropdownMenuItem
              key={loc}
              onSelect={() => router.push(buildHref(loc))}
              className={isActive ? "font-semibold" : ""}
              title={isMissingTranslation ? "Translation not available — will redirect to listing" : undefined}
            >
              <span className="text-xs uppercase tracking-wider text-muted-foreground mr-2">
                {loc}
              </span>
              <span className={isMissingTranslation ? "text-muted-foreground/70" : ""}>
                {label}
                {isMissingTranslation ? " ↗" : ""}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
