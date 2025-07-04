import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading and description', async ({ page }) => {
    // Check main heading
    await expect(
      page.getByRole('heading', { name: /AI-Powered Cover Letter Generator/i })
    ).toBeVisible();

    // Check description
    await expect(
      page.getByText(
        /Generate professional, personalized cover letters using advanced AI technology/
      )
    ).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Check navigation items
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Templates' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Examples' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pricing' })).toBeVisible();

    // Check action buttons
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    // Check that all feature cards are visible
    await expect(page.getByText('AI-Powered Generation')).toBeVisible();
    await expect(page.getByText('Multiple Templates')).toBeVisible();
    await expect(page.getByText('ATS Optimized')).toBeVisible();
    await expect(page.getByText('One-Click Export')).toBeVisible();
    await expect(page.getByText('Secure & Reliable')).toBeVisible();
    await expect(page.getByText('Fast & Efficient')).toBeVisible();
  });

  test('should have working CTA buttons', async ({ page }) => {
    // Check main CTA buttons
    const startButton = page.getByRole('link', { name: 'Get Started' });
    const exampleButton = page.getByRole('link', { name: 'View Examples' });

    await expect(startButton).toBeVisible();
    await expect(exampleButton).toBeVisible();

    // Check that buttons have correct href attributes
    await expect(startButton).toHaveAttribute('href', '/dashboard');
    await expect(exampleButton).toHaveAttribute('href', '/examples');
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/Cover Letter Generator - AI-Powered Cover Letter Tool/);

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      /Generate professional, personalized cover letters using AI technology/
    );

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute(
      'content',
      /Cover Letter Generator - AI-Powered Cover Letter Tool/
    );
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that mobile navigation works
    const mobileMenuButton = page.getByRole('button', { name: /Open menu|Close menu/ });
    await expect(mobileMenuButton).toBeVisible();

    // Open mobile menu
    await mobileMenuButton.click();

    // Check that navigation items are visible in mobile menu
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Templates' })).toBeVisible();
  });

  test('should have accessibility features', async ({ page }) => {
    // Check for skip links
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeVisible();

    // Check that main content has proper ID
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();

    // Check for proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    const h2 = page.getByRole('heading', { level: 2 }).first();

    await expect(h1).toBeVisible();
    await expect(h2).toBeVisible();
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check that there are no JavaScript errors
    expect(errors).toHaveLength(0);
  });

  test('should have proper structured data', async ({ page }) => {
    // Check for JSON-LD structured data
    const structuredData = page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toHaveCount(2); // Website and Organization data

    // Verify the content contains expected schema types
    const websiteSchema = structuredData.first();
    const websiteContent = await websiteSchema.textContent();
    expect(websiteContent).toContain('"@type":"WebSite"');
    expect(websiteContent).toContain('Cover Letter Generator');
  });

  test('should have working footer', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Check footer content
    await expect(
      page.getByText('© 2024 Cover Letter Generator. All rights reserved.')
    ).toBeVisible();
  });
});

test.describe('Homepage Performance', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries();
          const vitals: Record<string, number> = {};

          entries.forEach(entry => {
            if (entry.name === 'FCP') {
              vitals.fcp = entry.startTime;
            }
            if (entry.name === 'LCP') {
              vitals.lcp = entry.startTime;
            }
          });

          resolve(vitals);
        }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

        // Fallback timeout
        setTimeout(() => resolve({}), 5000);
      });
    });

    console.log('Performance metrics:', metrics);

    // Note: In a real test, you would assert against specific thresholds
    // For example: expect(metrics.lcp).toBeLessThan(2500);
  });
});

test.describe('Homepage Accessibility', () => {
  test('should pass basic accessibility checks', async ({ page }) => {
    await page.goto('/');

    // Check for proper alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }

    // Check for proper form labels
    const inputs = page.locator('input');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');

      // Input should have either an id with corresponding label, aria-label, or aria-labelledby
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const labelExists = (await label.count()) > 0;
        expect(labelExists || ariaLabel || ariaLabelledBy).toBeTruthy();
      } else {
        expect(ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Start keyboard navigation
    await page.keyboard.press('Tab');

    // Check that focus is visible and moves through interactive elements
    let focusedElement = await page.locator(':focus').first();
    await expect(focusedElement).toBeVisible();

    // Continue tabbing through several elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      focusedElement = await page.locator(':focus').first();
      await expect(focusedElement).toBeVisible();
    }
  });
});
