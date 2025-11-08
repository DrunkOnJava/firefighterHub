import { test } from '@playwright/test';

test('verify calendar header elements', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://firefighter-hub.vercel.app');
  await page.waitForLoadState('networkidle');
  
  // Click Calendar
  await page.click('button:has-text("Calendar")');
  await page.waitForTimeout(2000);
  
  // Check what elements are visible
  const elements = await page.evaluate(() => {
    const header = document.querySelector('h2');
    const navButtons = document.querySelectorAll('button[aria-label*="month"]');
    const legendItems = document.querySelectorAll('span:has-text("Scheduled"), span:has-text("Today")');
    
    return {
      headerText: header?.textContent,
      navButtonCount: navButtons.length,
      legendVisible: legendItems.length > 0,
      legendCount: legendItems.length,
    };
  });
  
  console.log('\n=== CALENDAR HEADER CHECK ===');
  console.log(JSON.stringify(elements, null, 2));
  
  await page.screenshot({ path: '/tmp/verify-header.png', fullPage: false });
  console.log('Screenshot: /tmp/verify-header.png');
});
