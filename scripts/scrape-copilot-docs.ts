#!/usr/bin/env tsx
/**
 * Scrape GitHub Copilot documentation using Firecrawl API
 * Saves markdown versions of documentation pages
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const FIRECRAWL_API_KEY = 'fc-d8d69ce1efb746df98ec53fc670ed8c6';
const OUTPUT_DIR = join(process.cwd(), 'docs', 'github-copilot');

const URLS = [
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents',
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/manage-agents',
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent',
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-a-pr',
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/make-changes-to-an-existing-pr',
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/track-copilot-sessions',
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/review-copilot-prs',
  'https://docs.github.com/en/copilot/how-tos/agents/copilot-coding-agent/extending-copilot-coding-agent-with-mcp',
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/integrate-coding-agent-with-slack',
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/integrate-coding-agent-with-teams',
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/integrate-coding-agent-with-linear',
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment',
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-firewall',
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/troubleshoot-coding-agent',
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents',
];

interface FirecrawlResponse {
  success: boolean;
  data?: {
    markdown?: string;
    metadata?: {
      title?: string;
      description?: string;
      url?: string;
    };
  };
  error?: string;
}

async function scrapeUrl(url: string): Promise<{ markdown: string; title: string }> {
  console.log(`Scraping: ${url}`);

  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      url,
      formats: ['markdown'],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data: FirecrawlResponse = await response.json();

  if (!data.success || !data.data?.markdown) {
    throw new Error(data.error || 'Failed to scrape URL');
  }

  return {
    markdown: data.data.markdown,
    title: data.data.metadata?.title || 'Untitled',
  };
}

function getFilename(url: string): string {
  const path = new URL(url).pathname;
  const parts = path.split('/').filter(Boolean);
  const name = parts[parts.length - 1] || 'index';
  return `${name}.md`;
}

async function main() {
  console.log(`Creating output directory: ${OUTPUT_DIR}`);
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`\nScraping ${URLS.length} URLs...\n`);

  const results = [];

  for (const url of URLS) {
    try {
      const { markdown, title } = await scrapeUrl(url);
      const filename = getFilename(url);
      const filepath = join(OUTPUT_DIR, filename);

      // Add metadata header
      const content = `---
source: ${url}
title: ${title}
scraped: ${new Date().toISOString()}
---

${markdown}`;

      writeFileSync(filepath, content, 'utf-8');
      console.log(`✅ Saved: ${filename}`);
      results.push({ url, filename, status: 'success' });

      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed: ${url}`);
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
      results.push({ url, filename: null, status: 'failed', error: String(error) });
    }
  }

  // Create index file
  const indexContent = `# GitHub Copilot Agents Documentation

Scraped on: ${new Date().toLocaleString()}

## Files

${results.map((r, i) =>
  r.status === 'success'
    ? `${i + 1}. [${r.filename}](${r.filename}) - [Source](${r.url})`
    : `${i + 1}. ❌ Failed: ${r.url}`
).join('\n')}

## Summary

- Total URLs: ${URLS.length}
- Successful: ${results.filter(r => r.status === 'success').length}
- Failed: ${results.filter(r => r.status === 'failed').length}
`;

  writeFileSync(join(OUTPUT_DIR, 'INDEX.md'), indexContent, 'utf-8');
  console.log(`\n✅ Created INDEX.md`);

  console.log(`\n📁 All files saved to: ${OUTPUT_DIR}`);
  console.log(`\nResults:`);
  console.log(`  ✅ Successful: ${results.filter(r => r.status === 'success').length}`);
  console.log(`  ❌ Failed: ${results.filter(r => r.status === 'failed').length}`);
}

main().catch(console.error);
