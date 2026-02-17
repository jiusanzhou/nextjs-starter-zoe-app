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
import { themes, type ThemeConfig } from "@/styles/themes";
import { cn } from "@/lib/utils";

const THEME_STORAGE_KEY = "zoe-theme-style";

export function ThemeStyleToggle() {
  const [currentTheme, setCurrentTheme] = React.useState<string>("default");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      setCurrentTheme(stored);
      applyTheme(stored);
    }
  }, []);

  const applyTheme = (themeName: string) => {
    const theme = themes.find((t) => t.name === themeName);
    if (!theme) return;

    // 移除旧主题类
    document.documentElement.classList.remove(
      ...themes.map((t) => `theme-${t.name}`)
    );
    // 添加新主题类
    document.documentElement.classList.add(`theme-${themeName}`);
    
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">切换主题风格</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>主题风格</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => applyTheme(theme.name)}
            className={cn(
              "flex items-center justify-between cursor-pointer",
              currentTheme === theme.name && "bg-accent"
            )}
          >
            <div className="flex flex-col">
              <span>{theme.label}</span>
              {theme.description && (
                <span className="text-xs text-muted-foreground">
                  {theme.description}
                </span>
              )}
            </div>
            {currentTheme === theme.name && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
