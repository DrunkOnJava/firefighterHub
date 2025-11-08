import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const analysis = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[aria-label*="Next up for Shift"]'));
    return cards.map((card, idx) => {
      const cardHeight = card.offsetHeight;
      const cardScroll = card.scrollHeight;
      const overflow = window.getComputedStyle(card).overflow;
      
      return {
        shift: ['A', 'B', 'C'][idx],
        cardHeight,
        scrollHeight: cardScroll,
        overflow,
        clipped: cardScroll > cardHeight,
        diff: cardScroll - cardHeight
      };
    });
  });
  
  console.log('\n=== CARD OVERFLOW STATUS ===\n');
  analysis.forEach(data => {
    console.log(`Shift ${data.shift}:`);
    console.log(`  Card height: ${data.cardHeight}px`);
    console.log(`  Content needs: ${data.scrollHeight}px`);
    console.log(`  Overflow CSS: ${data.overflow}`);
    console.log(`  Status: ${data.clipped ? `⚠️ CLIPPED by ${data.diff}px` : '✅ OK'}`);
    console.log('');
  });
  
  await browser.close();
})();
