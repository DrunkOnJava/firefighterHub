#!/usr/bin/env tsx

/**
 * Visual Hierarchy Measurement Extraction Script
 * 
 * Systematically extracts font sizes, spacing, colors, and other measurements
 * from the codebase to support the visual hierarchy audit.
 * 
 * Usage: pnpm dlx tsx scripts/extract-visual-measurements.ts
 */

import fs from 'fs';
import path from 'path';

interface Measurement {
  component: string;
  element: string;
  property: string;
  value: string;
  location: string; // file:line
  priority: 'primary' | 'secondary' | 'tertiary';
}

interface ComponentAnalysis {
  name: string;
  file: string;
  measurements: Measurement[];
  issues: string[];
}

const measurements: Measurement[] = [];
const componentAnalyses: ComponentAnalysis[] = [];

// Regex patterns for extracting measurements
const patterns = {
  fontSize: /(?:text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl)|font-size:\s*([0-9]+(?:px|rem|em)))/g,
  padding: /(?:p(?:x|y|t|b|l|r)?-\d+|padding:\s*([0-9]+(?:px|rem|em)))/g,
  margin: /(?:m(?:x|y|t|b|l|r)?-\d+|margin:\s*([0-9]+(?:px|rem|em)))/g,
  gap: /(?:gap-\d+|gap:\s*([0-9]+(?:px|rem|em)))/g,
  height: /(?:h-\d+|min-h-\[?(\d+(?:px|rem|em))\]?|height:\s*([0-9]+(?:px|rem|em)))/g,
  width: /(?:w-\d+|min-w-\[?(\d+(?:px|rem|em))\]?|width:\s*([0-9]+(?:px|rem|em)))/g,
  borderRadius: /(?:rounded-(?:none|sm|md|lg|xl|2xl|3xl|full)|border-radius:\s*([0-9]+(?:px|rem|em)))/g,
  shadow: /(?:shadow-(?:none|sm|md|lg|xl|2xl|inner))/g,
  color: /(?:text|bg|border)-(?:gray|slate|red|blue|green|yellow|emerald|amber)-(?:\d+)/g,
};

/**
 * Extract measurements from a TypeScript/TSX file
 */
