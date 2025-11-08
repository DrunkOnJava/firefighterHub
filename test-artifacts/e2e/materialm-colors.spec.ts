import { test } from '@playwright/test';

test('verify MaterialM blue-teal-coral event colors', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://firefighter-hub.vercel.app', {
    waitUntil: 'networkidle',
    timeout: 60000
  });
  
  await page.waitForTimeout(3000);
  
  // Take screenshot showing MaterialM standard colors
  await page.screenshot({ 
    path: '/tmp/materialm-blue-scheduled-teal-completed-coral-skipped.png',
    fullPage: true
  });
  
  console.log('\n✅ Screenshot: materialm-blue-scheduled-teal-completed-coral-skipped.png');
  console.log('   Look for:');
  console.log('   - Scheduled holds: #5d87ff (MaterialM blue)');
  console.log('   - Completed holds: #13deb9 (MaterialM teal)');
  console.log('   - Skipped holds: #fa896b (MaterialM coral)');
  console.log('   - Standard pill size: 4px 8px padding, 0.875rem font');
});
