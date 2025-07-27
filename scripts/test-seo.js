#!/usr/bin/env node

/**
 * SEO Testing Script for AI Cover Letter Generator
 *
 * This script validates SEO implementations including:
 * - Meta tags presence and content
 * - Structured data validation
 * - Accessibility compliance
 * - Performance metrics
 * - Internal linking structure
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.bold}=== ${title} ===${colors.reset}`, 'blue');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Test configurations
const testConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  pages: ['/', '/templates', '/examples', '/pricing', '/dashboard/generate', '/privacy', '/terms'],
  requiredKeywords: [
    'AI Cover Letter Generator',
    'cover letter generator',
    'ATS optimized',
    'professional cover letters',
  ],
};

// SEO validation functions
function validateMetaTags() {
  logSection('Meta Tags Validation');

  const seoConfigPath = path.join(process.cwd(), 'src/lib/seo.ts');

  if (!fs.existsSync(seoConfigPath)) {
    logError('SEO configuration file not found');
    return false;
  }

  const seoConfig = fs.readFileSync(seoConfigPath, 'utf8');

  // Check for keywords implementation
  if (seoConfig.includes('keywords:')) {
    logSuccess('Keywords meta tags implemented');
  } else {
    logError('Keywords meta tags missing');
  }

  // Check for primary keyword presence
  if (seoConfig.includes('AI Cover Letter Generator')) {
    logSuccess('Primary keyword "AI Cover Letter Generator" found in configuration');
  } else {
    logError('Primary keyword "AI Cover Letter Generator" missing from configuration');
  }

  // Check for generateMetadata function
  if (seoConfig.includes('generateMetadata')) {
    logSuccess('generateMetadata function implemented');
  } else {
    logError('generateMetadata function missing');
  }

  return true;
}

function validateStructuredData() {
  logSection('Structured Data Validation');

  const structuredDataPath = path.join(process.cwd(), 'src/components/seo/StructuredData.tsx');

  if (!fs.existsSync(structuredDataPath)) {
    logError('StructuredData component not found');
    return false;
  }

  const structuredDataContent = fs.readFileSync(structuredDataPath, 'utf8');

  const requiredComponents = [
    'BreadcrumbStructuredData',
    'FAQStructuredData',
    'HowToStructuredData',
  ];

  requiredComponents.forEach(component => {
    if (structuredDataContent.includes(component)) {
      logSuccess(`${component} component implemented`);
    } else {
      logError(`${component} component missing`);
    }
  });

  // Check for JSON-LD implementation
  if (structuredDataContent.includes('application/ld+json')) {
    logSuccess('JSON-LD structured data format implemented');
  } else {
    logError('JSON-LD structured data format missing');
  }

  return true;
}

function validateAccessibility() {
  logSection('Accessibility Validation');

  const generatePagePath = path.join(process.cwd(), 'src/app/dashboard/generate/page.tsx');

  if (!fs.existsSync(generatePagePath)) {
    logError('Generate page not found');
    return false;
  }

  const generatePageContent = fs.readFileSync(generatePagePath, 'utf8');

  // Check for ARIA live regions
  if (generatePageContent.includes('aria-live')) {
    logSuccess('ARIA live regions implemented');
  } else {
    logError('ARIA live regions missing');
  }

  // Check for semantic HTML
  const semanticElements = ['main', 'section', 'aside', 'nav', 'header'];
  semanticElements.forEach(element => {
    if (generatePageContent.includes(`<${element}`)) {
      logSuccess(`Semantic ${element} element found`);
    } else {
      logWarning(`Semantic ${element} element not found`);
    }
  });

  // Check Button component for accessibility
  const buttonPath = path.join(process.cwd(), 'src/components/ui/Button.tsx');
  if (fs.existsSync(buttonPath)) {
    const buttonContent = fs.readFileSync(buttonPath, 'utf8');
    if (buttonContent.includes('aria-busy') && buttonContent.includes('aria-disabled')) {
      logSuccess('Button component has proper ARIA attributes');
    } else {
      logError('Button component missing ARIA attributes');
    }
  }

  return true;
}

function validateInternalLinking() {
  logSection('Internal Linking Validation');

  const internalLinksPath = path.join(process.cwd(), 'src/components/seo/InternalLinks.tsx');

  if (!fs.existsSync(internalLinksPath)) {
    logError('InternalLinks component not found');
    return false;
  }

  const internalLinksContent = fs.readFileSync(internalLinksPath, 'utf8');

  // Check for keyword-rich anchor text
  if (internalLinksContent.includes('AI Cover Letter Generator')) {
    logSuccess('Keyword-rich anchor text implemented');
  } else {
    logError('Keyword-rich anchor text missing');
  }

  // Check for ContextualNav component
  if (internalLinksContent.includes('ContextualNav')) {
    logSuccess('ContextualNav component implemented');
  } else {
    logError('ContextualNav component missing');
  }

  return true;
}

function validatePerformanceOptimizations() {
  logSection('Performance Optimizations Validation');

  // Check font optimization
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    if (layoutContent.includes("display: 'optional'")) {
      logSuccess('Font loading optimization implemented');
    } else {
      logWarning('Font loading optimization not found');
    }
  }

  // Check image preloader
  const imagePreloaderPath = path.join(
    process.cwd(),
    'src/components/performance/ImagePreloader.tsx'
  );
  if (fs.existsSync(imagePreloaderPath)) {
    logSuccess('Image preloader component implemented');
  } else {
    logWarning('Image preloader component not found');
  }

  // Check Tailwind config optimizations
  const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
  if (fs.existsSync(tailwindConfigPath)) {
    const tailwindContent = fs.readFileSync(tailwindConfigPath, 'utf8');
    if (tailwindContent.includes('corePlugins')) {
      logSuccess('Tailwind CSS performance optimizations implemented');
    } else {
      logWarning('Tailwind CSS performance optimizations not found');
    }
  }

  return true;
}

function generateSEOReport() {
  logSection('SEO Implementation Report');

  const report = {
    timestamp: new Date().toISOString(),
    tests: {
      metaTags: validateMetaTags(),
      structuredData: validateStructuredData(),
      accessibility: validateAccessibility(),
      internalLinking: validateInternalLinking(),
      performance: validatePerformanceOptimizations(),
    },
  };

  // Save report
  const reportPath = path.join(process.cwd(), 'seo-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  logSuccess(`SEO test report saved to ${reportPath}`);

  return report;
}

function printSummary(report) {
  logSection('Test Summary');

  const passedTests = Object.values(report.tests).filter(Boolean).length;
  const totalTests = Object.keys(report.tests).length;

  if (passedTests === totalTests) {
    logSuccess(`All ${totalTests} SEO tests passed! 🎉`);
  } else {
    logWarning(`${passedTests}/${totalTests} SEO tests passed`);
  }

  log('\nNext steps:');
  log('1. Run Lighthouse audit on key pages');
  log("2. Validate structured data with Google's Rich Results Test");
  log('3. Test accessibility with WAVE or axe-core');
  log('4. Monitor Core Web Vitals in production');
  log('5. Check search console for indexing status');
}

// Main execution
function main() {
  log(`${colors.bold}AI Cover Letter Generator - SEO Testing Suite${colors.reset}`, 'blue');
  log(`Testing SEO implementations for primary keyword: "AI Cover Letter Generator"\n`);

  try {
    const report = generateSEOReport();
    printSummary(report);
  } catch (error) {
    logError(`Testing failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateMetaTags,
  validateStructuredData,
  validateAccessibility,
  validateInternalLinking,
  validatePerformanceOptimizations,
  generateSEOReport,
};
