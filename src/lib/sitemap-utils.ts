import { readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * 获取页面路由的工具函数
 */
export function getPageRoutes(): string[] {
  const appDir = join(process.cwd(), 'src', 'app');
  const routes: string[] = [];

  function scanDirectory(dir: string, basePath: string = '') {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const routePath = join(basePath, entry.name);

        if (entry.isDirectory()) {
          // 跳过特殊目录
          if (entry.name.startsWith('(') || entry.name === 'api' || entry.name.startsWith('_')) {
            if (entry.name.startsWith('(')) {
              // 对于路由组，扫描内部但不添加到路径
              scanDirectory(fullPath, basePath);
            }
            continue;
          }

          // 检查目录是否包含 page.tsx 或 page.ts
          const pageFiles = ['page.tsx', 'page.ts', 'page.jsx', 'page.js'];
          const hasPageFile = pageFiles.some(file => {
            try {
              const pagePath = join(fullPath, file);
              return statSync(pagePath).isFile();
            } catch {
              return false;
            }
          });

          if (hasPageFile) {
            const route = routePath.replace(/\\/g, '/');
            routes.push(route === '' ? '/' : `/${route}`);
          }

          // 递归扫描子目录
          scanDirectory(fullPath, routePath);
        }
      }
    } catch (error) {
      console.warn(`无法扫描目录 ${dir}:`, error);
    }
  }

  // 检查根目录的 page.tsx
  const rootPageFiles = ['page.tsx', 'page.ts', 'page.jsx', 'page.js'];
  const hasRootPage = rootPageFiles.some(file => {
    try {
      const pagePath = join(appDir, file);
      return statSync(pagePath).isFile();
    } catch {
      return false;
    }
  });

  if (hasRootPage) {
    routes.push('/');
  }

  scanDirectory(appDir);
  return [...new Set(routes)].sort();
}

/**
 * 页面SEO配置类型
 */
export interface PageSEOConfig {
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * 默认的页面SEO配置
 */
export const DEFAULT_PAGE_CONFIGS: Record<string, PageSEOConfig> = {
  '/': { changeFrequency: 'daily', priority: 1.0 },
  '/templates': { changeFrequency: 'weekly', priority: 0.9 },
  '/examples': { changeFrequency: 'weekly', priority: 0.9 },
  '/pricing': { changeFrequency: 'monthly', priority: 0.8 },
  '/login': { changeFrequency: 'monthly', priority: 0.6 },
  '/register': { changeFrequency: 'monthly', priority: 0.6 },
  '/dashboard': { changeFrequency: 'daily', priority: 0.5 },
  '/dashboard/generate': { changeFrequency: 'daily', priority: 0.5 },
  '/dashboard/history': { changeFrequency: 'daily', priority: 0.4 },
  '/dashboard/templates': { changeFrequency: 'weekly', priority: 0.4 },
  '/components': { changeFrequency: 'weekly', priority: 0.3 },
  '/privacy': { changeFrequency: 'yearly', priority: 0.4 },
  '/terms': { changeFrequency: 'yearly', priority: 0.4 },
  '/auth-error': { changeFrequency: 'monthly', priority: 0.2 },
  '/offline': { changeFrequency: 'yearly', priority: 0.1 },
};

/**
 * 获取页面的SEO配置
 */
export function getPageSEOConfig(route: string): PageSEOConfig {
  return DEFAULT_PAGE_CONFIGS[route] || { changeFrequency: 'monthly', priority: 0.5 };
}
