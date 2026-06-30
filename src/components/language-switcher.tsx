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
 * - 保留 query string 和 hash
 *
 * 注意：目前只支持 prefix-except-default。`prefix` 策略 D3 再做。
 */

import { useRouter, usePathname } from "next/navigation";
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
}

export function LanguageSwitcher({
  currentLocale,
  locales,
  defaultLocale,
  localeNames,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  function buildHref(target: string): string {
    // 去掉当前路径里已有的 locale 前缀（如果有）
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
          return (
            <DropdownMenuItem
              key={loc}
              onSelect={() => router.push(buildHref(loc))}
              className={isActive ? "font-semibold" : ""}
            >
              <span className="text-xs uppercase tracking-wider text-muted-foreground mr-2">
                {loc}
              </span>
              <span>{label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
