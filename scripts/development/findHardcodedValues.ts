#!/usr/bin/env tsx
/**
 * Find Hardcoded Values Script
 * 
 * Scans the codebase for hardcoded color and spacing values that should use design tokens.
 * Generates a report of files that need migration.
 * 
 * Usage:
 *   pnpm dlx tsx scripts/findHardcodedValues.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface HardcodedValue {
  file: string;
  line: number;
  value: string;
  type: 'hex-color' | 'tailwind-color' | 'magic-number' | 'spacing';
  context: string;
}

const results: HardcodedValue[] = [];

// Patterns to detect
const patterns = {
  hexColor: /#[0-9a-fA-F]{6}/g,
  tailwindGray: /(?:text|bg|border)-gray-[0-9]{3}/g,
  tailwindSlate: /(?:text|bg|border)-slate-[0-9]{3}/g,
  magicPadding: /p-[0-9]+(?:\.[0-9]+)?/g,
  magicGap: /gap-[0-9]+(?:\.[0-9]+)?(?!\])/g, // Exclude gap-[32px] format
  magicMargin: /m[tbrl]?-[0-9]+(?:\.[0-9]+)?/g,
};

// Exclusions
const excludePatterns = [
  'node_modules',
  'dist',
  'build',
  '.git',
  'test-results',
  'playwright-report',
  '.test.ts',
  '.test.tsx',
  'mockData.ts',
  'theme.ts', // Theme file is allowed to have colors
  'colorTokens.ts', // Token files are allowed
  'spacingTokens.ts',
  'tokens.ts',
  'tailwind.config.js',
];

function shouldExclude(filePath: string): boolean {
  return excludePatterns.some(pattern => filePath.includes(pattern));
}

function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check for hex colors
    const hexMatches = line.match(patterns.hexColor);
    if (hexMatches) {
      hexMatches.forEach(match => {
        // Skip if it's in a comment or already using theme tokens
        if (line.includes('//') || line.includes('theme.') || line.includes('WCAG')) return;
        
        results.push({
          file: filePath,
          line: index + 1,
          value: match,
          type: 'hex-color',
          context: line.trim(),
        });
      });
    }

    // Check for direct Tailwind gray colors (should use theme)
    const grayMatches = line.match(patterns.tailwindGray);
    if (grayMatches) {
      grayMatches.forEach(match => {
        // Skip if already using tokens or in theme file
        if (line.includes('theme.') || line.includes('colorTokens.')) return;
        
        results.push({
          file: filePath,
          line: index + 1,
          value: match,
          type: 'tailwind-color',
          context: line.trim(),
        });
      });
    }

    // Check for magic number padding
    const paddingMatches = line.match(patterns.magicPadding);
    if (paddingMatches) {
      paddingMatches.forEach(match => {
        // Skip known token values (p-2, p-3, p-4, p-5, p-6, p-8)
        const knownTokens = ['p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8'];
        if (knownTokens.includes(match)) return;
        if (line.includes('tokens.') || line.includes('spacingTokens.')) return;
        
        results.push({
          file: filePath,
          line: index + 1,
          value: match,
          type: 'spacing',
          context: line.trim(),
        });
      });
    }

    // Check for magic number gaps
    const gapMatches = line.match(patterns.magicGap);
    if (gapMatches) {
      gapMatches.forEach(match => {
        // Skip known token values (gap-1, gap-2, gap-3, gap-4, gap-6, gap-8, gap-12)
        const knownTokens = ['gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-6', 'gap-8', 'gap-12'];
        if (knownTokens.includes(match)) return;
        if (line.includes('tokens.') || line.includes('spacingTokens.')) return;
        
        results.push({
          file: filePath,
          line: index + 1,
          value: match,
          type: 'spacing',
          context: line.trim(),
        });
      });
    }
  });
}

function scanDirectory(dirPath: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (shouldExclude(fullPath)) continue;

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      scanFile(fullPath);
    }
  }
}

// Main execution
console.log('🔍 Scanning codebase for hardcoded values...\n');

const srcDir = path.join(process.cwd(), 'src');
scanDirectory(srcDir);

// Group results by file
const byFile = results.reduce((acc, result) => {
  if (!acc[result.file]) {
    acc[result.file] = [];
  }
  acc[result.file].push(result);
  return acc;
}, {} as Record<string, HardcodedValue[]>);

// Generate report
console.log('📊 Hardcoded Values Report\n');
console.log('=' .repeat(80));

const sortedFiles = Object.keys(byFile).sort((a, b) => byFile[b].length - byFile[a].length);

let totalCount = 0;
const summary = {
  'hex-color': 0,
  'tailwind-color': 0,
  'spacing': 0,
  'magic-number': 0,
};

sortedFiles.forEach((file, index) => {
  const values = byFile[file];
  const relPath = file.replace(process.cwd() + '/', '');
  
  console.log(`\n${index + 1}. ${relPath} (${values.length} issues)`);
  console.log('-'.repeat(80));
  
  values.forEach(v => {
    console.log(`  Line ${v.line}: ${v.type.padEnd(15)} ${v.value}`);
    summary[v.type]++;
    totalCount++;
  });
});

console.log('\n' + '='.repeat(80));
console.log('\n📈 Summary\n');
console.log(`Total hardcoded values found: ${totalCount}`);
console.log(`  - Hex colors:          ${summary['hex-color']}`);
console.log(`  - Tailwind colors:     ${summary['tailwind-color']}`);
console.log(`  - Spacing values:      ${summary['spacing']}`);
console.log(`  - Magic numbers:       ${summary['magic-number']}`);
console.log(`\nFiles affected: ${sortedFiles.length}`);

console.log('\n💡 Recommended Actions:\n');
console.log('1. Replace hex colors with colorTokens from src/styles/colorTokens.ts');
console.log('2. Replace Tailwind gray/slate colors with theme.text.* values');
console.log('3. Replace magic number spacing with spacingTokens from src/styles/spacingTokens.ts');
console.log('4. Use tokens.spacing.*, tokens.gap.*, etc. from src/styles/tokens.ts');

console.log('\n📚 Documentation:\n');
console.log('  - Design Tokens: src/styles/README.md');
console.log('  - Color Tokens: src/styles/colorTokens.ts');
console.log('  - Spacing Tokens: src/styles/spacingTokens.ts');
console.log('  - Theme System: src/utils/theme.ts');

// Save report to file
const reportPath = path.join(process.cwd(), 'docs/visual-hierarchy-audit/phase4-implementation/hardcoded-values-report.txt');
const reportContent = [
  'Hardcoded Values Report',
  `Generated: ${new Date().toISOString()}`,
  '',
  `Total: ${totalCount} hardcoded values in ${sortedFiles.length} files`,
  '',
  'Summary:',
  `  Hex colors:       ${summary['hex-color']}`,
  `  Tailwind colors:  ${summary['tailwind-color']}`,
  `  Spacing values:   ${summary['spacing']}`,
  `  Magic numbers:    ${summary['magic-number']}`,
  '',
  '='.repeat(80),
  '',
  ...sortedFiles.flatMap(file => {
    const relPath = file.replace(process.cwd() + '/', '');
    const values = byFile[file];
    return [
      `${relPath} (${values.length} issues)`,
      ...values.map(v => `  Line ${v.line}: ${v.type.padEnd(15)} ${v.value} - ${v.context.substring(0, 60)}...`),
      '',
    ];
  }),
].join('\n');

fs.writeFileSync(reportPath, reportContent);
console.log(`\n✅ Full report saved to: ${reportPath}`);
