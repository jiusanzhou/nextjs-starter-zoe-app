import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadZoeConfig } from "@/lib/zoefile";
import { getHelpItems, getHelpItemById } from "@/lib/helpqa";
import { markdownToHtml } from "@/lib/mdx";
import { HelpHeader, HelpItemDetail } from "@/components/help";
import { getLabel } from "@/lib/i18n";

export const dynamicParams = false;

interface Props {
  params: Promise<{ id: string }>;
}

const PLACEHOLDER_ID = "__placeholder__";

export async function generateStaticParams() {
  try {
    const config = loadZoeConfig();
    const helpConfig = config.helpqa;

    if (!helpConfig?.repo) {
      return [{ id: PLACEHOLDER_ID }];
    }

    const items = await getHelpItems(helpConfig);
    if (items.length === 0) {
      return [{ id: PLACEHOLDER_ID }];
    }

    return items.map((item) => ({
      id: item.id,
    }));
  } catch {
    return [{ id: PLACEHOLDER_ID }];
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const config = loadZoeConfig();

  if (id === PLACEHOLDER_ID) return { title: getLabel(config, 'help.detail') };

  const helpConfig = config.helpqa;

  if (!helpConfig?.repo) {
    return { title: getLabel(config, 'help.detail') };
  }

  const item = await getHelpItemById(helpConfig, id);

  return {
    title: item
      ? `${item.title} - ${getLabel(config, 'help')} - ${config.title}`
      : getLabel(config, 'help.detail'),
  };
}

async function ItemContent({ itemId }: { itemId: string }) {
  if (itemId === PLACEHOLDER_ID) notFound();

  const config = loadZoeConfig();
  const helpConfig = config.helpqa;

  if (!helpConfig?.repo) {
    notFound();
  }

  const item = await getHelpItemById(helpConfig, itemId);

  if (!item) {
    notFound();
  }

  const htmlBody = await markdownToHtml(item.body);
  const itemWithHtml = { ...item, body: htmlBody };

  return (
    <div className="page-help">
      <HelpHeader title={item.title} showSearch={false} />
      <div className="py-6 max-w-3xl mx-auto">
        <HelpItemDetail
          item={itemWithHtml}
          backLabel={getLabel(config, 'help.back')}
          feedbackLabel={getLabel(config, 'help.feedback')}
          feedbackThanksLabel={getLabel(config, 'help.feedbackThanks')}
        />
      </div>
    </div>
  );
}

export default async function HelpItemPage({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">{getLabel(loadZoeConfig(), 'loading')}</p>
        </div>
      }
    >
      <ItemContent itemId={id} />
    </Suspense>
  );
}
