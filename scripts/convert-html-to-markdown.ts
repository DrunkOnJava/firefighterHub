#!/usr/bin/env tsx
/**
 * Convert HTML documentation to clean Markdown
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';

const HTML_DIR = join(process.env.HOME!, 'Library/Application Support/Development-Documentation/github-copilot');
const OUTPUT_DIR = join(process.cwd(), 'docs', 'github-copilot-markdown');

// Initialize Turndown with GitHub-flavored markdown
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Add custom rules for better conversion
turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: (content) => `~~${content}~~`
});

function extractMainContent(htmlContent: string): string {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // GitHub docs structure - extract the main article content
  const mainContent =
    document.querySelector('article') ||
    document.querySelector('[role="main"]') ||
    document.querySelector('main') ||
    document.querySelector('.markdown-body') ||
    document.body;

  if (!mainContent) {
    throw new Error('Could not find main content');
  }

  // Remove unwanted elements
  const selectorsToRemove = [
    'nav',
    'header',
    'footer',
    '.sidebar',
    '.header',
    '.footer',
    'script',
    'style',
    '.breadcrumbs',
    '[role="navigation"]',
    '.site-header',
    '.site-footer',
  ];

  selectorsToRemove.forEach(selector => {
    mainContent.querySelectorAll(selector).forEach(el => el.remove());
  });

  return mainContent.innerHTML;
}

function convertToMarkdown(htmlFile: string): void {
  console.log(`Converting: ${htmlFile}`);

  const htmlPath = join(HTML_DIR, htmlFile);
  const mdFilename = htmlFile.replace('.html', '.md');
  const mdPath = join(OUTPUT_DIR, mdFilename);

  try {
    const htmlContent = readFileSync(htmlPath, 'utf-8');
    const mainContent = extractMainContent(htmlContent);
    const markdown = turndownService.turndown(mainContent);

    // Clean up the markdown
    const cleanedMarkdown = markdown
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .replace(/\\\[/g, '[') // Unescape brackets
      .replace(/\\\]/g, ']')
      .trim();

    writeFileSync(mdPath, cleanedMarkdown, 'utf-8');
    console.log(`✅ Created: ${mdFilename}`);
  } catch (error) {
    console.error(`❌ Failed: ${htmlFile}`);
    console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function main() {
  console.log(`HTML source: ${HTML_DIR}`);
  console.log(`Markdown output: ${OUTPUT_DIR}\n`);

  // Create output directory
  const fs = await import('fs/promises');
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Get all HTML files (except INDEX.html)
  const htmlFiles = readdirSync(HTML_DIR)
    .filter(f => f.endsWith('.html') && f !== 'INDEX.html')
    .sort();

  console.log(`Found ${htmlFiles.length} HTML files to convert\n`);

  // Convert each file
  htmlFiles.forEach(convertToMarkdown);

  // Create index
  const indexContent = `# GitHub Copilot Agents Documentation

Converted to Markdown on: ${new Date().toLocaleString()}

## Files

${htmlFiles.map((f, i) => {
  const mdFile = f.replace('.html', '.md');
  return `${i + 1}. [${mdFile}](${mdFile})`;
}).join('\n')}

## Total: ${htmlFiles.length} documents
`;

  writeFileSync(join(OUTPUT_DIR, 'README.md'), indexContent, 'utf-8');
  console.log(`\n✅ Created README.md`);
  console.log(`\n📁 All markdown files saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);
