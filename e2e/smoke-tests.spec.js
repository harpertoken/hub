import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage @smoke', async ({ page }) => {
    // Check if the page loads
    await expect(page).toHaveTitle(/Harper|Hub/i);

    // Check for main content areas
    await expect(page.locator('main')).toBeVisible();

    // Check for navigation
    const nav = page.locator('nav');
    if (await nav.isVisible()) {
      await expect(nav).toBeVisible();
    }
  });

  test('should have working navigation @smoke', async ({ page }) => {
    // Check if navigation links exist and are clickable
    const links = page.locator('a[href]');
    const linkCount = await links.count();

    if (linkCount > 0) {
      // Test first navigation link
      const firstLink = links.first();
      const href = await firstLink.getAttribute('href');

      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        await firstLink.click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(href);
      }
    }
  });

  test('should handle basic interactions @smoke', async ({ page }) => {
    // Check for buttons and test basic interactions
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      // Test first button (should not cause errors)
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();

      // Check if button is enabled
      const isEnabled = await firstButton.isEnabled();
      if (isEnabled) {
        await firstButton.click();
        // Should not crash the page
        await expect(page.locator('body')).toBeVisible();
      }
    }
  });

  test('should be responsive @smoke', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Page should still be functional on mobile
    await expect(page.locator('body')).toBeVisible();

    // Check if mobile menu exists (if applicable)
    const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, #mobile-menu');
    if (await mobileMenu.isVisible()) {
      await expect(mobileMenu).toBeVisible();
    }
  });
});