import { test } from '@playwright/test';

test('capture fresh calendar', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://firefighter-hukn76er9-griffins-projects-c51c3288.vercel.app');
  await page.waitForLoadState('networkidle');
  
  // Click Calendar view
  const calendarBtn = page.locator('button:has-text("Calendar")');
  if (await calendarBtn.isVisible()) {
    await calendarBtn.click();
    await page.waitForTimeout(1500);
  }
  
  await page.screenshot({ 
    path: '/tmp/calendar-redesigned.png',
    fullPage: false 
  });
  
  console.log('Screenshot: /tmp/calendar-redesigned.png');
});
