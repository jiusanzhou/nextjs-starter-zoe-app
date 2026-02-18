import { generateRSSFeed } from '@/lib/rss';

// 强制静态生成
export const dynamic = "force-static";

export async function GET() {
  const rss = generateRSSFeed();

  if (!rss) {
    return new Response('RSS feed is disabled', { status: 404 });
  }

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
