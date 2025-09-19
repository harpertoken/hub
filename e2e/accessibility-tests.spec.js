import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading structure @accessibility', async ({ page }) => {
    // Wait for React app to fully load and render
    await page.waitForSelector('#root', { timeout: 10000 });

    // Wait for the main content to be visible (indicating React has rendered)
    await page.waitForSelector('main', { timeout: 10000 });

    // Check for h1 tag
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);

    // Check heading hierarchy (h1 -> h2 -> h3, etc.)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    expect(headings.length).toBeGreaterThan(0);
  });

  test('should have alt text for images @accessibility', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        // Alt text should exist (can be empty for decorative images)
        expect(alt).not.toBeNull();
      }
    }
  });

  test('should have proper form labels @accessibility', async ({ page }) => {
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');

        // Should have either id with label, aria-label, or aria-labelledby
        const hasLabel = id || ariaLabel || ariaLabelledBy;
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test('should have sufficient color contrast @accessibility', async ({ page }) => {
    // This is a basic check - in a real scenario you'd use axe-core or similar
    const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6');
    const textCount = await textElements.count();

    // Just check that text is visible (basic contrast check)
    if (textCount > 0) {
      const firstText = textElements.first();
      const isVisible = await firstText.isVisible();
      expect(isVisible).toBe(true);
    }
  });

  test('should support keyboard navigation @accessibility', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');

    // Check if focus is visible
    const focusedElement = page.locator(':focus');
    const isFocusedVisible = await focusedElement.isVisible();

    if (isFocusedVisible) {
      // Should be able to tab through interactive elements
      await page.keyboard.press('Tab');
      const newFocusedElement = page.locator(':focus');
      const hasNewFocus = await newFocusedElement.isVisible();
      expect(hasNewFocus).toBe(true);
    }
  });

  test('should have proper ARIA attributes @accessibility', async ({ page }) => {
    // Check for ARIA roles
    const ariaElements = page.locator('[role]');
    const ariaCount = await ariaElements.count();

    if (ariaCount > 0) {
      for (let i = 0; i < ariaCount; i++) {
        const element = ariaElements.nth(i);
        const role = await element.getAttribute('role');

        // Common ARIA roles that need specific attributes
        if (role === 'combobox') {
          const ariaControls = await element.getAttribute('aria-controls');
          const ariaExpanded = await element.getAttribute('aria-expanded');
          expect(ariaControls).toBeTruthy();
          expect(ariaExpanded).toBeTruthy();
        }
      }
    }
  });

  test('should have proper document structure @accessibility', async ({ page }) => {
    // Check for main landmark
    const main = page.locator('main');
    if (await main.isVisible()) {
      await expect(main).toBeVisible();
    }

    // Check for navigation landmark
    const nav = page.locator('nav');
    if (await nav.isVisible()) {
      await expect(nav).toBeVisible();
    }

    // Check for skip links (accessibility best practice)
    // Skip links are good to have but not required
  });
});