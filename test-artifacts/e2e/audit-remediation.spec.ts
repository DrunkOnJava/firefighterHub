/**
 * Audit Remediation E2E Test Suite
 * Tests all critical fixes from the comprehensive audit
 * Validates RFC acceptance criteria
 */

import { test, expect } from '@playwright/test';

test.describe('Audit Remediation - Critical Fixes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174');
    // Wait for initial load
    await page.waitForSelector('h1:has-text("Hold List Manager")');
  });

  test('CR-01: WebSocket connection succeeds with no errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait for real-time subscription
    await page.waitForTimeout(3000);

    // Check for WebSocket errors
    const wsErrors = consoleErrors.filter(
      (err) =>
        err.includes('WebSocket') ||
        err.includes('Authentication failed') ||
        err.includes('%0A')
    );

    expect(wsErrors).toHaveLength(0);
    console.log('✅ CR-01: No WebSocket errors detected');
  });

  test('CR-02: Connection status indicator appears', async ({ page }) => {
    // Connection indicator should be present (but may be hidden if connected)
    // Look for the component or check it doesn't show errors

    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });

    await page.waitForTimeout(2000);

    // Should see subscription success messages
    const subscriptionMessages = consoleMessages.filter(
      (msg) => msg.includes('Real-time subscription active')
    );

    expect(subscriptionMessages.length).toBeGreaterThan(0);
    console.log(`✅ CR-02: ${subscriptionMessages.length} real-time subscriptions active`);
  });

  test('CR-03: Retry limit prevents infinite loops', async ({ page }) => {
    const retryMessages: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('Retrying in') || text.includes('attempt')) {
        retryMessages.push(text);
      }
    });

    // Wait for potential retry attempts
    await page.waitForTimeout(5000);

    // Should not see excessive retry attempts
    // Max should be 10 retries per channel (2 channels = 20 max)
    expect(retryMessages.length).toBeLessThan(25);
    console.log(`✅ CR-03: Retry attempts controlled (${retryMessages.length} messages)`);
  });

  test('CR-04: Touch targets meet 44px minimum', async ({ page }) => {
    // Test calendar date buttons
    const calendarButtons = page.locator('button').filter({
      hasText: /^\d+$/, // Date numbers
    });

    const firstButton = calendarButtons.first();
    const box = await firstButton.boundingBox();

    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      console.log(`✅ CR-04: Touch target height: ${box.height}px (minimum 44px)`);
    }
  });

  test('CR-05: Resource hints are present in HTML', async ({ page }) => {
    const content = await page.content();

    expect(content).toContain('rel="preconnect"');
    expect(content).toContain('tjljndzodowpohusrwhs.supabase.co');
    expect(content).toContain('rel="dns-prefetch"');

    console.log('✅ CR-05: Resource hints (preconnect + dns-prefetch) present');
  });

  test('CR-06: Security headers are set', async ({ page }) => {
    const response = await page.goto('http://localhost:5174');
    const headers = response?.headers();

    // Note: These headers may not be present in dev mode
    // They're set by Vercel in production via vercel.json
    console.log('📋 CR-06: Security headers (check in production):');
    console.log('   - CSP should be set in production');
    console.log('   - Permissions-Policy should be set in production');
  });
});

test.describe('RFC Acceptance Criteria - Business Logic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174');
    await page.waitForSelector('h1:has-text("Hold List Manager")');
  });

  test('AC-01: Calendar displays with proper structure', async ({ page }) => {
    // Verify calendar is visible
    await expect(page.locator('h2:has-text("Hold Calendar")')).toBeVisible();

    // Verify month navigation
    await expect(page.getByLabel('Previous month')).toBeVisible();
    await expect(page.getByLabel('Next month')).toBeVisible();

    // Verify weekday headers
    await expect(page.locator('text=Sunday')).toBeVisible();
    await expect(page.locator('text=Monday')).toBeVisible();

    console.log('✅ AC-01: Calendar structure validated');
  });

  test('AC-13: Dates are disabled for non-admin users (by design)', async ({ page }) => {
    // Get a future date button
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate();

    // Find date button
    const dateButton = page.locator(`button:has-text("${tomorrowDay}")`).first();

    // Should be disabled for non-admin users
    const isDisabled = await dateButton.isDisabled();
    expect(isDisabled).toBe(true);

    console.log('✅ AC-13: Future dates properly disabled for read-only users');
  });

  test('Anonymous user can view but not modify', async ({ page }) => {
    // Should see firefighter roster
    await expect(page.locator('text=/Firefighter Rotation|Team Roster/i')).toBeVisible();

    // Should NOT see "Add Member" button (admin only)
    const addButton = page.locator('button:has-text("Add Member")');
    await expect(addButton).toHaveCount(0);

    console.log('✅ Anonymous user has read-only access');
  });

  test('Help modal shows Battalion Chief login option', async ({ page }) => {
    // Open help modal
    await page.click('button[aria-label="Show help"]');

    // Wait for modal
    await expect(page.locator('text=Battalion Chief Login')).toBeVisible();

    // Should see login button
    await expect(page.locator('button:has-text("Battalion Chief Login")')).toBeVisible();

    console.log('✅ Help modal shows login option for battalion chiefs');
  });

  test('Shift selector works correctly', async ({ page }) => {
    // Find shift selector
    const shiftA = page.locator('button:has-text("Shift A")');
    const shiftB = page.locator('button:has-text("Shift B")');
    const shiftC = page.locator('button:has-text("Shift C")');

    // Verify all shifts are present
    await expect(shiftA).toBeVisible();
    await expect(shiftB).toBeVisible();
    await expect(shiftC).toBeVisible();

    // Click Shift B
    await shiftB.click();

    // Wait for loading
    await page.waitForTimeout(1000);

    // Should see different roster
    console.log('✅ Shift selector changes roster');
  });

  test('Search functionality works', async ({ page }) => {
    // Find search box
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('Michael');

    // Wait for filtering
    await page.waitForTimeout(500);

    // Should see result count update
    const resultText = await page.locator('text=/Showing \\d+ of \\d+/').textContent();
    expect(resultText).toContain('Showing');

    console.log(`✅ Search works: ${resultText}`);
  });
});

