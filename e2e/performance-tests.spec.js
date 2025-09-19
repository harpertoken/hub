import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load homepage within performance budget @performance', async ({ page }) => {
    const startTime = Date.now();

    // Navigate and wait for load
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    // Performance budget: page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    console.log(`Page load time: ${loadTime}ms`);
  });

  test('should have reasonable bundle size @performance', async ({ page }) => {
    // Check for large assets
    const resources = [];

    page.on('response', response => {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';

      if (contentType.includes('javascript') || contentType.includes('css')) {
        resources.push({
          url,
          size: response.headers()['content-length'] || '0',
          contentType
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Check bundle sizes (should be reasonable)
    const jsBundles = resources.filter(r => r.contentType.includes('javascript'));
    const totalJSSize = jsBundles.reduce((sum, r) => sum + parseInt(r.size || 0), 0);

    // Bundle size should be under 5MB (reasonable for a React app)
    expect(totalJSSize).toBeLessThan(5 * 1024 * 1024);

    console.log(`Total JS bundle size: ${(totalJSSize / 1024 / 1024).toFixed(2)}MB`);
  });

  test('should render without layout shifts @performance', async ({ page }) => {
    // Monitor layout shifts using Performance Observer API
    const layoutShiftData = await page.evaluate(() => {
      return new Promise((resolve) => {
        let layoutShifts = 0;
        let maxShift = 0;

        // Create a PerformanceObserver to monitor layout shifts
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              layoutShifts++;
              maxShift = Math.max(maxShift, entry.value);
            }
          }
        });

        observer.observe({ entryTypes: ['layout-shift'] });

        // Wait for 2 seconds to collect data
        setTimeout(() => {
          observer.disconnect();
          resolve({ layoutShifts, maxShift });
        }, 2000);
      });
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait a bit for dynamic content
    await page.waitForTimeout(2000);

    // Layout shifts should be minimal
    expect(layoutShiftData.layoutShifts).toBeLessThan(5);
    expect(layoutShiftData.maxShift).toBeLessThan(0.1); // CLS score under 0.1 is good

    console.log(`Layout shifts: ${layoutShiftData.layoutShifts}, Max shift: ${layoutShiftData.maxShift}`);
  });

  test('should handle navigation efficiently @performance', async ({ page }) => {
    await page.goto('/');

    // Find navigation links
    const links = page.locator('a[href]');
    const linkCount = await links.count();

    if (linkCount > 0) {
      // Test navigation performance
      const firstLink = links.first();
      const href = await firstLink.getAttribute('href');

      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        const startTime = Date.now();
        await firstLink.click();
        await page.waitForLoadState('networkidle');
        const navTime = Date.now() - startTime;

        // Navigation should be fast
        expect(navTime).toBeLessThan(2000);

        console.log(`Navigation time: ${navTime}ms`);
      }
    }
  });

  test('should have good Core Web Vitals @performance', async ({ page }) => {
    // Monitor Core Web Vitals using web-vitals library or Performance Observer
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const metrics = {};

        // Use PerformanceObserver to monitor Core Web Vitals
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime;
            } else if (entry.entryType === 'first-input') {
              metrics.fid = entry.processingStart - entry.startTime;
            } else if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + entry.value;
            }
          }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

        // Wait for metrics to be collected
        setTimeout(() => {
          observer.disconnect();
          resolve(metrics);
        }, 3000);
      });
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for metrics to be collected
    await page.waitForTimeout(3000);

    // Check Core Web Vitals (if available)
    if (vitals.lcp) {
      console.log(`LCP: ${vitals.lcp}ms`);
      // LCP should be under 2.5s for good UX
      expect(vitals.lcp).toBeLessThan(2500);
    }

    if (vitals.cls !== undefined) {
      console.log(`CLS: ${vitals.cls}`);
      // CLS should be under 0.1 for good UX
      expect(vitals.cls).toBeLessThan(0.1);
    }

    if (vitals.fid) {
      console.log(`FID: ${vitals.fid}ms`);
      // FID should be under 100ms for good UX
      expect(vitals.fid).toBeLessThan(100);
    }
  });

  test('should handle memory efficiently @performance', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Get initial memory usage using proper Playwright API
    const initialMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    });
    const initialJSHeap = initialMetrics?.usedJSHeapSize || 0;

    // Perform some interactions
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      // Click a few buttons
      for (let i = 0; i < Math.min(3, buttonCount); i++) {
        await buttons.nth(i).click();
        await page.waitForTimeout(500);
      }
    }

    // Check memory after interactions using proper Playwright API
    const finalMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    });
    const finalJSHeap = finalMetrics?.usedJSHeapSize || 0;
    const memoryIncrease = finalJSHeap - initialJSHeap;

    // Memory increase should be reasonable (under 50MB)
    // Note: Skip this check if memory API is not available (e.g., in some browsers)
    if (initialMetrics && finalMetrics) {
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
      console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    } else {
      console.log('Memory API not available in this browser, skipping memory test');
    }
  });
});