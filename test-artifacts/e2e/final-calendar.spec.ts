import { test } from '@playwright/test';

test('capture improved calendar', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://firefighter-hub.vercel.app');
  await page.waitForLoadState('networkidle');
  
  // Navigate to calendar
  await page.click('button:has-text("Calendar")');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ 
    path: '/tmp/calendar-improved.png',
    fullPage: false 
  });
  
  console.log('\n✅ Improved calendar screenshot: /tmp/calendar-improved.png');
});
