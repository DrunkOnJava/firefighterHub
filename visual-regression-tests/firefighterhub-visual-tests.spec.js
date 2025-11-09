const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Configuration
const BASE_URL = 'http://localhost:5174'; // FirefighterHub dev server URL
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const BASELINE_DIR = path.join(SCREENSHOTS_DIR, 'baseline');
const CURRENT_DIR = path.join(SCREENSHOTS_DIR, 'current');

// Ensure screenshot directories exist
if (!fs.existsSync(BASELINE_DIR)) {
  fs.mkdirSync(BASELINE_DIR, { recursive: true });
}
if (!fs.existsSync(CURRENT_DIR)) {
  fs.mkdirSync(CURRENT_DIR, { recursive: true });
}

test.describe('FirefighterHub Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Hold Rotation Manager page
    await page.goto(BASE_URL);
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('Full page screenshot', async ({ page }) => {
    await page.screenshot({
      path: path.join(CURRENT_DIR, 'firefighterhub-full-page.png'),
      fullPage: true
    });
  });

  test('Header and navigation', async ({ page }) => {
    // Top navigation bar
    const header = page.locator('header, nav, [role="navigation"]').first();
    if (await header.count() > 0) {
      await header.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-header-navigation.png')
      });
    }
  });

  test('FirefighterHub logo and branding', async ({ page }) => {
    // Logo element
    const logo = page.locator('img[alt*="FirefighterHub"], img[alt*="logo"], .logo').first();
    if (await logo.count() > 0) {
      await logo.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-logo-branding.png')
      });
    }
  });

  test('Shift buttons (A, B, C)', async ({ page }) => {
    // Shift selector buttons
    const shiftButtons = page.locator('[data-testid*="shift"], button:has-text("Shift A"), button:has-text("A")').first();
    if (await shiftButtons.count() > 0) {
      const container = shiftButtons.locator('..').first();
      await container.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-shift-buttons-abc.png')
      });
    }
  });

  test('Toolbar buttons (Print, Activity, Light, BC Mode, Help)', async ({ page }) => {
    // Toolbar with action buttons
    const toolbar = page.locator('[role="toolbar"], .toolbar, .action-buttons').first();
    if (await toolbar.count() > 0) {
      await toolbar.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-toolbar-buttons.png')
      });
    }
  });

  test('Calendar view - November 2025', async ({ page }) => {
    // Main calendar component
    const calendar = page.locator('[data-testid*="calendar"], .calendar, [class*="calendar"]').first();
    if (await calendar.count() > 0) {
      await calendar.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-calendar-view.png')
      });
    }
  });

  test('Calendar navigation controls', async ({ page }) => {
    // Previous/Next month buttons and Today button
    const calendarNav = page.locator('[data-testid*="calendar-nav"], .calendar-navigation').first();
    if (await calendarNav.count() > 0) {
      await calendarNav.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-calendar-navigation.png')
      });
    }
  });

  test('Hold event pills/badges', async ({ page }) => {
    // Individual hold event in calendar
    const holdEvent = page.locator('[data-testid*="hold"], .hold-event, [class*="hold"]').first();
    if (await holdEvent.count() > 0) {
      await holdEvent.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-hold-event-pill.png')
      });
    }
  });

  test('Next Up section - Shift panels', async ({ page }) => {
    // "Next Up" section showing upcoming shifts
    const nextUp = page.locator('[data-testid*="next-up"], .next-up, :has-text("Next Up")').first();
    if (await nextUp.count() > 0) {
      await nextUp.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-next-up-section.png')
      });
    }
  });

  test('Shift A panel', async ({ page }) => {
    const shiftA = page.locator('[data-testid*="shift-a"], :has-text("SHIFT A")').first();
    if (await shiftA.count() > 0) {
      await shiftA.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-shift-a-panel.png')
      });
    }
  });

  test('Shift B panel', async ({ page }) => {
    const shiftB = page.locator('[data-testid*="shift-b"], :has-text("SHIFT B")').first();
    if (await shiftB.count() > 0) {
      await shiftB.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-shift-b-panel.png')
      });
    }
  });

  test('Shift C panel', async ({ page }) => {
    const shiftC = page.locator('[data-testid*="shift-c"], :has-text("SHIFT C")').first();
    if (await shiftC.count() > 0) {
      await shiftC.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-shift-c-panel.png')
      });
    }
  });

  test('Firefighter Roster table', async ({ page }) => {
    // Complete roster table
    const roster = page.locator('[data-testid*="roster"], table, .roster-table').first();
    if (await roster.count() > 0) {
      await roster.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-roster-table.png')
      });
    }
  });

  test('Roster filter and export buttons', async ({ page }) => {
    // Filter and Export buttons above roster
    const rosterControls = page.locator('[data-testid*="roster-controls"], .roster-controls').first();
    if (await rosterControls.count() > 0) {
      await rosterControls.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-roster-controls.png')
      });
    }
  });

  test('Roster table header row', async ({ page }) => {
    // Table headers (Order, Name, Last Hold, Volunteer)
    const tableHeader = page.locator('thead, .table-header').first();
    if (await tableHeader.count() > 0) {
      await tableHeader.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-roster-header.png')
      });
    }
  });

  test('Individual roster row', async ({ page }) => {
    // Single firefighter row
    const rosterRow = page.locator('tbody tr, .roster-row').first();
    if (await rosterRow.count() > 0) {
      await rosterRow.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-roster-row-sample.png')
      });
    }
  });

  test('Filter modal/panel', async ({ page }) => {
    // Click filter button to open filter panel
    const filterButton = page.locator('button:has-text("Filter"), [data-testid*="filter-button"]').first();
    if (await filterButton.count() > 0) {
      await filterButton.click();
      await page.waitForTimeout(500); // Wait for animation
      
      const filterPanel = page.locator('[data-testid*="filter"], .filter-panel, [role="dialog"]').first();
      if (await filterPanel.count() > 0) {
        await filterPanel.screenshot({
          path: path.join(CURRENT_DIR, 'firefighterhub-filter-panel.png')
        });
      }
    }
  });

  test('Week view timeline', async ({ page }) => {
    // Week calendar view with timeline
    const weekView = page.locator('[data-testid*="week-view"], .week-calendar').first();
    if (await weekView.count() > 0) {
      await weekView.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-week-timeline.png')
      });
    }
  });

  test('Mobile responsive - Header', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const header = page.locator('header, nav').first();
    if (await header.count() > 0) {
      await header.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-mobile-header.png')
      });
    }
  });

  test('Mobile responsive - Calendar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const calendar = page.locator('[data-testid*="calendar"], .calendar').first();
    if (await calendar.count() > 0) {
      await calendar.screenshot({
        path: path.join(CURRENT_DIR, 'firefighterhub-mobile-calendar.png')
      });
    }
  });

  test('Tablet responsive - Full page', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.screenshot({
      path: path.join(CURRENT_DIR, 'firefighterhub-tablet-full-page.png'),
      fullPage: true
    });
  });
});

// Visual comparison test (optional - requires baseline images)
test.describe('Visual Comparison with Baseline', () => {
  test('Compare full page with baseline', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('firefighterhub-baseline.png', {
      fullPage: true,
      maxDiffPixels: 100 // Allow small differences
    });
  });
});
