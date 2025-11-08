import { test } from '@playwright/test';

test('navigate to October and verify before screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://firefighter-hub.vercel.app', {
    waitUntil: 'networkidle',
    timeout: 60000
  });
  
  await page.waitForTimeout(3000);
  
  // Get current month
  let currentMonth = await page.locator('.rbc-toolbar-label').textContent();
  console.log(`Starting month: ${currentMonth}`);
  
  // Click back until we see "October"
  let clicks = 0;
  while (!currentMonth?.includes('October') && clicks < 5) {
    console.log(`Clicking back... (attempt ${clicks + 1})`);
    
    // Click the Back button (2nd button in toolbar, index 1)
    const buttons = await page.locator('.rbc-toolbar button').all();
    if (buttons.length >= 2) {
      await buttons[1].click();
      await page.waitForTimeout(2000);
      currentMonth = await page.locator('.rbc-toolbar-label').textContent();
      console.log(`Now showing: ${currentMonth}`);
      clicks++;
    } else {
      console.log('Could not find toolbar buttons');
      break;
    }
  }
  
  // Verify we're on October
  const finalMonth = await page.locator('.rbc-toolbar-label').textContent();
  console.log(`\nFinal month: ${finalMonth}`);
  
  if (!finalMonth?.includes('October')) {
    console.log('WARNING: Not on October! Taking screenshot anyway...');
  } else {
    console.log('✓ Successfully navigated to October');
  }
  
  // Count events
  const eventCount = await page.locator('.rbc-event').count();
  console.log(`Event count: ${eventCount}`);
  
  // Take screenshot
  await page.screenshot({ 
    path: '/tmp/october-2025-materialm-blue-teal-coral-event-pills.png',
    fullPage: false
  });
  
  console.log('\n✅ Screenshot saved: october-2025-materialm-blue-teal-coral-event-pills.png');
});
