'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const features = [
  {
    title: 'AI-Powered Generation',
    description:
      'Generate personalized cover letters using advanced AI technology based on your background and target position',
    icon: '🤖',
  },
  {
    title: 'Multiple Templates',
    description:
      'Professional, creative, technical, and executive templates to suit different industries and roles',
    icon: '📄',
  },
  {
    title: 'ATS Optimized',
    description:
      'Optimized for Applicant Tracking Systems to improve resume pass rates and interview opportunities',
    icon: '🎯',
  },
  {
    title: 'One-Click Export',
    description:
      'Export to PDF format while maintaining formatting integrity for easy submission and printing',
    icon: '📥',
  },
  {
    title: 'Secure & Reliable',
    description:
      'Enterprise-grade security standards to protect your personal information and job search data',
    icon: '🔒',
  },
  {
    title: 'Fast & Efficient',
    description:
      'Complete cover letter generation in minutes, dramatically improving your job search efficiency',
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
          Why Choose Us?
        </h2>
        <p className="text-on-surface-variant mt-4 text-lg leading-8">
          We provide the most advanced AI technology and thoughtful user experience to make job
          searching simpler and more efficient.
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
