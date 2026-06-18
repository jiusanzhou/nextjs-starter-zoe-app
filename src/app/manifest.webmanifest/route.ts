import { loadZoeConfig } from "@/lib/zoefile";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

const mimeByExt: Record<string, string> = {
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  ico: "image/x-icon",
  gif: "image/gif",
};

function guessMime(src: string): string {
  const m = src.match(/\.([a-z0-9]+)(?:\?.*)?$/i);
  return (m && mimeByExt[m[1].toLowerCase()]) || "image/png";
}

export async function GET() {
  const config = await loadZoeConfig();

  // Icon 解析优先级：config.logo > author.avatar > 内置 PWA icons
  const customIcon = config.logo || config.author?.avatar;

  const icons = customIcon
    ? [
        {
          src: customIcon,
          sizes: "any",
          type: guessMime(customIcon),
          purpose: "any",
        },
        // 兜底：保留 PNG 多尺寸 icon（用于 maskable / Android 安装）
        {
          src: "/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ]
    : [
        {
          src: "/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ];

  const manifest = {
    name: config.title,
    short_name: config.title,
    description: config.description || "",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait-primary",
    icons,
    categories: ["website", "blog"],
    lang: config.lang || "zh-CN",
    scope: "/",
    prefer_related_applications: false,
    shortcuts: [
      {
        name: "博客",
        short_name: "博客",
        url: "/blog",
        icons: [],
      },
      {
        name: "项目",
        short_name: "项目",
        url: "/projects",
        icons: [],
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
