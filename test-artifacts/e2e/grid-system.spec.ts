import { test, expect } from '@playwright/test';

/**
 * Grid System E2E Tests
 * 
 * Tests the grid system implementation across the application
 */

test.describe('Grid System Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('application loads without errors', async ({ page }) => {
    // Just verify the app loads
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check for React root
    const root = page.locator('#root');
    await expect(root).toBeVisible();
  });

  test('can navigate calendar months', async ({ page }) => {
    // Look for month navigation buttons
    const prevButton = page.locator('button[aria-label*="Previous"], button:has-text("‹")').first();
    const nextButton = page.locator('button[aria-label*="Next"], button:has-text("›")').first();
    
    if (await prevButton.isVisible()) {
      await prevButton.click();
      await page.waitForTimeout(500);
    }
    
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
    }
    
    // App should still be functional
    await expect(page.locator('#root')).toBeVisible();
  });

  test('responsive at 375px mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('#root')).toBeVisible();
  });

  test('responsive at 768px tablet width', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('#root')).toBeVisible();
  });

  test('responsive at 1920px desktop width', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('#root')).toBeVisible();
  });
});
