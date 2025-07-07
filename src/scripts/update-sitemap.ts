#!/usr/bin/env node

/**
 * 用于构建时自动更新sitemap的脚本
 * 此脚本可以在CI/CD流程中运行，确保sitemap始终是最新的
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { getPageRoutes, getPageSEOConfig } from '../lib/sitemap-utils';

async function updateSitemap() {
  console.log('开始更新sitemap...');

  try {
    // 获取所有页面路由
    const routes = getPageRoutes();
    console.log(`发现 ${routes.length} 个页面路由:`);
    routes.forEach(route => console.log(`  - ${route}`));

    // 生成sitemap内容
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const currentDate = new Date().toISOString();

    const sitemapEntries = routes.map(route => {
      const config = getPageSEOConfig(route);
      const url = route === '/' ? baseUrl : `${baseUrl}${route}`;

      return `  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${config.changeFrequency}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
    });

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>`;

    // 写入sitemap.xml文件到public目录
    const publicDir = join(process.cwd(), 'public');
    const sitemapPath = join(publicDir, 'sitemap.xml');

    writeFileSync(sitemapPath, sitemapXml, 'utf8');
    console.log(`✅ Sitemap已更新: ${sitemapPath}`);

    // 生成sitemap报告
    const reportPath = join(publicDir, 'sitemap-report.json');
    const report = {
      updatedAt: currentDate,
      routeCount: routes.length,
      routes: routes.map(route => ({
        route,
        url: route === '/' ? baseUrl : `${baseUrl}${route}`,
        config: getPageSEOConfig(route),
      })),
    };

    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`📊 Sitemap报告已生成: ${reportPath}`);
  } catch (error) {
    console.error('❌ 更新sitemap时发生错误:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  updateSitemap();
}

export { updateSitemap };
