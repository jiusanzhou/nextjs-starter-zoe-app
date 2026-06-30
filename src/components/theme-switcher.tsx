"use client";

import * as React from "react";
import { Palette, Check } from "lucide-react";

/**
 * 主题集合 — 与 src/styles/themes.css 中定义的 html.theme-xxx 对应
 * label: UI 显示名
 * swatch: 圆点配色（[底色, 主色, 强调色]）— 用于按钮内 mini 预览
 */
const THEMES = [
  { name: "default", label: "Default", swatch: ["#0a0a0a", "#fafafa", "#fafafa"] },
  { name: "vercel", label: "Vercel", swatch: ["#ffffff", "#000000", "#fafafa"] },
  { name: "wellwell", label: "WellWell", swatch: ["#fdfaf3", "#d97a3a", "#7fbf8a"] },
  { name: "wenzi", label: "Wenzi · 文子", swatch: ["#f4f0e6", "#1a1f33", "#d4f23a"] },
  { name: "linear", label: "Linear", swatch: ["#0f1729", "#5e6ad2", "#a855f7"] },
  { name: "stripe", label: "Stripe", swatch: ["#ffffff", "#635bff", "#00d4ff"] },
  { name: "terminal", label: "Terminal", swatch: ["#000000", "#00ff66", "#00ff66"] },
];

const STORAGE_KEY = "zoe-starter-theme-preview";

function applyTheme(name: string) {
  const html = document.documentElement;
  // 移除所有 theme-xxx class
  html.classList.forEach((cls) => {
    if (cls.startsWith("theme-")) html.classList.remove(cls);
  });
  html.classList.add(`theme-${name}`);
}

function readThemeFromURL(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const t = params.get("theme");
  if (t && THEMES.find((x) => x.name === t)) return t;
  return null;
}

function writeThemeToURL(name: string) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("theme", name);
  // 不刷新页面，更新 URL
  window.history.replaceState({}, "", url.toString());
}

export function ThemeSwitcher() {
  const [current, setCurrent] = React.useState<string>("default");
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // 初始化：URL > localStorage > <html> 当前 class
  React.useEffect(() => {
    setMounted(true);

    // 读取 <html> 上已有的 theme-xxx class（SSR 时由 layout 写入）
    const html = document.documentElement;
    let initial = "default";
    html.classList.forEach((cls) => {
      if (cls.startsWith("theme-")) initial = cls.slice("theme-".length);
    });

    // URL 优先
    const fromURL = readThemeFromURL();
    if (fromURL) {
      initial = fromURL;
    } else {
      // 否则用 localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && THEMES.find((x) => x.name === saved)) initial = saved;
      } catch {}
    }

    setCurrent(initial);
    applyTheme(initial);
  }, []);

  const handleSelect = (name: string) => {
    setCurrent(name);
    applyTheme(name);
    writeThemeToURL(name);
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch {}
    setOpen(false);
  };

  // 点击外部关闭
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!mounted) return null;

  const currentTheme = THEMES.find((t) => t.name === current) || THEMES[0];

  return (
    <div
      ref={ref}
      className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50"
      style={{ fontFamily: "var(--font-geist-sans, system-ui)" }}
    >
      {/* 展开面板 */}
      {open && (
        <div
          className="mb-2 rounded-xl border bg-background/95 backdrop-blur-md shadow-xl overflow-hidden"
          style={{ minWidth: "240px" }}
        >
          <div className="px-4 py-2.5 border-b text-xs font-medium text-muted-foreground uppercase tracking-wider">
            预览主题 · Preview Theme
          </div>
          <div className="py-1">
            {THEMES.map((t) => {
              const isActive = t.name === current;
              return (
                <button
                  key={t.name}
                  onClick={() => handleSelect(t.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent ${
                    isActive ? "bg-accent/50 font-medium" : ""
                  }`}
                >
                  <div className="flex -space-x-1">
                    {t.swatch.map((c, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-border/50"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="flex-1 text-left">{t.label}</span>
                  {isActive && <Check className="w-4 h-4 opacity-70" />}
                </button>
              );
            })}
          </div>
          <div className="px-4 py-2 border-t bg-muted/30">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              在 <code className="font-mono text-foreground/80">zoe-site.yaml</code> 中设置{" "}
              <code className="font-mono text-foreground/80">theme:</code> 字段切换
            </p>
          </div>
        </div>
      )}

      {/* 触发按钮 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full border bg-background/90 backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-background transition-all group"
        aria-label="切换主题预览"
      >
        <Palette className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        <div className="flex -space-x-1">
          {currentTheme.swatch.map((c, i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full border border-border/50"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <span className="text-xs font-medium">{currentTheme.label}</span>
      </button>
    </div>
  );
}
