import { loadZoeConfig } from "@/lib/zoefile";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const config = await loadZoeConfig();

  const manifest = {
    name: config.title,
    short_name: config.title,
    description: config.description || "",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait-primary",
    icons: [
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
    ],
    // Fallback: 如果没有专门的 icon，使用 logo
    ...(config.logo && {
      icons: [
        {
          src: config.logo,
          sizes: "any",
          type: "image/png",
          purpose: "any",
        },
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
      ],
    }),
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
