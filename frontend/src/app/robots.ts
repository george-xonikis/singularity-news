import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/env';

export default function robots(): MetadataRoute.Robots {
  // Only include sitemap if we have a valid URL
  const robots: MetadataRoute.Robots = {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/search'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
    ],
  };

  // Add sitemap with configured URL
  robots.sitemap = `${SITE_URL}sitemap.xml`;

  return robots;
}