"use client";

import { useEffect, useState } from "react";
import { Apple, Smartphone, Monitor, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
}

interface ReleaseData {
  version: string;
  publishedAt: string;
  releaseNote?: string;
  assets: {
    android?: ReleaseAsset;
    ios?: ReleaseAsset;
    windows?: ReleaseAsset;
    macos?: ReleaseAsset;
    linux?: ReleaseAsset;
  };
}

interface AppReleaseProps {
  /** GitHub/Gitee 仓库 (e.g., "owner/repo") */
  repo?: string;
  /** 数据源 */
  provider?: "github" | "gitee";
  /** 手动指定各平台下载链接 */
  urls?: {
    android?: string;
    ios?: string;
    windows?: string;
    macos?: string;
    linux?: string;
  };
  /** 资源文件名匹配正则 */
  assetPatterns?: {
    android?: string;
    ios?: string;
    windows?: string;
    macos?: string;
    linux?: string;
  };
  /** 支持的平台 */
  platforms?: Array<"android" | "ios" | "windows" | "macos" | "linux">;
  /** 隐藏不支持的平台 */
  hideUnsupported?: boolean;
  /** 按钮颜色 */
  colorScheme?: string;
  className?: string;
}

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  android: Smartphone,
  ios: Apple,
  windows: Monitor,
  macos: Apple,
  linux: Monitor,
};

const platformLabels: Record<string, string> = {
  android: "Android",
  ios: "iOS",
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};

const defaultAssetPatterns: Record<string, string> = {
  android: "\\.apk$",
  ios: "\\.ipa$",
  windows: "(\\.exe$|\\.msi$|windows)",
  macos: "(\\.dmg$|\\.pkg$|darwin|macos)",
  linux: "(\\.AppImage$|\\.deb$|\\.rpm$|linux)",
};

async function fetchGitHubRelease(repo: string): Promise<ReleaseData | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    
    const assets: ReleaseData["assets"] = {};
    
    for (const asset of data.assets || []) {
      const name = asset.name.toLowerCase();
      
      for (const [platform, pattern] of Object.entries(defaultAssetPatterns)) {
        if (new RegExp(pattern, "i").test(name) && !assets[platform as keyof typeof assets]) {
          assets[platform as keyof typeof assets] = {
            name: asset.name,
            url: asset.browser_download_url,
            size: asset.size,
          };
        }
      }
    }
    
    return {
      version: data.tag_name,
      publishedAt: data.published_at,
      releaseNote: data.body,
      assets,
    };
  } catch {
    return null;
  }
}

async function fetchGiteeRelease(repo: string): Promise<ReleaseData | null> {
  try {
    const res = await fetch(`https://gitee.com/api/v5/repos/${repo}/releases/latest`);
    
    if (!res.ok) return null;
    
    const data = await res.json();
    
    const assets: ReleaseData["assets"] = {};
    
    for (const asset of data.assets || []) {
      const name = asset.name.toLowerCase();
      
      for (const [platform, pattern] of Object.entries(defaultAssetPatterns)) {
        if (new RegExp(pattern, "i").test(name) && !assets[platform as keyof typeof assets]) {
          assets[platform as keyof typeof assets] = {
            name: asset.name,
            url: asset.browser_download_url,
            size: asset.size,
          };
        }
      }
    }
    
    return {
      version: data.tag_name,
      publishedAt: data.created_at,
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
  colorScheme,
  className,
}: AppReleaseProps) {
  const [loading, setLoading] = useState(!!repo);
  const [release, setRelease] = useState<ReleaseData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repo) return;

    setLoading(true);
    setError(null);

    const fetchFn = provider === "gitee" ? fetchGiteeRelease : fetchGitHubRelease;

    fetchFn(repo)
      .then((data) => {
        if (data) {
          setRelease(data);
        } else {
          setError("No release found");
        }
      })
      .catch(() => {
        setError("Failed to fetch release");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [repo, provider]);

  // 合并手动 URLs 和 API 获取的 assets
  const getDownloadUrl = (platform: string): string | null => {
    // 手动指定的优先
    if (urls[platform as keyof typeof urls]) {
      return urls[platform as keyof typeof urls]!;
    }
    // 从 release 获取
    if (release?.assets[platform as keyof typeof release.assets]) {
      return release.assets[platform as keyof typeof release.assets]!.url;
    }
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
        <span className="ml-2 text-muted-foreground">Loading releases...</span>
      </div>
    );
  }

  if (error && !Object.keys(urls).length) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <p>{error}</p>
      </div>
    );
  }

  if (availablePlatforms.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <p>No downloads available</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Version info */}
      {release && (
        <div className="text-center text-sm text-muted-foreground">
          <span>Version: {release.version}</span>
          {release.publishedAt && (
            <span className="ml-4">
              Released: {new Date(release.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

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
    </div>
  );
}
