import { fetchReleases, getLatestRelease } from "@/lib/release";
import { loadZoeConfig } from "@/lib/zoefile";
import { ReleaseList } from "@/components/release-card";
import { getLabel } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Download, Sparkles } from "lucide-react";
import type { ReleaseConfig } from "@/types/release";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: getLabel(config, 'releases'),
    description: getLabel(config, 'releases.description'),
  };
}

function normalizeReleaseConfig(
  config: string | { provider?: 'github' | 'gitee'; repo: string; assetRegexPatterns?: Record<string, string> }[]
): ReleaseConfig[] {
  if (!config) return [];

  if (typeof config === 'string') {
    return [{ provider: 'github', repo: config }];
  }

  if (Array.isArray(config)) {
    return config.map(item => ({
      provider: item.provider || 'github',
      repo: item.repo,
      assetRegexPatterns: item.assetRegexPatterns,
    }));
  }

  return [];
}

export default async function ReleasesPage() {
  const config = loadZoeConfig();
  const releaseConfigs = normalizeReleaseConfig(config.releaseRepo || '');

  const releases = await fetchReleases(releaseConfigs);
  const latestRelease = getLatestRelease(releases);

  if (releaseConfigs.length === 0) {
    return (
      <div className="page-releases max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center py-8 md:py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
            <Download className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {getLabel(config, 'releases')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {getLabel(config, 'releases.notConfigured')}
          </p>
        </div>

        <div className="text-center py-12 text-muted-foreground border rounded-xl bg-card">
          <Download className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="mb-4">
            {getLabel(config, 'releases.configHint')}
          </p>
          <pre className="text-left max-w-md mx-auto p-4 bg-muted rounded-lg text-sm">
{`# Single repo
releaseRepo: "username/repo"

# Multiple repos
releaseRepo:
  - provider: github
    repo: username/repo1
  - provider: gitee
    repo: username/repo2`}
          </pre>
        </div>
      </div>
    );
  }

  // 统计：总版本 / 仓库数 / 资源总数
  const stats = {
    total: releases.length,
    repos: new Set(releases.map((r) => r.repo)).size,
    assets: releases.reduce((sum, r) => sum + Object.keys(r.assets).length, 0),
  };

  return (
    <div className="page-releases max-w-4xl mx-auto space-y-10">
      {/* Hero */}
      <div className="text-center py-8 md:py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
          <Download className="h-6 w-6" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {getLabel(config, 'releases')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {getLabel(config, 'releases.description')}
        </p>

        {latestRelease && (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card text-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">{getLabel(config, 'releases.latestVersion')}</span>
            <Badge variant="default" className="font-mono">{latestRelease.version}</Badge>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {new Date(latestRelease.published_at).toLocaleDateString(config.lang || "en", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        {releases.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>{stats.total} {getLabel(config, 'releases.unitVersion')}</span>
            {stats.repos > 1 && (
              <>
                <span>·</span>
                <span>{stats.repos} {getLabel(config, 'releases.unitRepo')}</span>
              </>
            )}
            {stats.assets > 0 && (
              <>
                <span>·</span>
                <span>{stats.assets} {getLabel(config, 'releases.unitDownload')}</span>
              </>
            )}
          </div>
        )}
      </div>

      <ReleaseList releases={releases} config={config} />
    </div>
  );
}
