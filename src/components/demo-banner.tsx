"use client";

import * as React from "react";
import { X, Github, ExternalLink } from "lucide-react";

const STORAGE_KEY = "zoe-starter-demo-banner-dismissed";

export function DemoBanner() {
  const [dismissed, setDismissed] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const v = sessionStorage.getItem(STORAGE_KEY);
      setDismissed(v === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  };

  if (!mounted || dismissed) return null;

  return (
    <div
      className="relative w-full border-b text-sm"
      style={{
        background: "linear-gradient(90deg, oklch(0.55 0.25 280 / 0.08), oklch(0.55 0.25 195 / 0.08))",
        borderColor: "oklch(0.55 0.25 280 / 0.2)",
      }}
    >
      <div className="container flex items-center justify-between gap-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-base">🎨</span>
          <p className="text-xs md:text-sm truncate">
            <span className="font-medium">这是 nextjs-starter-zoe-app 的主题预览。</span>
            <span className="hidden md:inline text-muted-foreground ml-1">
              点击左下角切换主题，看看不同风格的效果。
            </span>
            <span className="md:hidden text-muted-foreground ml-1">
              左下角切换主题 →
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <a
            href="https://github.com/jiusanzhou/nextjs-starter-zoe-app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs hover:bg-background/60 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-md hover:bg-background/60 transition-colors"
            aria-label="关闭提示"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
