const fs = require('fs');
const path = require('path');

const BASELINE_DIR = path.join(__dirname, 'screenshots', 'baseline');
const CURRENT_DIR = path.join(__dirname, 'screenshots', 'current');

function compareScreenshots() {
  console.log('📸 Screenshot Comparison Report\n');
  console.log('=' .repeat(60));
  
  if (!fs.existsSync(BASELINE_DIR)) {
    console.log('❌ No baseline directory found. Run tests first.');
    return;
  }

  if (!fs.existsSync(CURRENT_DIR)) {
    console.log('❌ No current screenshots found. Run tests first.');
    return;
  }

  const baselineFiles = fs.readdirSync(BASELINE_DIR).filter(f => f.endsWith('.png'));
  const currentFiles = fs.readdirSync(CURRENT_DIR).filter(f => f.endsWith('.png'));

  console.log(`\n📁 Baseline screenshots: ${baselineFiles.length}`);
  console.log(`📁 Current screenshots: ${currentFiles.length}\n`);

  // New screenshots
  const newFiles = currentFiles.filter(f => !baselineFiles.includes(f));
  if (newFiles.length > 0) {
    console.log('🆕 New Screenshots:');
    newFiles.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }

  // Missing screenshots
  const missingFiles = baselineFiles.filter(f => !currentFiles.includes(f));
  if (missingFiles.length > 0) {
    console.log('⚠️  Missing Screenshots (not captured in current run):');
    missingFiles.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }

  // Common screenshots
  const commonFiles = currentFiles.filter(f => baselineFiles.includes(f));
  console.log(`✅ Common screenshots to compare: ${commonFiles.length}`);
  
  // Size comparison
  console.log('\n📊 File Size Changes:\n');
  commonFiles.forEach(file => {
    const baselineSize = fs.statSync(path.join(BASELINE_DIR, file)).size;
    const currentSize = fs.statSync(path.join(CURRENT_DIR, file)).size;
    const diff = currentSize - baselineSize;
    const diffPercent = ((diff / baselineSize) * 100).toFixed(2);
    
    if (Math.abs(diff) > 1000) { // Only show if diff > 1KB
      const symbol = diff > 0 ? '📈' : '📉';
      console.log(`${symbol} ${file}`);
      console.log(`   Baseline: ${(baselineSize / 1024).toFixed(2)} KB`);
      console.log(`   Current:  ${(currentSize / 1024).toFixed(2)} KB`);
      console.log(`   Change:   ${diffPercent}%\n`);
    }
  });

  console.log('=' .repeat(60));
  console.log('\n💡 Next Steps:');
  console.log('   1. Review screenshots in screenshots/current/');
  console.log('   2. If changes are correct, run: npm run test:update-baseline');
  console.log('   3. Commit baseline screenshots to git\n');
}

compareScreenshots();
