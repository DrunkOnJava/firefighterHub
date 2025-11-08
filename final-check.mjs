import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1200 } });
  
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Scroll to top
  await page.evaluate(() => window.scrollTo(0, 0));
  
  // Full page screenshot  
  await page.screenshot({ 
    path: 'verification-screenshots/VERIFIED-fullpage.png',
    fullPage: true
  });
  
  // Next Up section with more height
  await page.screenshot({
    path: 'verification-screenshots/VERIFIED-nextup.png',
    clip: { x: 0, y: 80, width: 1920, height: 600 }
  });
  
  // Each individual card with surrounding context
  const cards = await page.locator('[aria-label*="Next up for Shift"]').all();
  
  for (let i = 0; i < cards.length; i++) {
    const box = await cards[i].boundingBox();
    if (box) {
      // Add 20px padding around card
      await page.screenshot({
        path: `verification-screenshots/VERIFIED-card-${['A', 'B', 'C'][i]}.png`,
        clip: { 
          x: Math.max(0, box.x - 20),
          y: Math.max(0, box.y - 20),
          width: box.width + 40,
          height: box.height + 40
        }
      });
    }
  }
  
  // Get actual rendered content
  const cardData = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[aria-label*="Next up for Shift"]'));
    return cards.map(card => {
      const nameEl = card.querySelector('.text-2xl');
      const statsEls = Array.from(card.querySelectorAll('.text-sm'));
      const badges = Array.from(card.querySelectorAll('.px-2.py-1'));
      
      return {
        name: nameEl?.textContent?.trim(),
        stats: statsEls.map(el => el.textContent?.trim()),
        badgeCount: badges.length,
        height: card.offsetHeight,
        overflow: window.getComputedStyle(card).overflow
      };
    });
  });
  
  console.log('\n=== RENDERED CARD DATA ===\n');
  cardData.forEach((data, i) => {
    console.log(`Shift ${['A', 'B', 'C'][i]}:`);
    console.log(`  Name: ${data.name}`);
    console.log(`  Height: ${data.height}px`);
    console.log(`  Overflow: ${data.overflow}`);
    console.log(`  Apparatus badges: ${data.badgeCount}`);
    console.log(`  Stats visible: ${data.stats.length > 0 ? 'YES' : 'NO'}`);
    console.log('');
  });
  
  await browser.close();
})();
