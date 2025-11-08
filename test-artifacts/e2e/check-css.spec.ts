import { test } from '@playwright/test';

test('check if CSS is applied', async ({ page }) => {
  await page.goto('https://firefighter-4ul1d1kd7-griffins-projects-c51c3288.vercel.app');
  await page.waitForSelector('table', { timeout: 10000 });
  
  const cssCheck = await page.evaluate(() => {
    const table = document.querySelector('.roster-table');
    const firstRow = document.querySelector('.roster-table tbody tr');
    const firstCell = document.querySelector('.roster-table tbody td');
    
    return {
      hasRosterClass: !!table,
      rowStyles: firstRow ? {
        height: window.getComputedStyle(firstRow).height,
        maxHeight: window.getComputedStyle(firstRow).maxHeight,
      } : null,
      cellStyles: firstCell ? {
        height: window.getComputedStyle(firstCell).height,
        maxHeight: window.getComputedStyle(firstCell).maxHeight,
        overflow: window.getComputedStyle(firstCell).overflow,
      } : null,
    };
  });
  
  console.log('\n=== CSS APPLICATION CHECK ===');
  console.log(JSON.stringify(cssCheck, null, 2));
});
