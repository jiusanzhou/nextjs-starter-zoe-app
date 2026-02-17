"use client";

import * as React from "react";
import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { themes } from "@/styles/themes";
import { cn } from "@/lib/utils";

const THEME_STORAGE_KEY = "zoe-theme-style";

// 主题名称列表
const themeNames = themes.map((t) => `theme-${t.name}`);

export function ThemeStyleToggle() {
  const [currentTheme, setCurrentTheme] = React.useState<string>("default");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && themes.some((t) => t.name === stored)) {
      setCurrentTheme(stored);
      applyTheme(stored);
    } else {
      // 检查 html 上是否已有主题类
      const htmlClasses = document.documentElement.classList;
      const existingTheme = themeNames.find((t) => htmlClasses.contains(t));
      if (existingTheme) {
        const themeName = existingTheme.replace("theme-", "");
        setCurrentTheme(themeName);
      }
    }
  }, []);

  const applyTheme = (themeName: string) => {
    const theme = themes.find((t) => t.name === themeName);
    if (!theme) return;

    const html = document.documentElement;
    
    // 移除所有旧主题类
    themeNames.forEach((t) => {
      html.classList.remove(t);
    });
    
    // 添加新主题类
    html.classList.add(`theme-${themeName}`);
    
    // 强制重新计算样式
    html.style.setProperty("--radius", theme.radius || "0.5rem");
    
    // 存储选择
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
    setCurrentTheme(themeName);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Palette className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  const currentThemeConfig = themes.find((t) => t.name === currentTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">切换主题风格</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>主题风格</span>
          {currentThemeConfig && (
            <span className="text-xs font-normal text-muted-foreground">
              {currentThemeConfig.label}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme.name}
              onClick={() => applyTheme(theme.name)}
              className={cn(
                "flex items-center justify-between cursor-pointer py-2",
                currentTheme === theme.name && "bg-accent"
              )}
            >
              <div className="flex items-center gap-3">
                {/* 主题预览色块 */}
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{
                    background: theme.light.primary,
                  }}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{theme.label}</span>
                  {theme.description && (
                    <span className="text-xs text-muted-foreground">
                      {theme.description}
                    </span>
                  )}
                </div>
              </div>
              {currentTheme === theme.name && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
