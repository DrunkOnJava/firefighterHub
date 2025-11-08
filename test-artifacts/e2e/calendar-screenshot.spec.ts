import { test } from '@playwright/test';

test('capture calendar for analysis', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://firefighter-hub.vercel.app');
  await page.waitForLoadState('networkidle');
  
  // Click on Calendar view
  const calendarButton = page.locator('text=Calendar');
  if (await calendarButton.isVisible()) {
    await calendarButton.click();
    await page.waitForTimeout(1000);
  }
  
  // Take screenshot
  await page.screenshot({ 
    path: '/tmp/calendar-current.png',
    fullPage: true 
  });
  
  // Get calendar dimensions
  const calendarInfo = await page.evaluate(() => {
    const calendar = document.querySelector('[class*="calendar"]') || document.querySelector('table');
    if (!calendar) return null;
    
    const rect = calendar.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  });
  
  console.log('\n=== CALENDAR DIMENSIONS ===');
  console.log(JSON.stringify(calendarInfo, null, 2));
  console.log('\nScreenshot: /tmp/calendar-current.png');
});
