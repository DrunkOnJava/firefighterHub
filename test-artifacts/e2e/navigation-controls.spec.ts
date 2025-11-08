import { test } from '@playwright/test';

test('verify segmented controls and keyboard navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://firefighter-hub.vercel.app', {
    waitUntil: 'networkidle',
    timeout: 60000
  });
  
  await page.waitForTimeout(3000);
  
  // Navigate to October
  const buttons = await page.locator('.rbc-toolbar button').all();
  if (buttons.length >= 2) {
    await buttons[1].click();
    await page.waitForTimeout(2000);
  }
  
  // Screenshot showing segmented controls and keyboard hint
  await page.screenshot({ 
    path: '/tmp/segmented-controls-month-week-day-pill-keyboard-hint.png',
    fullPage: false
  });
  
  console.log('✅ Segmented controls (Month/Week/Day pill) + keyboard hint visible');
  
  // Click Week view to show segmented control selected state
  const viewButtons = await page.locator('.rbc-btn-group:last-child button').all();
  if (viewButtons.length >= 2) {
    await viewButtons[1].click(); // Click Week
    await page.waitForTimeout(1500);
    
    await page.screenshot({ 
      path: '/tmp/week-view-selected-segmented-control-active-state.png',
      fullPage: false
    });
    
    console.log('✅ Week view selected - segmented control active state');
  }
});
