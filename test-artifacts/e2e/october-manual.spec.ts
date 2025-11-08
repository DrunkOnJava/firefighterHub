import { test } from '@playwright/test';

test('navigate to October manually', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://firefighter-hub.vercel.app', {
    waitUntil: 'networkidle',
    timeout: 60000
  });
  
  await page.waitForTimeout(3000);
  
  // Get all buttons in toolbar
  const buttons = await page.locator('.rbc-toolbar button').all();
  console.log(`Found ${buttons.length} toolbar buttons`);
  
  // First button group should be navigation (Today, Back, Next)
  // Click the "Back" button (usually second button)
  if (buttons.length >= 2) {
    console.log('Clicking Back button...');
    await buttons[1].click();
    await page.waitForTimeout(2000);
  }
  
  // Take screenshot
  await page.screenshot({ 
    path: '/tmp/october-2025-materialm-blue-teal-coral-event-pills.png',
    fullPage: true
  });
  
  const info = await page.evaluate(() => ({
    month: document.querySelector('.rbc-toolbar-label')?.textContent,
    events: document.querySelectorAll('.rbc-event').length,
  }));
  
  console.log(`\nMonth: ${info.month}`);
  console.log(`Events: ${info.events}`);
});
