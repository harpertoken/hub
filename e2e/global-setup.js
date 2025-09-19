const { chromium } = require('@playwright/test');

module.exports = async () => {
  // Global setup - runs once before all tests
  console.log('🚀 Starting E2E test suite...');

  // You can add global setup logic here
  // For example: database seeding, test data preparation, etc.

  // Ensure the application is ready
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(process.env.BASE_URL || 'http://localhost:3030');
    await page.waitForLoadState('networkidle');
    console.log('✅ Application is ready for testing');
  } catch (error) {
    console.warn('⚠️  Application may not be fully ready:', error.message);
  } finally {
    await browser.close();
  }
};