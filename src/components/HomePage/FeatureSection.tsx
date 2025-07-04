'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const features = [
  {
    title: 'AI智能生成',
    description: '基于先进的AI技术，根据您的背景和目标职位智能生成个性化求职信',
    icon: '🤖',
  },
  {
    title: '多种模板',
    description: '提供专业、创意、技术、管理等多种风格模板，适应不同行业需求',
    icon: '📄',
  },
  {
    title: 'ATS优化',
    description: '针对申请人跟踪系统优化，提高简历通过率和面试机会',
    icon: '🎯',
  },
  {
    title: '一键导出',
    description: '支持PDF格式导出，保持格式完整，方便投递和打印',
    icon: '📥',
  },
  {
    title: '安全可靠',
    description: '采用企业级安全标准，保护您的个人信息和求职数据',
    icon: '🔒',
  },
  {
    title: '快速高效',
    description: '几分钟内完成求职信生成，大幅提升求职效率',
    icon: '⚡',
  },
];

const FeatureCard = React.memo(
  ({ feature, index }: { feature: (typeof features)[0]; index: number }) => (
    <Card className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      <CardHeader>
        <div className="mb-2 text-3xl">{feature.icon}</div>
        <CardTitle>{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{feature.description}</CardDescription>
      </CardContent>
    </Card>
  )
);

FeatureCard.displayName = 'FeatureCard';

export const FeatureSection = React.memo(() => (
  <section className="py-20 sm:py-32">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-on-surface text-3xl font-bold tracking-tight sm:text-4xl">
          为什么选择我们？
        </h2>
        <p className="text-on-surface-variant mt-4 text-lg leading-8">
          我们提供最先进的AI技术和最贴心的用户体验，让求职变得更简单高效。
        </p>
      </div>
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </div>
  </section>
));

FeatureSection.displayName = 'FeatureSection';
