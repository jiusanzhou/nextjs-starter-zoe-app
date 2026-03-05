import { Suspense } from "react";
import { loadZoeConfig } from "@/lib/zoefile";
import {
  getHelpCategories,
  getPinnedHelpItems,
} from "@/lib/helpqa";
import { HelpHeader, HelpCategoriesList, HelpItemsList } from "@/components/help";
import { getLabel } from "@/lib/i18n";

export const revalidate = 3600;

export async function generateMetadata() {
  const config = await loadZoeConfig();
  return {
    title: `${getLabel(config, 'help')} - ${config.title}`,
    description: getLabel(config, 'help'),
  };
}

async function HelpContent() {
  const config = await loadZoeConfig();

  const helpConfig = config.helpqa;

  if (!helpConfig?.repo) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">
          {getLabel(config, 'help.notConfigured')}
        </p>
        <pre className="mt-4 p-4 bg-muted rounded-lg text-left text-sm max-w-md mx-auto">
{`# zoe-site.yaml
helpqa:
  repo: owner/repo
  labelPrefix: help`}
        </pre>
      </div>
    );
  }

  const [categories, pinnedItems] = await Promise.all([
    getHelpCategories(helpConfig),
    getPinnedHelpItems(helpConfig),
  ]);

  return (
    <>
      <HelpHeader />
      <div className="container py-6">
        {pinnedItems.length > 0 && (
          <HelpItemsList items={pinnedItems} title={getLabel(config, 'help.pinned')} limit={6} />
        )}
        <HelpCategoriesList categories={categories} />
      </div>
    </>
  );
}

export default function HelpPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">{getLabel(loadZoeConfig(), 'loading')}</p>
        </div>
      }
    >
      <HelpContent />
    </Suspense>
  );
}
