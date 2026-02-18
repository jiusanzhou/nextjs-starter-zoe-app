"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExternalLink, MoreHorizontal } from "lucide-react";

interface WechatBrokenGuideProps {
  title?: string;
  description?: string;
  tip?: string;
  logo?: string;
  className?: string;
}

/**
 * 微信内置浏览器兼容性提示
 * 在微信中打开时显示提示用户在浏览器中打开
 */
export function WechatBrokenGuide({
  title = "此页面无法在微信中正常显示",
  description = "请点击右上角菜单，选择「在浏览器中打开」",
  tip = "点击右上角 ··· 在浏览器中打开",
  logo,
  className,
}: WechatBrokenGuideProps) {
  const [isWechat, setIsWechat] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 检测微信浏览器
    const ua = navigator.userAgent.toLowerCase();
    const isWx = ua.includes("micromessenger");
    setIsWechat(isWx);
  }, []);

  // 非微信或已关闭则不显示
  if (!isWechat || dismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background p-6",
        className
      )}
    >
      {/* 右上角提示箭头 */}
      <div className="absolute top-4 right-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground animate-pulse">
        <span className="text-sm">{tip}</span>
        <MoreHorizontal className="h-5 w-5" />
      </div>

      {/* 主内容 */}
      <div className="flex flex-col items-center text-center max-w-sm">
        {/* Logo */}
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt="Logo"
            className="w-20 h-20 rounded-2xl mb-6"
          />
        )}

        {/* 标题 */}
        <h1 className="text-xl font-bold mb-3">{title}</h1>

        {/* 描述 */}
        <p className="text-muted-foreground mb-6">{description}</p>

        {/* 图示 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg px-4 py-3 mb-6">
          <span>1. 点击右上角</span>
          <MoreHorizontal className="h-4 w-4" />
          <span>→</span>
          <span>2. 选择</span>
          <ExternalLink className="h-4 w-4" />
          <span>浏览器打开</span>
        </div>

        {/* 忽略按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDismissed(true)}
          className="text-muted-foreground"
        >
          暂时忽略，继续浏览
        </Button>
      </div>
    </div>
  );
}

/**
 * 检测是否在微信浏览器中
 */
export function isWechatBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("micromessenger");
}

/**
 * Hook: 检测微信浏览器
 */
export function useWechatDetect() {
  const [isWechat, setIsWechat] = useState(false);

  useEffect(() => {
    setIsWechat(isWechatBrowser());
  }, []);

  return isWechat;
}
