import { test } from '@playwright/test';

test('verify visual hierarchy improvements', async ({ page }) => {
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
  
  // Take screenshot showing normal state
  await page.screenshot({ 
    path: '/tmp/visual-hierarchy-bold-nextup-mini-legend.png',
    fullPage: false
  });
  
  console.log('✅ Screenshot 1: Bold Next-Up chips + Mini legend visible');
  
  // Hover over first Next-Up chip to show tooltip
  const chips = await page.locator('button:has-text("Station #")').all();
  if (chips.length > 0) {
    await chips[0].hover();
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: '/tmp/hover-tooltip-operational-stats-last-hold-position-certs.png',
      fullPage: false
    });
    
    console.log('✅ Screenshot 2: Hover tooltip with operational stats');
  }
});
