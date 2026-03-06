import { getAllChangelogs } from "@/lib/changelog";
import { loadZoeConfig } from "@/lib/zoefile";
import { ChangelogList } from "@/components/changelog";
import { getLabel } from "@/lib/i18n";
import { Clock } from "lucide-react";
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
      <div className="page-changelog max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center py-8 md:py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
            <Clock className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {changelogConfig.title || getLabel(config, 'changelog')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {getLabel(config, 'changelog.empty')}
          </p>
        </div>

        <div className="text-center py-12 text-muted-foreground border rounded-xl bg-card">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="mb-4">
            {getLabel(config, 'changelog.emptyHint.markdown', { dir: 'content/changelog/' })}
          </p>
          <p className="mb-4">
            {getLabel(config, 'changelog.emptyHint.config', { file: 'zoe-site.yaml' })}
          </p>
          <pre className="text-left max-w-md mx-auto p-4 bg-muted rounded-lg text-sm">
{`changelog:
  title: Changelog
  github:
    repo: username/repo
    includePrerelease: false`}
          </pre>
        </div>
      </div>
    );
  }

  const latestChangelog = changelogs[0];

  return (
    <div className="page-changelog max-w-4xl mx-auto space-y-10">
      {/* Hero */}
      <div className="text-center py-8 md:py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
          <Clock className="h-6 w-6" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {changelogConfig.title || getLabel(config, 'changelog')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {changelogConfig.description || getLabel(config, 'changelog.viewHistory')}
        </p>
        {latestChangelog && (
          <p className="mt-4 text-sm text-muted-foreground">
            {getLabel(config, 'changelog.latestVersion')} <span className="font-semibold text-foreground">{latestChangelog.version}</span>
            <span className="mx-2">&middot;</span>
            {getLabel(config, 'changelog.publishedAt')} {new Date(latestChangelog.date).toLocaleDateString(config.lang || "en")}
          </p>
        )}
      </div>

      <ChangelogList changelogs={changelogs} config={config} />
    </div>
  );
}