function extractFromFile(filePath: string): ComponentAnalysis {
  const content = fs.readFileSync(filePath, 'utf-8');
  const componentName = path.basename(filePath, path.extname(filePath));
  const lines = content.split('\n');
  
  const analysis: ComponentAnalysis = {
    name: componentName,
    file: filePath,
    measurements: [],
    issues: [],
  };

  // Extract className strings
  const classNameRegex = /className=["'`{]([^"'`}]+)["'`}]/g;
  let match;

  while ((match = classNameRegex.exec(content)) !== null) {
    const className = match[1];
    const lineNumber = content.substring(0, match.index).split('\n').length;
    
    // Extract font sizes
    const fontSizes = className.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl)/g);
    if (fontSizes) {
      fontSizes.forEach(size => {
        analysis.measurements.push({
          component: componentName,
          element: 'text',
          property: 'fontSize',
          value: size,
          location: `${filePath}:${lineNumber}`,
          priority: size.includes('xl') ? 'primary' : size === 'text-base' ? 'secondary' : 'tertiary',
        });
      });
    }

    // Extract spacing
    const spacing = className.match(/(?:p|m)(?:x|y|t|b|l|r)?-\d+/g);
    if (spacing) {
      spacing.forEach(space => {
        const property = space.startsWith('p') ? 'padding' : 'margin';
        analysis.measurements.push({
          component: componentName,
          element: 'spacing',
          property,
          value: space,
          location: `${filePath}:${lineNumber}`,
          priority: 'secondary',
        });
      });
    }

    // Extract heights (important for touch targets)
    const heights = className.match(/(?:h|min-h)-(?:\d+|\[[\d]+px\])/g);
    if (heights) {
      heights.forEach(height => {
        // Parse height value for WCAG compliance check
        const numericValue = parseHeightValue(height);
        const isWCAGCompliant = numericValue >= 44;
        
        analysis.measurements.push({
          component: componentName,
          element: 'touchTarget',
          property: 'height',
          value: height,
          location: `${filePath}:${lineNumber}`,
          priority: isWCAGCompliant ? 'secondary' : 'primary',
        });

        if (!isWCAGCompliant && numericValue > 0) {
          analysis.issues.push(`⚠️ Touch target below WCAG 44px: ${height} at ${filePath}:${lineNumber}`);
        }
      });
    }

    // Extract colors
    const colors = className.match(/(?:text|bg|border)-(?:gray|slate|red|blue|green|yellow|emerald|amber)-\d+/g);
    if (colors) {
      colors.forEach(color => {
        analysis.measurements.push({
          component: componentName,
          element: 'color',
          property: color.split('-')[0], // text, bg, or border
          value: color,
          location: `${filePath}:${lineNumber}`,
          priority: 'tertiary',
        });
      });
    }
  }

  // Check for hardcoded values (anti-pattern)
  const hardcodedColorRegex = /#[0-9A-Fa-f]{6}/g;
  const hardcodedColors = content.match(hardcodedColorRegex);
  if (hardcodedColors && hardcodedColors.length > 0) {
    analysis.issues.push(`⚠️ Hardcoded colors found (${hardcodedColors.length} instances) - should use design tokens`);
  }

  // Check for magic numbers in inline styles
  const inlineStyleRegex = /style=\{\{[^}]+\}\}/g;
  const inlineStyles = content.match(inlineStyleRegex);
  if (inlineStyles && inlineStyles.length > 0) {
    analysis.issues.push(`⚠️ Inline styles found (${inlineStyles.length} instances) - consider using Tailwind classes`);
  }

  return analysis;
}

/**
 * Parse height value from Tailwind class
 */
function parseHeightValue(heightClass: string): number {
  // h-10 = 40px (10 * 4)
  const tailwindMatch = heightClass.match(/h-(\d+)/);
  if (tailwindMatch) {
    return parseInt(tailwindMatch[1], 10) * 4;
  }

  // min-h-[44px]
  const customMatch = heightClass.match(/\[(\d+)px\]/);
  if (customMatch) {
    return parseInt(customMatch[1], 10);
  }

  return 0;
}

/**
 * Scan directory for components
 */
function scanDirectory(dir: string): string[] {
  const files: string[] = [];
  
  function scan(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        scan(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) && !entry.name.endsWith('.test.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

/**
 * Generate CSV report
 */
function generateCSVReport(analyses: ComponentAnalysis[]): string {
  let csv = 'Component,Element,Property,Value,Location,Priority,Issue\n';
  
  for (const analysis of analyses) {
    for (const measurement of analysis.measurements) {
      csv += `"${measurement.component}","${measurement.element}","${measurement.property}","${measurement.value}","${measurement.location}","${measurement.priority}",""\n`;
    }
    
    for (const issue of analysis.issues) {
      csv += `"${analysis.name}","","","","","",${issue}"\n`;
    }
  }
  
  return csv;
}

/**
 * Generate summary report
 */
