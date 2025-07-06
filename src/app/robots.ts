import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/templates',
          '/examples',
          '/pricing',
          '/login',
          '/register',
          '/components',
          '/privacy',
          '/terms',
        ],
        disallow: ['/api/', '/dashboard/', '/admin/', '/private/', '/_next/', '/static/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
