import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/app',
        '/admin-write',
      ],
    },
    sitemap: 'https://www.x-dic.com/sitemap.xml',
  };
}
