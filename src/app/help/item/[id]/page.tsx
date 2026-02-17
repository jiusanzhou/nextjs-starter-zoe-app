import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadZoeConfig } from "@/lib/zoefile";
import { getHelpItemById } from "@/lib/helpqa";
import { markdownToHtml } from "@/lib/mdx";
import { HelpHeader, HelpItemDetail } from "@/components/help";

export const revalidate = 3600;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const config = await loadZoeConfig();
  const helpConfig = config.helpqa;

  if (!helpConfig?.repo) {
    return { title: "帮助详情" };
  }

  const item = await getHelpItemById(helpConfig, id);

  return {
    title: item
      ? `${item.title} - 帮助中心 - ${config.title}`
      : "帮助详情",
  };
}

async function ItemContent({ itemId }: { itemId: string }) {
  const config = await loadZoeConfig();
  const helpConfig = config.helpqa;

  if (!helpConfig?.repo) {
    notFound();
  }

  const item = await getHelpItemById(helpConfig, itemId);

  if (!item) {
    notFound();
  }

  // 将 markdown body 转为 HTML
  const htmlBody = await markdownToHtml(item.body);
  const itemWithHtml = { ...item, body: htmlBody };

  return (
    <>
      <HelpHeader title={item.title} showSearch={false} />
      <div className="container py-6 max-w-3xl mx-auto">
        <HelpItemDetail item={itemWithHtml} />
      </div>
    </>
  );
}

export default async function HelpItemPage({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      }
    >
      <ItemContent itemId={id} />
    </Suspense>
  );
}
