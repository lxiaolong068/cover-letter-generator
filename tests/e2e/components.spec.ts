import { test, expect } from '@playwright/test';

test.describe('Components Showcase Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should display the components showcase page', async ({ page }) => {
    // Check main heading
    await expect(page.getByRole('heading', { name: /UI组件展示/i })).toBeVisible();

    // Check description
    await expect(page.getByText(/这里展示了求职信生成器项目中使用的所有UI组件/)).toBeVisible();
  });

  test('should display all button variants', async ({ page }) => {
    // Check button section heading
    await expect(page.getByRole('heading', { name: /按钮组件/i })).toBeVisible();

    // Check button variants
    await expect(page.getByRole('button', { name: '主要按钮' })).toBeVisible();
    await expect(page.getByRole('button', { name: '次要按钮' })).toBeVisible();
    await expect(page.getByRole('button', { name: '轮廓按钮' })).toBeVisible();
    await expect(page.getByRole('button', { name: '幽灵按钮' })).toBeVisible();
    await expect(page.getByRole('button', { name: '危险按钮' })).toBeVisible();
    await expect(page.getByRole('button', { name: '链接按钮' })).toBeVisible();
  });

  test('should display button sizes', async ({ page }) => {
    // Check different button sizes
    await expect(page.getByRole('button', { name: '小按钮' })).toBeVisible();
    await expect(page.getByRole('button', { name: '中按钮' })).toBeVisible();
    await expect(page.getByRole('button', { name: '大按钮' })).toBeVisible();
    await expect(page.getByRole('button', { name: '超大按钮' })).toBeVisible();
  });

  test('should display button states', async ({ page }) => {
    // Check different button states
    await expect(page.getByRole('button', { name: '正常状态' })).toBeVisible();
    await expect(page.getByRole('button', { name: '加载中' })).toBeVisible();
    await expect(page.getByRole('button', { name: '禁用状态' })).toBeVisible();
    await expect(page.getByRole('button', { name: '全宽按钮' })).toBeVisible();

    // Check that disabled button is actually disabled
    const disabledButton = page.getByRole('button', { name: '禁用状态' });
    await expect(disabledButton).toBeDisabled();

    // Check that loading button shows loading state
    const loadingButton = page.getByRole('button', { name: '加载中' });
    await expect(loadingButton).toBeDisabled();
  });

  test('should display card components', async ({ page }) => {
    // Check card section heading
    await expect(page.getByRole('heading', { name: /卡片组件/i })).toBeVisible();

    // Check different card variants
    await expect(page.getByText('默认卡片')).toBeVisible();
    await expect(page.getByText('悬浮卡片')).toBeVisible();
    await expect(page.getByText('轮廓卡片')).toBeVisible();
    await expect(page.getByText('填充卡片')).toBeVisible();
    await expect(page.getByText('交互卡片')).toBeVisible();
  });

  test('should display form components', async ({ page }) => {
    // Check form section heading
    await expect(page.getByRole('heading', { name: /Form Components/i })).toBeVisible();

    // Check input components
    await expect(page.getByText('Input Components')).toBeVisible();
    await expect(page.getByText('Textarea Components')).toBeVisible();

    // Check that form inputs are present
    const inputs = page.locator('input[type="text"]');
    await expect(inputs).toHaveCount(4); // Based on the component showcase

    const textareas = page.locator('textarea');
    await expect(textareas).toHaveCount(3); // Based on the component showcase
  });

  test('should display layout components', async ({ page }) => {
    // Check layout section heading
    await expect(page.getByRole('heading', { name: /布局组件/i })).toBeVisible();

    // Check grid and flex examples
    await expect(page.getByText('网格布局')).toBeVisible();
    await expect(page.getByText('弹性布局')).toBeVisible();

    // Check that grid items are displayed
    const gridItems = page.getByText(/项目 \d+/);
    await expect(gridItems.first()).toBeVisible();
  });

  test('should display color system', async ({ page }) => {
    // Check color section heading
    await expect(page.getByRole('heading', { name: /色彩系统/i })).toBeVisible();

    // Check color categories
    await expect(page.getByText('主色调')).toBeVisible();
    await expect(page.getByText('次要色调')).toBeVisible();
    await expect(page.getByText('中性色调')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that content is still visible and properly laid out
    await expect(page.getByRole('heading', { name: /UI组件展示/i })).toBeVisible();

    // Check that cards stack vertically on mobile
    const cards = page.locator('[class*="grid"]').first();
    await expect(cards).toBeVisible();
  });

  test('should have proper accessibility', async ({ page }) => {
    // Check heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    const h2 = page.getByRole('heading', { level: 2 }).first();

    await expect(h1).toBeVisible();
    await expect(h2).toBeVisible();

    // Check that all buttons are keyboard accessible
    await page.keyboard.press('Tab');
    let focusedElement = await page.locator(':focus').first();
    await expect(focusedElement).toBeVisible();

    // Tab through several interactive elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      focusedElement = await page.locator(':focus').first();

      // If we reach a button, it should be focusable
      const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
      if (tagName === 'button') {
        await expect(focusedElement).toBeVisible();
      }
    }
  });

  test('should have working interactive elements', async ({ page }) => {
    // Test that buttons are clickable (non-disabled ones)
    const normalButton = page.getByRole('button', { name: 'Normal State' });
    await expect(normalButton).toBeEnabled();
    await normalButton.click();

    // Test that inputs are functional
    const firstInput = page.locator('input[type="text"]').first();
    await firstInput.fill('Test input');
    await expect(firstInput).toHaveValue('Test input');

    // Test that textareas are functional
    const firstTextarea = page.locator('textarea').first();
    await firstTextarea.fill('Test textarea content');
    await expect(firstTextarea).toHaveValue('Test textarea content');
  });

  test('should display proper visual hierarchy', async ({ page }) => {
    // Check that sections are properly spaced and organized
    const sections = page.locator('section');
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(3); // Should have multiple sections

    // Check that each section has a heading
    for (let i = 0; i < sectionCount; i++) {
      const section = sections.nth(i);
      const heading = section.locator('h2').first();
      await expect(heading).toBeVisible();
    }
  });

  test('should load without errors', async ({ page }) => {
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

  test('should have proper meta tags', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/Component Showcase - Cover Letter Generator/);

    // Check that it has noindex (since it's a development page)
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });
});
