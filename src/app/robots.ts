import type { MetadataRoute } from 'next';
import { loadZoeConfig } from '@/lib/zoefile';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const config = loadZoeConfig();
  const siteUrl = config.url || 'https://example.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
