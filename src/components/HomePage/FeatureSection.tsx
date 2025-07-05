'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const features = [
  {
    title: 'AI-Powered Cover Letter Generation',
    description:
      'Our AI Cover Letter Generator creates personalized, professional cover letters using advanced artificial intelligence. Input your job details into our cover letter builder and get expert-quality results instantly.',
    icon: '🤖',
  },
  {
    title: 'Professional AI Cover Letter Templates',
    description:
      'Choose from multiple professionally designed AI cover letter templates including creative, technical, executive, and entry-level formats optimized for different industries and ATS systems.',
    icon: '📄',
  },
  {
    title: 'ATS-Optimized Cover Letters',
    description:
      'All AI-generated cover letters are optimized for Applicant Tracking Systems (ATS) to ensure your job application passes automated screening and reaches human recruiters successfully.',
    icon: '🎯',
  },
  {
    title: 'Instant PDF Export & Download',
    description:
      'Export your AI-generated cover letters to professional PDF format with one click. Our cover letter generator maintains perfect formatting for job applications and printing.',
    icon: '📥',
  },
  {
    title: 'Secure & Reliable AI Technology',
    description:
      'Enterprise-grade security standards protect your personal information and job search data. Our AI Cover Letter Generator platform ensures complete privacy and data protection.',
    icon: '🔒',
  },
  {
    title: 'Fast AI Cover Letter Creation',
    description:
      'Generate professional cover letters in minutes, not hours. Our AI Cover Letter Generator technology dramatically improves your job search efficiency and application speed.',
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
          Best AI Cover Letter Generator - Professional Cover Letter Builder
        </h2>
        <p className="text-on-surface-variant mt-4 text-lg leading-8">
          Our AI Cover Letter Generator combines advanced artificial intelligence with professional
          cover letter templates to create compelling, ATS-optimized cover letters that help you
          stand out in your job search.
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
