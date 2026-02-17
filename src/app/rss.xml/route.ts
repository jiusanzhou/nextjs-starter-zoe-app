import { generateRSSFeed } from '@/lib/rss';

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
