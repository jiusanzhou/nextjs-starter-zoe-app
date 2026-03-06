import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadZoeConfig } from "@/lib/zoefile";
import { getHelpCategories, getHelpItemsByCategory } from "@/lib/helpqa";
import { HelpHeader, HelpItemsList } from "@/components/help";
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

    const categories = await getHelpCategories(helpConfig);
    if (categories.length === 0) {
      return [{ id: PLACEHOLDER_ID }];
    }

    return categories.map((category) => ({
      id: category.id,
    }));
  } catch {
    return [{ id: PLACEHOLDER_ID }];
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const config = loadZoeConfig();

  if (id === PLACEHOLDER_ID) return { title: getLabel(config, 'help.category') };

  const helpConfig = config.helpqa;

  if (!helpConfig?.repo) {
    return { title: getLabel(config, 'help.category') };
  }

  const categories = await getHelpCategories(helpConfig);
  const category = categories.find((c) => c.id === id);

  return {
    title: category
      ? `${category.name} - ${getLabel(config, 'help')} - ${config.title}`
      : getLabel(config, 'help.category'),
  };
}

async function CategoryContent({ categoryId }: { categoryId: string }) {
  if (categoryId === PLACEHOLDER_ID) notFound();

  const config = loadZoeConfig();
  const helpConfig = config.helpqa;

  if (!helpConfig?.repo) {
    notFound();
  }

  const [categories, items] = await Promise.all([
    getHelpCategories(helpConfig),
    getHelpItemsByCategory(helpConfig, categoryId),
  ]);

  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="page-help">
      <HelpHeader
        title={category.name}
        description={category.description}
        searchPlaceholder={getLabel(config, 'help.searchPlaceholder')}
      />
      <div className="py-6">
        <HelpItemsList
          items={items}
          title={category.name}
          showAll={false}
          showBack={true}
          backLabel={getLabel(config, 'help.back')}
          emptyLabel={getLabel(config, 'help.noContent')}
        />
      </div>
    </div>
  );
}

export default async function HelpCategoryPage({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">{getLabel(loadZoeConfig(), 'loading')}</p>
        </div>
      }
    >
      <CategoryContent categoryId={id} />
    </Suspense>
  );
}
