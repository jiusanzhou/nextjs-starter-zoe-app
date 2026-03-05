import { fetchReleases, getLatestRelease } from "@/lib/release";
import { loadZoeConfig } from "@/lib/zoefile";
import { ReleaseList } from "@/components/release-card";
import { Section } from "@/components/section";
import { getLabel } from "@/lib/i18n";
import type { ReleaseConfig } from "@/types/release";
import type { Metadata } from "next";

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
      <div className="max-w-4xl mx-auto">
        <Section title={getLabel(config, 'releases')} description={getLabel(config, 'releases.notConfigured')}>
          <div className="text-center py-12 text-muted-foreground">
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
        </Section>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Section className="text-center py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{getLabel(config, 'releases')}</h1>
        {latestRelease && (
          <p className="text-lg text-muted-foreground">
            {getLabel(config, 'releases.latestVersion')} <span className="font-semibold text-foreground">{latestRelease.version}</span>
            <span className="mx-2">·</span>
            {getLabel(config, 'releases.publishedAt')} {new Date(latestRelease.published_at).toLocaleDateString(config.lang || "en")}
          </p>
        )}
      </Section>

      <Section title={getLabel(config, 'releases.versionList')} description={getLabel(config, 'releases.versionListDescription')}>
        <ReleaseList releases={releases} />
      </Section>
    </div>
  );
}
