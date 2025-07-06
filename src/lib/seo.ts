import type { Metadata } from 'next';

export const seoConfig = {
  siteName: 'AI Cover Letter Generator',
  siteDescription:
    'Create professional, personalized cover letters instantly with our AI Cover Letter Generator.',
  siteUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  primaryKeyword: 'AI Cover Letter Generator',
};

export const pageConfigs = {
  home: {
    title: 'AI Cover Letter Generator - Create Professional Cover Letters Instantly',
    description:
      'Generate professional, ATS-optimized cover letters with our AI Cover Letter Generator. Free templates, instant creation, and expert-quality results for your job search.',
    path: '/',
  },
  templates: {
    title: 'AI Cover Letter Templates - Professional & ATS-Optimized Templates',
    description:
      'Browse professional AI cover letter templates designed for every industry. ATS-optimized templates that help you land interviews faster.',
    path: '/templates',
  },
  examples: {
    title: 'AI Cover Letter Examples - Professional Samples & Templates',
    description:
      'Browse real AI-generated cover letter examples across industries and career levels. Get inspiration for your perfect cover letter.',
    path: '/examples',
  },
  pricing: {
    title: 'AI Cover Letter Generator Pricing - Free & Premium Plans',
    description:
      'Choose the perfect AI Cover Letter Generator plan for your job search. Free plan with 3 cover letters/month, Pro plan with unlimited generations.',
    path: '/pricing',
  },
  login: {
    title: 'Login - AI Cover Letter Generator Account Access',
    description:
      'Sign in to your AI Cover Letter Generator account to create professional cover letters and manage your job search.',
    path: '/login',
  },
  register: {
    title: 'Sign Up Free - AI Cover Letter Generator Account',
    description:
      'Create your free AI Cover Letter Generator account today. Generate professional cover letters and boost your job search success.',
    path: '/register',
  },
  privacy: {
    title: 'Privacy Policy - AI Cover Letter Generator Data Protection',
    description:
      'Learn how AI Cover Letter Generator protects your privacy and personal data. Comprehensive privacy policy covering data collection, usage, and your rights.',
    path: '/privacy',
  },
  terms: {
    title: 'Terms of Service - AI Cover Letter Generator Legal Terms',
    description:
      'Read the terms of service for AI Cover Letter Generator. Legal terms and conditions for using our AI-powered cover letter generation service.',
    path: '/terms',
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

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    description: seoConfig.siteDescription,
    url: seoConfig.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${seoConfig.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateSoftwareApplicationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: seoConfig.siteName,
    description: seoConfig.siteDescription,
    url: seoConfig.siteUrl,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoConfig.siteName,
    description: seoConfig.siteDescription,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/logo.png`,
    sameAs: [],
  };
}
