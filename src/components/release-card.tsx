"use client";

import { useState } from "react";
import {
  Download,
  Apple,
  Monitor,
  Smartphone,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Package,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getLabel } from "@/lib/i18n";
import type { Release, ReleaseAssets } from "@/types/release";
import type { ZoeSiteConfig } from "@/types";

interface ReleaseCardProps {
  release: Release;
  isLatest?: boolean;
  defaultExpanded?: boolean;
  config?: ZoeSiteConfig;
}

// 平台图标 —— iOS 用 Apple 区分 Android
const platformIcons: Record<string, React.ReactNode> = {
  android: <Smartphone className="h-4 w-4" />,
  apk: <Smartphone className="h-4 w-4" />,
  ios: <Apple className="h-4 w-4" />,
  mac: <Apple className="h-4 w-4" />,
  macos: <Apple className="h-4 w-4" />,
  dmg: <Apple className="h-4 w-4" />,
  windows: <Monitor className="h-4 w-4" />,
  exe: <Monitor className="h-4 w-4" />,
  msi: <Monitor className="h-4 w-4" />,
  linux: <Terminal className="h-4 w-4" />,
  deb: <Package className="h-4 w-4" />,
  rpm: <Package className="h-4 w-4" />,
  appimage: <Package className="h-4 w-4" />,
};

const platformLabels: Record<string, string> = {
  android: "Android",
  apk: "Android APK",
  ios: "iOS",
  mac: "macOS",
  macos: "macOS",
  dmg: "macOS DMG",
  windows: "Windows",
  exe: "Windows EXE",
  msi: "Windows MSI",
  linux: "Linux",
  deb: "Debian/Ubuntu",
  rpm: "Fedora/RHEL",
  appimage: "AppImage",
};

// 平台展示排序权重
const PLATFORM_ORDER = ["android", "apk", "ios", "macos", "mac", "dmg", "windows", "exe", "msi", "linux", "deb", "rpm", "appimage"];

function getAssetEntries(assets: ReleaseAssets): [string, string][] {
  return Object.entries(assets)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .sort(([a], [b]) => {
      const ai = PLATFORM_ORDER.indexOf(a.toLowerCase());
      const bi = PLATFORM_ORDER.indexOf(b.toLowerCase());
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
}

export function ReleaseCard({ release, isLatest = false, defaultExpanded = false, config }: ReleaseCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const assetEntries = getAssetEntries(release.assets);
  const hasAssets = assetEntries.length > 0;

  return (
    <Card className={cn(
      "group transition-all hover:shadow-md",
      isLatest && "border-primary/40 shadow-sm bg-gradient-to-br from-primary/[0.02] to-transparent"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg font-mono">{release.version}</CardTitle>
              {isLatest && (
                <Badge variant="default" className="text-[10px] uppercase tracking-wider">
                  {getLabel(config, 'releases.latest')}
                </Badge>
              )}
              {release.prerelease && (
                <Badge variant="secondary" className="text-[10px]">
                  {getLabel(config, 'releases.prerelease')}
                </Badge>
              )}
              <Badge variant="outline" className="text-[10px] capitalize text-muted-foreground">
                {release.provider} · {release.repo}
              </Badge>
            </div>
            {release.title && release.title !== release.version && (
              <CardDescription className="line-clamp-1">{release.title}</CardDescription>
            )}
          </div>
          <div className="text-right text-sm text-muted-foreground whitespace-nowrap shrink-0">
            <time dateTime={release.published_at}>
              {new Date(release.published_at).toLocaleDateString(config?.lang || "en", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
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
                className="gap-2 hover:border-primary/40 hover:text-primary"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {platformIcons[platform.toLowerCase()] || <Download className="h-4 w-4" />}
                  {platformLabels[platform.toLowerCase()] || platform}
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
                className="gap-1 text-muted-foreground hover:text-foreground"
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
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-expanded={expanded}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              {getLabel(config, 'releases.notes')}
            </button>
            {expanded && (
              <div
                className="prose prose-sm dark:prose-invert max-w-none pl-5 border-l-2 border-muted prose-headings:font-semibold prose-code:text-xs prose-pre:my-3"
                dangerouslySetInnerHTML={{
                  __html: release.release_note_html || escapeHtml(release.release_note).replace(/\n/g, "<br />"),
                }}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface ReleaseListProps {
  releases: Release[];
  showAll?: boolean;
  config?: ZoeSiteConfig;
}

export function ReleaseList({ releases, showAll = false, config }: ReleaseListProps) {
  const [showAllReleases, setShowAllReleases] = useState(showAll);

  if (releases.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border rounded-xl bg-card">
        <Download className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg">{getLabel(config, 'releases.noReleases')}</p>
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
          config={config}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setShowAllReleases(true)}
          >
            {getLabel(config, 'releases.showAll', { count: releases.length })}
          </Button>
        </div>
      )}
    </div>
  );
}
