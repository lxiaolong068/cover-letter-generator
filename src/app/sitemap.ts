import { MetadataRoute } from 'next';
import { getPageRoutes, getPageSEOConfig } from '@/lib/sitemap-utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const currentDate = new Date();

  // 获取动态路由
  const dynamicRoutes = getPageRoutes();

  // 生成sitemap条目
  const sitemapEntries = dynamicRoutes.map(route => {
    const config = getPageSEOConfig(route);

    return {
      url: route === '/' ? baseUrl : `${baseUrl}${route}`,
      lastModified: currentDate,
      changeFrequency: config.changeFrequency,
      priority: config.priority,
    };
  });

  return sitemapEntries;
}
