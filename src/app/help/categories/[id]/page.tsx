import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadZoeConfig } from "@/lib/zoefile";
import { getHelpCategories, getHelpItemsByCategory } from "@/lib/helpqa";
import { HelpHeader, HelpItemsList } from "@/components/help";

export const revalidate = 3600;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const config = await loadZoeConfig();
  const helpConfig = config.helpqa;

  if (!helpConfig?.repo) {
    return { title: "帮助分类" };
  }

  const categories = await getHelpCategories(helpConfig);
  const category = categories.find((c) => c.id === id);

  return {
    title: category
      ? `${category.name} - 帮助中心 - ${config.title}`
      : "帮助分类",
  };
}

async function CategoryContent({ categoryId }: { categoryId: string }) {
  const config = await loadZoeConfig();
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
    <>
      <HelpHeader title={category.name} description={category.description} />
      <div className="container py-6">
        <HelpItemsList items={items} title={category.name} showAll={false} />
      </div>
    </>
  );
}

export default async function HelpCategoryPage({ params }: Props) {
  const { id } = await params;
  
  return (
    <Suspense
      fallback={
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      }
    >
      <CategoryContent categoryId={id} />
    </Suspense>
  );
}
