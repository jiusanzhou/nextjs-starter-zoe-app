import { getAllChangelogs } from "@/lib/changelog";
import { loadZoeConfig } from "@/lib/zoefile";
import { Section } from "@/components/section";
import { ChangelogList } from "@/components/changelog";
import { getLabel } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: getLabel(config, 'changelog'),
    description: getLabel(config, 'changelog.description'),
  };
}

export default async function ChangelogPage() {
  const config = loadZoeConfig();
  const changelogConfig = config.changelog || {};
  const changelogs = await getAllChangelogs();

  if (changelogs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Section title={getLabel(config, 'changelog')} description={getLabel(config, 'changelog.empty')}>
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">
              在 <code className="px-2 py-1 bg-muted rounded">content/changelog/</code> 目录添加 Markdown 文件，
            </p>
            <p className="mb-4">
              或在 <code className="px-2 py-1 bg-muted rounded">zoe-site.yaml</code> 中配置 GitHub 仓库：
            </p>
            <pre className="text-left max-w-md mx-auto p-4 bg-muted rounded-lg text-sm">
{`changelog:
  title: Changelog
  github:
    repo: username/repo
    includePrerelease: false`}
            </pre>
          </div>
        </Section>
      </div>
    );
  }

  const latestChangelog = changelogs[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Section className="text-center py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {changelogConfig.title || getLabel(config, 'changelog')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {changelogConfig.description || getLabel(config, 'changelog.viewHistory')}
        </p>
        {latestChangelog && (
          <p className="mt-4 text-sm text-muted-foreground">
            {getLabel(config, 'changelog.latestVersion')} <span className="font-semibold text-foreground">{latestChangelog.version}</span>
            <span className="mx-2">·</span>
            {getLabel(config, 'changelog.publishedAt')} {new Date(latestChangelog.date).toLocaleDateString(config.lang || "en")}
          </p>
        )}
      </Section>

      <ChangelogList changelogs={changelogs} />
    </div>
  );
}
