import { test } from '@playwright/test';

test('navigate to October 2025 to see MaterialM event pills', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://firefighter-hub.vercel.app', {
    waitUntil: 'networkidle',
    timeout: 60000
  });
  
  await page.waitForTimeout(3000);
  
  // Navigate to October by clicking "Previous" button until we get there
  // Current is November, need to go back 1 month
  console.log('Navigating to October 2025...');
  
  // Click previous month button
  const prevButton = page.locator('button[aria-label*="Previous"], button:has-text("‹"), button:has-text("←"), .rbc-btn-group button').first();
  await prevButton.click();
  await page.waitForTimeout(1500);
  
  // Take screenshot of October with events
  await page.screenshot({ 
    path: '/tmp/october-2025-materialm-blue-teal-coral-event-pills.png',
    fullPage: true
  });
  
  // Verify what's on screen
  const pageInfo = await page.evaluate(() => {
    const monthLabel = document.querySelector('.rbc-toolbar-label');
    const events = document.querySelectorAll('.rbc-event');
    const eventColors = Array.from(events).slice(0, 5).map(e => {
      const style = window.getComputedStyle(e);
      return {
        text: e.textContent?.trim(),
        bg: style.backgroundColor,
      };
    });
    
    return {
      currentMonth: monthLabel?.textContent,
      totalEvents: events.length,
      sampleEventColors: eventColors,
    };
  });
  
  console.log('\n=== OCTOBER CALENDAR ===');
  console.log(JSON.stringify(pageInfo, null, 2));
  console.log('\n✅ Screenshot: october-2025-materialm-blue-teal-coral-event-pills.png');
  console.log('   Look for:');
  console.log('   - Blue pills (#5d87ff): Scheduled holds');
  console.log('   - Teal pills (#13deb9): Completed holds');
  console.log('   - Coral pills (#fa896b): Skipped holds');
  console.log('   - Standard MaterialM pill styling');
});
