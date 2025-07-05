import type { Metadata } from 'next';

export const seoConfig = {
  siteName: 'AI Cover Letter Generator',
  siteDescription: 'Create professional, personalized cover letters instantly with our AI Cover Letter Generator.',
  siteUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  primaryKeyword: 'AI Cover Letter Generator',
};

export const pageConfigs = {
  home: {
    title: 'AI Cover Letter Generator - Professional Cover Letters',
    description: 'Create professional cover letters instantly with AI. ATS-optimized templates and expert-quality results.',
    path: '/',
  },
  templates: {
    title: 'Professional Cover Letter Templates - AI Generator',
    description: 'Browse professional cover letter templates. ATS-optimized for every industry.',
    path: '/templates',
  },
  examples: {
    title: 'Cover Letter Examples - Professional Samples | AI Generator',
    description: 'Browse real cover letter examples for different industries and career levels.',
    path: '/examples',
  },
  pricing: {
    title: 'Pricing Plans - AI Cover Letter Generator | Free & Pro',
    description: 'Choose the perfect plan for your job search. Free plan with 3 cover letters/month.',
    path: '/pricing',
  },
  login: {
    title: 'Login - AI Cover Letter Generator',
    description: 'Sign in to your AI Cover Letter Generator account.',
    path: '/login',
  },
  register: {
    title: 'Sign Up - AI Cover Letter Generator | Free Account',
    description: 'Create your free AI Cover Letter Generator account.',
    path: '/register',
  },
};

export function generateMetadata(pageKey: keyof typeof pageConfigs): Metadata {
  const config = pageConfigs[pageKey];
  const baseUrl = seoConfig.siteUrl;
  
  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: config.path,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
      url: `${baseUrl}${config.path}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    },
  };
}