function generateSummaryReport(analyses: ComponentAnalysis[]): string {
  let report = '# Visual Hierarchy Measurement Summary\n\n';
  report += `**Generated:** ${new Date().toISOString()}\n`;
  report += `**Components Analyzed:** ${analyses.length}\n\n`;
  
  // Count measurements by type
  const measurementCounts: Record<string, number> = {};
  const issueCounts: Record<string, string[]> = {};
  
  for (const analysis of analyses) {
    for (const measurement of analysis.measurements) {
      const key = `${measurement.property}`;
      measurementCounts[key] = (measurementCounts[key] || 0) + 1;
    }
    
    if (analysis.issues.length > 0) {
      issueCounts[analysis.name] = analysis.issues;
    }
  }
  
  report += '## Measurement Breakdown\n\n';
  report += '| Property | Count |\n';
  report += '|----------|-------|\n';
  for (const [property, count] of Object.entries(measurementCounts).sort((a, b) => b[1] - a[1])) {
    report += `| ${property} | ${count} |\n`;
  }
  
  report += '\n## Issues Found\n\n';
  const totalIssues = Object.values(issueCounts).reduce((sum, issues) => sum + issues.length, 0);
  report += `**Total Issues:** ${totalIssues}\n\n`;
  
  for (const [component, issues] of Object.entries(issueCounts)) {
    report += `### ${component}\n\n`;
    for (const issue of issues) {
      report += `- ${issue}\n`;
    }
    report += '\n';
  }
  
  // Font size analysis
  report += '## Font Size Usage\n\n';
  const fontSizes: Record<string, number> = {};
  for (const analysis of analyses) {
    for (const measurement of analysis.measurements) {
      if (measurement.property === 'fontSize') {
        fontSizes[measurement.value] = (fontSizes[measurement.value] || 0) + 1;
      }
    }
  }
  
  report += '| Size | Occurrences | Recommended Use |\n';
  report += '|------|-------------|------------------|\n';
  for (const [size, count] of Object.entries(fontSizes).sort((a, b) => b[1] - a[1])) {
    const recommendation = getFontSizeRecommendation(size);
    report += `| ${size} | ${count} | ${recommendation} |\n`;
  }
  
  return report;
}

/**
 * Get font size usage recommendation
 */
function getFontSizeRecommendation(size: string): string {
  const recommendations: Record<string, string> = {
    'text-4xl': 'H1 headings (36px)',
    'text-3xl': 'H1 headings (30px)',
    'text-2xl': 'H1/H2 headings (24px)',
    'text-xl': 'H2/H3 headings (20px)',
    'text-lg': 'H4 headings, large body (18px)',
    'text-base': 'Body text (16px)',
    'text-sm': 'Secondary text (14px)',
    'text-xs': 'Captions, labels (12px)',
  };
  
  return recommendations[size] || 'Unknown';
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Starting visual hierarchy measurement extraction...\n');
  
  const srcDir = path.join(process.cwd(), 'src', 'components');
  console.log(`📂 Scanning directory: ${srcDir}\n`);
  
  const files = scanDirectory(srcDir);
  console.log(`📄 Found ${files.length} component files\n`);
  
  // Analyze each file
  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`   Analyzing: ${relativePath}`);
    
    const analysis = extractFromFile(file);
    if (analysis.measurements.length > 0 || analysis.issues.length > 0) {
      componentAnalyses.push(analysis);
    }
  }
  
  console.log(`\n✅ Analysis complete\n`);
  console.log(`📊 Components with measurements: ${componentAnalyses.length}`);
  console.log(`📏 Total measurements: ${componentAnalyses.reduce((sum, a) => sum + a.measurements.length, 0)}`);
  console.log(`⚠️  Total issues: ${componentAnalyses.reduce((sum, a) => sum + a.issues.length, 0)}\n`);
  
  // Generate reports
  const outputDir = path.join(process.cwd(), 'docs', 'visual-hierarchy-audit', 'measurements');
  fs.mkdirSync(outputDir, { recursive: true });
  
  const csvPath = path.join(outputDir, 'measurements.csv');
  const csvReport = generateCSVReport(componentAnalyses);
  fs.writeFileSync(csvPath, csvReport);
  console.log(`📝 CSV report saved: ${csvPath}`);
  
  const summaryPath = path.join(outputDir, 'summary.md');
  const summaryReport = generateSummaryReport(componentAnalyses);
  fs.writeFileSync(summaryPath, summaryReport);
  console.log(`📝 Summary report saved: ${summaryPath}`);
  
  console.log('\n✨ Measurement extraction complete!\n');
}

main().catch(console.error);
