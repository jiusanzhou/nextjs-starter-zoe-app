import { fetchReleases, getLatestRelease } from "@/lib/release";
import { loadZoeConfig } from "@/lib/zoefile";
import { ReleaseList } from "@/components/release-card";
import { Section } from "@/components/section";
import type { ReleaseConfig } from "@/types/release";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "下载",
  description: "下载最新版本",
};

// Helper to normalize release config
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
  
  // Fetch all releases
  const releases = await fetchReleases(releaseConfigs);
  const latestRelease = getLatestRelease(releases);
  
  // If no release config, show a message
  if (releaseConfigs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Section title="下载" description="暂未配置发布仓库">
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">
              请在 <code className="px-2 py-1 bg-muted rounded">zoe-site.yaml</code> 中配置{" "}
              <code className="px-2 py-1 bg-muted rounded">releaseRepo</code> 字段。
            </p>
            <pre className="text-left max-w-md mx-auto p-4 bg-muted rounded-lg text-sm">
{`# 单个仓库
releaseRepo: "username/repo"

# 多个仓库
releaseRepo:
  - provider: github
    repo: username/repo1
  - provider: gitee
    repo: username/repo2`}
            </pre>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <Section className="text-center py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">下载</h1>
        {latestRelease && (
          <p className="text-lg text-muted-foreground">
            最新版本: <span className="font-semibold text-foreground">{latestRelease.version}</span>
            <span className="mx-2">·</span>
            发布于 {new Date(latestRelease.published_at).toLocaleDateString("zh-CN")}
          </p>
        )}
      </Section>

      {/* Releases List */}
      <Section title="版本列表" description="选择适合您平台的版本下载">
        <ReleaseList releases={releases} />
      </Section>
    </div>
  );
}
