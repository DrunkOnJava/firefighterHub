import { test } from '@playwright/test';

test('verify deployed calendar changes', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Go directly to production
  await page.goto('https://firefighter-hub.vercel.app', {
    waitUntil: 'networkidle',
    timeout: 60000
  });
  
  // Wait for app to load
  await page.waitForTimeout(3000);
  
  // Look for Calendar navigation - try different selectors
  const calendarSelectors = [
    'button:has-text("Calendar")',
    'a:has-text("Calendar")',
    '[aria-label*="Calendar"]',
    'text=Calendar'
  ];
  
  let clicked = false;
  for (const selector of calendarSelectors) {
    try {
      const element = await page.locator(selector).first();
      if (await element.isVisible({ timeout: 5000 })) {
        await element.click();
        clicked = true;
        console.log(`✅ Clicked calendar using: ${selector}`);
        break;
      }
    } catch (e) {
      console.log(`❌ Selector failed: ${selector}`);
    }
  }
  
  if (!clicked) {
    console.log('⚠️  Could not find calendar button, taking homepage screenshot');
  }
  
  await page.waitForTimeout(2000);
  
  // Take screenshot
  await page.screenshot({ 
    path: '/tmp/deployed-calendar.png',
    fullPage: true
  });
  
  // Check what's actually rendered
  const pageInfo = await page.evaluate(() => {
    const dayCells = document.querySelectorAll('[class*="aspect-square"]');
    const todayCells = document.querySelectorAll('[class*="bg-blue-600"]');
    const orangePills = document.querySelectorAll('[class*="bg-orange-600"]');
    
    return {
      totalDayCells: dayCells.length,
      todayHighlights: todayCells.length,
      orangeHoldPills: orangePills.length,
      url: window.location.href,
    };
  });
  
  console.log('\n=== PAGE VERIFICATION ===');
  console.log(JSON.stringify(pageInfo, null, 2));
  console.log('\n✅ Screenshot: /tmp/deployed-calendar.png');
});
