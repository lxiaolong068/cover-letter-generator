import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navigation } from '@/components/ui/Navigation';
import { Suspense, lazy } from 'react';

const FeatureSection = lazy(() =>
  import('@/components/HomePage/FeatureSection').then(module => ({
    default: module.FeatureSection,
  }))
);

const navigationItems = [
  { href: '/', label: '首页' },
  { href: '/templates', label: '模板' },
  { href: '/examples', label: '示例' },
  { href: '/pricing', label: '定价' },
];

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      <Navigation
        items={navigationItems}
        actions={
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">登录</Link>
            </Button>
            <Button asChild>
              <Link href="/register">注册</Link>
            </Button>
          </div>
        }
      />

      {/* Hero Section */}
      <section className="from-primary-50 to-secondary-50 relative overflow-hidden bg-gradient-to-br py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-on-surface text-4xl font-bold tracking-tight sm:text-6xl">
              AI智能求职信生成器
            </h1>
            <p className="text-on-surface-variant mx-auto mt-6 max-w-2xl text-lg leading-8">
              使用先进的AI技术，快速生成专业、个性化的求职信。
              支持多种模板，ATS优化，助您在求职路上脱颖而出。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/dashboard">立即开始</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/examples">查看示例</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Suspense
        fallback={
          <section className="py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center">
                <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
              </div>
            </div>
          </section>
        }
      >
        <FeatureSection />
      </Suspense>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              准备好开始您的求职之旅了吗？
            </h2>
            <p className="text-primary-100 mx-auto mt-6 max-w-xl text-lg leading-8">
              立即注册，免费体验AI求职信生成服务，让您的求职更加高效。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/register">免费注册</Link>
              </Button>
              <Button variant="ghost" size="lg" className="hover:bg-primary-700 text-white" asChild>
                <Link href="/contact">联系我们</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-variant">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-on-surface-variant text-sm">© 2024 求职信生成器. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
