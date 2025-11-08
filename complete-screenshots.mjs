import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Full page screenshot
  await page.screenshot({ 
    path: 'verification-screenshots/FINAL-full-page.png', 
    fullPage: true 
  });
  
  // Find and screenshot the entire Next Up section
  const nextUpSection = page.locator('[class*="border-b"]').filter({ hasText: 'Next Up for Hold' }).first();
  await nextUpSection.screenshot({ 
    path: 'verification-screenshots/FINAL-next-up-complete.png' 
  });
  
  // Individual Next Up cards
  const cards = await page.locator('[aria-label*="Next up for Shift"]').all();
  for (let i = 0; i < cards.length; i++) {
    await cards[i].screenshot({ 
      path: `verification-screenshots/FINAL-card-${i + 1}.png` 
    });
  }
  
  // Header
  await page.screenshot({ 
    path: 'verification-screenshots/FINAL-header.png',
    clip: { x: 0, y: 0, width: 1920, height: 100 }
  });
  
  // Calendar section
  const calendar = page.locator('text=Next Up for Hold').locator('..').locator('..').locator('..').locator('..');
  await calendar.screenshot({ 
    path: 'verification-screenshots/FINAL-calendar-section.png' 
  });
  
  console.log('✅ All screenshots saved with FINAL- prefix');
  
  // Measure actual card dimensions
  console.log('\n=== CARD MEASUREMENTS ===');
  for (let i = 0; i < cards.length; i++) {
    const box = await cards[i].boundingBox();
    const label = await cards[i].getAttribute('aria-label');
    console.log(`Card ${i + 1}: ${box?.height}px tall x ${box?.width}px wide`);
    console.log(`  Label: ${label}`);
  }
  
  await browser.close();
})();
