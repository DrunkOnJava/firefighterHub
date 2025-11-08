import { test } from '@playwright/test';

test('capture roster table screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://firefighter-88lylaidj-griffins-projects-c51c3288.vercel.app');
  
  await page.waitForSelector('table', { timeout: 10000 });
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: '/tmp/roster-final.png', fullPage: false });
  
  const rowData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    return rows.slice(0, 10).map((row, i) => ({
      index: i + 1,
      height: row.offsetHeight,
      computedHeight: window.getComputedStyle(row).height
    }));
  });
  
  console.log('\n=== FINAL ROW HEIGHTS ===');
  console.log(JSON.stringify(rowData, null, 2));
  console.log('Screenshot saved to: /tmp/roster-final.png');
});
