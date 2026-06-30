"use client";

import { useEffect, useState } from "react";
import { Apple, Smartphone, Monitor, Terminal, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * AppRelease — 轻量嵌入式下载组件
 * 用于 MDX 文章中嵌入"立即下载"按钮组
 * 注意：落地页 /releases 使用 ReleaseCard/ReleaseList，走 server-side 取数
 */

interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
}

interface ReleaseData {
  version: string;
  publishedAt: string;
  releaseNote?: string;
  assets: Partial<Record<Platform, ReleaseAsset>>;
}

type Platform = "android" | "ios" | "windows" | "macos" | "linux";

interface AppReleaseProps {
  /** GitHub/Gitee 仓库 (e.g., "owner/repo") */
  repo?: string;
  /** 数据源 */
  provider?: "github" | "gitee";
  /** 手动指定各平台下载链接 */
  urls?: Partial<Record<Platform, string>>;
  /** 资源文件名匹配正则 */
  assetPatterns?: Partial<Record<Platform, string>>;
  /** 支持的平台 */
  platforms?: Platform[];
  /** 隐藏不支持的平台 */
  hideUnsupported?: boolean;
  /** 显示版本信息 */
  showVersion?: boolean;
  className?: string;
}

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  android: Smartphone,
  ios: Apple,
  windows: Monitor,
  macos: Apple,
  linux: Terminal,
};

const platformLabels: Record<Platform, string> = {
  android: "Android",
  ios: "iOS",
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};

const defaultAssetPatterns: Record<Platform, string> = {
  android: "\\.apk$",
  ios: "\\.ipa$",
  windows: "(\\.exe$|\\.msi$|windows)",
  macos: "(\\.dmg$|\\.pkg$|darwin|macos)",
  linux: "(\\.AppImage$|\\.deb$|\\.rpm$|linux)",
};

async function fetchRelease(
  provider: "github" | "gitee",
  repo: string,
  patterns: Record<string, string>
): Promise<ReleaseData | null> {
  try {
    const url =
      provider === "gitee"
        ? `https://gitee.com/api/v5/repos/${repo}/releases/latest`
        : `https://api.github.com/repos/${repo}/releases/latest`;

    const res = await fetch(url, {
      headers:
        provider === "github"
          ? { Accept: "application/vnd.github.v3+json" }
          : {},
    });

    if (!res.ok) return null;
    const data = await res.json();

    const assets: ReleaseData["assets"] = {};
    for (const asset of data.assets || []) {
      const name = asset.name.toLowerCase();
      for (const [platform, pattern] of Object.entries(patterns)) {
        const p = platform as Platform;
        if (new RegExp(pattern, "i").test(name) && !assets[p]) {
          assets[p] = {
            name: asset.name,
            url: asset.browser_download_url,
            size: asset.size,
          };
        }
      }
    }

    return {
      version: data.tag_name,
      publishedAt: data.published_at || data.created_at,
      releaseNote: data.body,
      assets,
    };
  } catch {
    return null;
  }
}

export function AppRelease({
  repo,
  provider = "github",
  urls = {},
  assetPatterns,
  platforms = ["android", "ios", "windows", "macos"],
  hideUnsupported = true,
  showVersion = true,
  className,
}: AppReleaseProps) {
  const [loading, setLoading] = useState(!!repo);
  const [release, setRelease] = useState<ReleaseData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repo) return;

    setLoading(true);
    setError(null);

    const patterns = { ...defaultAssetPatterns, ...(assetPatterns || {}) };

    fetchRelease(provider, repo, patterns)
      .then((data) => {
        if (data) {
          setRelease(data);
        } else {
          setError("No release found");
        }
      })
      .catch(() => setError("Failed to fetch release"))
      .finally(() => setLoading(false));
  }, [repo, provider, assetPatterns]);

  const getDownloadUrl = (platform: Platform): string | null => {
    if (urls[platform]) return urls[platform]!;
    if (release?.assets[platform]) return release.assets[platform]!.url;
    return null;
  };

  const availablePlatforms = platforms.filter((p) => {
    if (!hideUnsupported) return true;
    return getDownloadUrl(p) !== null;
  });

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (error && !Object.keys(urls).length) {
    return (
      <div className={cn("text-center py-6 text-sm text-muted-foreground border rounded-lg bg-muted/30", className)}>
        <p>{error}</p>
      </div>
    );
  }

  if (availablePlatforms.length === 0) {
    return (
      <div className={cn("text-center py-6 text-sm text-muted-foreground", className)}>
        <p>No downloads available</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Download buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {availablePlatforms.map((platform) => {
          const url = getDownloadUrl(platform);
          const Icon = platformIcons[platform] || Download;
          const label = platformLabels[platform] || platform;

          return (
            <Button
              key={platform}
              variant={url ? "default" : "outline"}
              size="lg"
              className="min-w-[140px]"
              disabled={!url}
              asChild={!!url}
            >
              {url ? (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <Icon className="mr-2 h-5 w-5" />
                  {label}
                </a>
              ) : (
                <span>
                  <Icon className="mr-2 h-5 w-5" />
                  {label}
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Version info */}
      {showVersion && release && (
        <div className="text-center text-xs text-muted-foreground">
          <span className="font-mono">{release.version}</span>
          {release.publishedAt && (
            <>
              <span className="mx-2">·</span>
              <span>{new Date(release.publishedAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
