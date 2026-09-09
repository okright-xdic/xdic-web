import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Google-adstxt',
        allow: '/app-ads.txt',
      },
      {
        userAgent: '*',
        allow: [
          '/',
          '/ads.txt',
          '/app-ads.txt',
        ],
        disallow: [
          '/app',
          '/admin-write',
        ],
      },
    ],
    sitemap: 'https://www.x-dic.com/sitemap.xml',
  };
}