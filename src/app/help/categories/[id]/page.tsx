import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadZoeConfig } from "@/lib/zoefile";
import { getHelpCategories, getHelpItemsByCategory } from "@/lib/helpqa";
import { HelpHeader, HelpItemsList } from "@/components/help";

// 强制静态生成
export const dynamic = "force-static";
export const dynamicParams = false;

interface Props {
  params: Promise<{ id: string }>;
}

// 生成所有分类的静态路径
export async function generateStaticParams() {
  try {
    const config = loadZoeConfig();
    const helpConfig = config.helpqa;
    
    if (!helpConfig?.repo) {
      return [];
    }
    
    const categories = await getHelpCategories(helpConfig);
    return categories.map((category) => ({
      id: category.id,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const config = loadZoeConfig();
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
    <>
      <HelpHeader title={category.name} description={category.description} />
      <div className="container py-6">
        <HelpItemsList items={items} title={category.name} showAll={false} showBack={true} />
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
