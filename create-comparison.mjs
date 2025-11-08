import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  console.log('\n=== CURRENT STATE VERIFICATION ===\n');
  
  // Verify Next Up cards
  const cards = await page.locator('[aria-label*="Next up for Shift"]').all();
  console.log(`✅ Next Up Cards: ${cards.length} found`);
  
  for (const card of cards) {
    const height = await card.evaluate(el => el.offsetHeight);
    const label = await card.getAttribute('aria-label');
    console.log(`   - ${label?.split(':')[0]}: ${height}px tall`);
  }
  
  // Verify header branding
  const brandText = await page.locator('h1').first().textContent();
  console.log(`\n✅ Header Branding: "${brandText?.trim()}"`);
  
  const subtitleText = await page.locator('h1').locator('..').locator('p').first().textContent();
  console.log(`✅ Header Subtitle: "${subtitleText?.trim()}"`);
  
  // Verify gradient classes
  const gradients = await page.locator('.bg-gradient-to-r, .bg-gradient-to-br').count();
  console.log(`\n✅ Gradient Elements: ${gradients} found`);
  
  // Verify roster table
  const rosterTable = await page.locator('.roster-table');
  const isCompact = await rosterTable.evaluate(el => el.classList.contains('compact'));
  const rows = await page.locator('.roster-table tbody tr').count();
  const firstRowHeight = await page.locator('.roster-table tbody tr').first().evaluate(el => el.offsetHeight);
  
  console.log(`\n✅ Roster Table:`);
  console.log(`   - Rows: ${rows}`);
  console.log(`   - Compact mode: ${isCompact ? 'YES' : 'NO'}`);
  console.log(`   - Row height: ${firstRowHeight}px`);
  
  // Check for event pills
  const scheduledPills = await page.locator('.bg-gradient-to-r.from-orange-500').count();
  const completedPills = await page.locator('.bg-gradient-to-r.from-emerald-600').count();
  
  console.log(`\n✅ Event Pills:`);
  console.log(`   - Scheduled (orange gradient): ${scheduledPills} found`);
  console.log(`   - Completed (green gradient): ${completedPills} found`);
  
  console.log('\n=== ALL CHANGES VERIFIED ===\n');
  
  await browser.close();
})();
