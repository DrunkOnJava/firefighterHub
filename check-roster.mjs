import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check for roster table
  const rosterTable = page.locator('.roster-table');
  const tableExists = await rosterTable.count();
  console.log('Found roster table:', tableExists);
  
  if (tableExists > 0) {
    // Check if compact class is applied
    const isCompact = await rosterTable.evaluate(el => el.classList.contains('compact'));
    console.log('Roster has compact class:', isCompact);
    
    // Get first row height
    const firstRow = page.locator('.roster-table tbody tr').first();
    const box = await firstRow.boundingBox();
    console.log('First row height:', box?.height, 'px');
  }
  
  // Take screenshot of roster section
  const roster = page.locator('text=Firefighter Roster').locator('..').locator('..');
  if (await roster.isVisible()) {
    await roster.screenshot({ path: 'verification-screenshots/current-roster.png' });
    console.log('Roster screenshot saved');
  }
  
  await browser.close();
})();
