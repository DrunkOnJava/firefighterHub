import { test } from '@playwright/test';

test('navigate to October 2025 with multiple clicks', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://firefighter-hub.vercel.app', {
    waitUntil: 'networkidle',
    timeout: 60000
  });
  
  await page.waitForTimeout(3000);
  
  console.log('Finding previous month button...');
  
  // Try different selectors for previous button
  const prevSelectors = [
    'button:has-text("Previous")',
    'button[aria-label="Previous month"]',
    '.rbc-toolbar button:first-child',
    'button:has-text("‹")',
  ];
  
  let clicked = false;
  for (const selector of prevSelectors) {
    try {
      const button = page.locator(selector).first();
      if (await button.isVisible({ timeout: 2000 })) {
        console.log(`Found button with selector: ${selector}`);
        await button.click();
        await page.waitForTimeout(1500);
        clicked = true;
        break;
      }
    } catch (e) {
      // Try next selector
    }
  }
  
  if (!clicked) {
    console.log('Could not find previous button, showing current month');
  }
  
  // Take screenshot
  await page.screenshot({ 
    path: '/tmp/october-2025-materialm-blue-teal-coral-event-pills.png',
    fullPage: true
  });
  
  const pageInfo = await page.evaluate(() => {
    const monthLabel = document.querySelector('.rbc-toolbar-label');
    const events = document.querySelectorAll('.rbc-event');
    
    return {
      currentMonth: monthLabel?.textContent,
      totalEvents: events.length,
      firstEventText: events[0]?.textContent,
    };
  });
  
  console.log('\n=== CALENDAR INFO ===');
  console.log(JSON.stringify(pageInfo, null, 2));
  console.log('\n✅ Screenshot saved');
});
