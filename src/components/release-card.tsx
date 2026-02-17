"use client";

import { useState } from "react";
import { Download, Apple, Monitor, Smartphone, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Release, ReleaseAssets } from "@/types/release";

interface ReleaseCardProps {
  release: Release;
  isLatest?: boolean;
  defaultExpanded?: boolean;
}

const platformIcons: Record<string, React.ReactNode> = {
  android: <Smartphone className="h-4 w-4" />,
  ios: <Smartphone className="h-4 w-4" />,
  mac: <Apple className="h-4 w-4" />,
  dmg: <Apple className="h-4 w-4" />,
  windows: <Monitor className="h-4 w-4" />,
  exe: <Monitor className="h-4 w-4" />,
  linux: <Monitor className="h-4 w-4" />,
  deb: <Monitor className="h-4 w-4" />,
  rpm: <Monitor className="h-4 w-4" />,
};

const platformLabels: Record<string, string> = {
  android: "Android",
  apk: "Android APK",
  ios: "iOS",
  mac: "macOS",
  dmg: "macOS DMG",
  windows: "Windows",
  exe: "Windows EXE",
  linux: "Linux",
  deb: "Debian/Ubuntu",
  rpm: "Fedora/RHEL",
};

function getAssetEntries(assets: ReleaseAssets): [string, string][] {
  return Object.entries(assets).filter(
    (entry): entry is [string, string] => entry[1] !== undefined
  );
}

export function ReleaseCard({ release, isLatest = false, defaultExpanded = false }: ReleaseCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const assetEntries = getAssetEntries(release.assets);
  const hasAssets = assetEntries.length > 0;

  return (
    <Card className={cn(isLatest && "border-primary shadow-lg")}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg">{release.version}</CardTitle>
              {isLatest && (
                <Badge variant="default" className="text-xs">
                  最新
                </Badge>
              )}
              {release.prerelease && (
                <Badge variant="secondary" className="text-xs">
                  预览版
                </Badge>
              )}
              <Badge variant="outline" className="text-xs capitalize">
                {release.provider}
              </Badge>
            </div>
            {release.title && release.title !== release.version && (
              <CardDescription>{release.title}</CardDescription>
            )}
          </div>
          <div className="text-right text- text-muted-foreground whitespace-nowrap">
            {new Date(release.published_at).toLocaleDateString("zh-CN")}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Download Buttons */}
        {hasAssets && (
          <div className="flex flex-wrap gap-2">
            {assetEntries.map(([platform, url]) => (
              <Button
                key={platform}
                variant="outline"
                size="sm"
                asChild
                className="gap-2"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {platformIcons[platform] || <Download className="h-4 w-4" />}
                  {platformLabels[platform] || platform}
                </a>
              </Button>
            ))}
          </div>
        )}

        {/* External URLs */}
        {release.urls && Object.keys(release.urls).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(release.urls).map(([name, url]) => (
              <Button
                key={name}
                variant="ghost"
                size="sm"
                asChild
                className="gap-1 text-muted-foreground"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                  {name}
                </a>
              </Button>
            ))}
          </div>
        )}

        {/* Release Notes */}
        {release.release_note && (
          <div className="space-y-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              更新说明
            </button>
            {expanded && (
              <div className="prose prose-sm dark:prose-invert max-w-none pl-5 border-l-2 border-muted">
                <div
                  dangerouslySetInnerHTML={{
                    __html: release.release_note.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ReleaseListProps {
  releases: Release[];
  showAll?: boolean;
}

export function ReleaseList({ releases, showAll = false }: ReleaseListProps) {
  const [showAllReleases, setShowAllReleases] = useState(showAll);
  
  if (releases.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        暂无发布版本
      </div>
    );
  }

  const displayReleases = showAllReleases ? releases : releases.slice(0, 5);
  const hasMore = releases.length > 5 && !showAllReleases;

  return (
    <div className="space-y-4">
      {displayReleases.map((release, index) => (
        <ReleaseCard
          key={`${release.provider}-${release.id}`}
          release={release}
          isLatest={index === 0}
          defaultExpanded={index === 0}
        />
      ))}
      
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setShowAllReleases(true)}
          >
            显示全部 {releases.length} 个版本
          </Button>
        </div>
      )}
    </div>
  );
}