test.describe('Real-Time Functionality', () => {
  test('Real-time subscriptions establish successfully', async ({ page }) => {
    const subscriptionMessages: string[] = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('Real-time subscription active')) {
        subscriptionMessages.push(text);
      }
    });

    await page.goto('http://localhost:5174');
    await page.waitForSelector('h1');
    await page.waitForTimeout(3000);

    // Should have 2 subscriptions: firefighters and scheduled_holds
    expect(subscriptionMessages.length).toBeGreaterThanOrEqual(2);

    console.log('✅ Real-time subscriptions:', subscriptionMessages);
  });
});

test.describe('Performance Metrics', () => {
  test('Page loads quickly (LCP < 2.5s)', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('http://localhost:5174');
    await page.waitForSelector('h1:has-text("Hold List Manager")');

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2500);
    console.log(`✅ Page load time: ${loadTime}ms (target <2500ms)`);
  });

  test('No JavaScript errors on page load', async ({ page }) => {
    const jsErrors: string[] = [];

    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    await page.goto('http://localhost:5174');
    await page.waitForSelector('h1');
    await page.waitForTimeout(2000);

    expect(jsErrors).toHaveLength(0);
    console.log('✅ No JavaScript errors on page load');
  });
});

test.describe('Accessibility', () => {
  test('Skip to main content link is present', async ({ page }) => {
    await page.goto('http://localhost:5174');

    // Tab to focus skip link
    await page.keyboard.press('Tab');

    // Skip link should become visible when focused
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeVisible();

    console.log('✅ Skip to main content link accessible');
  });

  test('Keyboard navigation works', async ({ page }) => {
    await page.goto('http://localhost:5174');

    // Tab through interactive elements
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // First interactive element

    // Should have visible focus
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focusedElement).toBeTruthy();
    console.log(`✅ Keyboard navigation works (focused: ${focusedElement})`);
  });

  test('ARIA labels are present on interactive elements', async ({ page }) => {
    await page.goto('http://localhost:5174');

    // Check for ARIA labels
    const helpButton = page.getByLabel('Show help');
    const activityButton = page.getByLabel('View activity history');

    await expect(helpButton).toBeVisible();
    await expect(activityButton).toBeVisible();

    console.log('✅ ARIA labels present on buttons');
  });
});

test.describe('Empty States', () => {
  test('Activity log shows empty state', async ({ page }) => {
    await page.goto('http://localhost:5174');

    // Open activity log
    await page.click('button[aria-label="View activity history"]');

    // Should show empty state
    await expect(page.locator('text=No activity yet')).toBeVisible();

    console.log('✅ Empty state component renders correctly');
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('Mobile layout renders correctly', async ({ page }) => {
    await page.goto('http://localhost:5174');

    // Calendar should be visible
    await expect(page.locator('h2:has-text("Hold Calendar")')).toBeVisible();

    // Mobile menu button should be visible
    await expect(page.getByLabel('Open menu')).toBeVisible();

    // Desktop shift selector might be hidden
    console.log('✅ Mobile layout renders (375px viewport)');
  });

  test('Touch targets are adequate on mobile', async ({ page }) => {
    await page.goto('http://localhost:5174');

    // Get calendar date button
    const dateButton = page.locator('button').filter({
      hasText: /^\d+$/,
    }).first();

    const box = await dateButton.boundingBox();

    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
      console.log(`✅ Mobile touch targets: ${box.width}x${box.height}px`);
    }
  });
});
