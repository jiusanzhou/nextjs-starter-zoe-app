import { Suspense } from "react";
import { loadZoeConfig } from "@/lib/zoefile";
import {
  getHelpCategories,
  getPinnedHelpItems,
} from "@/lib/helpqa";
import { HelpHeader, HelpCategoriesList, HelpItemsList } from "@/components/help";

export const revalidate = 3600;

export async function generateMetadata() {
  const config = await loadZoeConfig();
  return {
    title: `帮助中心 - ${config.title}`,
    description: "帮助中心 - 常见问题解答",
  };
}

async function HelpContent() {
  const config = await loadZoeConfig();

  // 从配置获取 helpqa 设置
  const helpConfig = config.helpqa;

  if (!helpConfig?.repo) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">
          帮助中心未配置。请在 zoe-site.yaml 中添加 helpqa.repo 配置。
        </p>
        <pre className="mt-4 p-4 bg-muted rounded-lg text-left text-sm max-w-md mx-auto">
{`# zoe-site.yaml
helpqa:
  repo: owner/repo
  labelPrefix: help  # 可选，默认 help`}
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
          <HelpItemsList items={pinnedItems} title="热门问题" limit={6} />
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
          <p className="text-muted-foreground">加载中...</p>
        </div>
      }
    >
      <HelpContent />
    </Suspense>
  );
}
