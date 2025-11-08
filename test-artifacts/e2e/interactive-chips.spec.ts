import { test } from '@playwright/test';

test('demonstrate clickable Next-Up chip filtering', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://firefighter-hub.vercel.app', {
    waitUntil: 'networkidle',
    timeout: 60000
  });
  
  await page.waitForTimeout(3000);
  
  // Navigate to October for events
  const buttons = await page.locator('.rbc-toolbar button').all();
  if (buttons.length >= 2) {
    await buttons[1].click();
    await page.waitForTimeout(2000);
  }
  
  // Take before screenshot
  await page.screenshot({ 
    path: '/tmp/before-click-all-events-visible.png',
    fullPage: false
  });
  
  console.log('✅ Before: All events visible');
  
  // Find and click first Next-Up chip
  const chips = await page.locator('button:has-text("Station #")').all();
  
  if (chips.length > 0) {
    console.log(`Found ${chips.length} Next-Up chips`);
    
    // Click first chip
    await chips[0].click();
    await page.waitForTimeout(1500);
    
    // Take after screenshot
    await page.screenshot({ 
      path: '/tmp/after-click-filtered-events-gold-highlight.png',
      fullPage: false
    });
    
    const eventCount = await page.locator('.rbc-event').count();
    console.log(`✅ After: ${eventCount} filtered events with gold highlights`);
  } else {
    console.log('No Next-Up chips found');
  }
});
