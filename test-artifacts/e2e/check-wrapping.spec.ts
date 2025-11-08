import { test } from '@playwright/test';

test('verify no text wrapping in table', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Wait for deployment - get latest URL
  await page.goto('https://firefighter-hub.vercel.app');
  
  await page.waitForSelector('table', { timeout: 10000 });
  await page.waitForTimeout(2000);
  
  // Check if any names are wrapping
  const wrappingCheck = await page.evaluate(() => {
    const nameButtons = Array.from(document.querySelectorAll('tbody button'));
    return nameButtons.slice(0, 10).map((button, i) => {
      const rect = button.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(button);
      return {
        index: i + 1,
        text: button.textContent,
        height: rect.height,
        whiteSpace: computedStyle.whiteSpace,
        overflow: computedStyle.overflow,
      };
    });
  });
  
  console.log('\n=== NAME BUTTON WRAPPING CHECK ===');
  console.log(JSON.stringify(wrappingCheck, null, 2));
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/no-wrap-test.png', fullPage: false });
  console.log('\nScreenshot: /tmp/no-wrap-test.png');
});
