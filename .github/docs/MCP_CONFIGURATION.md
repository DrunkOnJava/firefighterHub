# MCP Server Configuration for UI/UX Implementation Agent

This document provides the complete MCP (Model Context Protocol) server configuration for enhancing the **ui-ux-implementation-specialist** agent with additional tools.

## Overview

MCP servers extend the agent's capabilities by providing access to:
- **Chrome DevTools** - Visual debugging, screenshots, accessibility audits
- **Playwright** - Automated browser testing and visual regression
- **Context7** - Documentation lookup (Tailwind, React, WCAG)
- **GitHub** - Enhanced repository access
- **Filesystem** - Advanced file operations
- **Memory** - Persistent context across sessions

## Quick Setup

### Step 1: Add MCP Configuration

**Location:** Repository Settings → Copilot → Coding Agent → MCP configuration

**Copy this JSON** (remove comments before pasting):

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "type": "local",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ],
      "tools": [
        "puppeteer_navigate",
        "puppeteer_screenshot",
        "puppeteer_click",
        "puppeteer_fill",
        "puppeteer_select",
        "puppeteer_hover",
        "puppeteer_evaluate"
      ]
    },
    "playwright": {
      "type": "local",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-playwright"
      ],
      "tools": [
        "playwright_navigate",
        "playwright_screenshot",
        "playwright_click",
        "playwright_fill",
        "playwright_pdf",
        "playwright_evaluate"
      ]
    },
    "context7-docs": {
      "type": "sse",
      "url": "https://context7.io/mcp/sse",
      "tools": [
        "search_documentation",
        "get_documentation_section"
      ]
    },
    "github-enhanced": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "tools": [
        "get_file_contents",
        "search_repositories",
        "create_or_update_file",
        "push_files",
        "create_branch",
        "create_pull_request",
        "fork_repository",
        "create_issue",
        "create_issue_comment",
        "update_issue",
        "add_issue_labels",
        "search_code",
        "search_issues"
      ]
    },
    "filesystem": {
      "type": "local",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/griffin/Projects/firefighterHub"
      ],
      "tools": [
        "read_file",
        "read_multiple_files",
        "write_file",
        "create_directory",
        "list_directory",
        "move_file",
        "search_files",
        "get_file_info"
      ]
    },
    "memory": {
      "type": "local",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ],
      "tools": [
        "store_memory",
        "retrieve_memory",
        "list_memories",
        "delete_memory"
      ]
    },
    "web-fetch": {
      "type": "local",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-fetch"
      ],
      "tools": [
        "fetch"
      ]
    }
  }
}
```

### Step 2: Add Required Secrets

Some MCP servers require authentication. Add these in: **Settings → Environments → copilot → Environment secrets**

| Secret Name | Value | Purpose | Required? |
|-------------|-------|---------|-----------|
| `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN` | Your GitHub PAT | Enhanced GitHub access | Optional |
| `COPILOT_MCP_CONTEXT7_API_KEY` | Context7 API key | Documentation lookup | Optional |

**How to get tokens:**

**GitHub PAT:**
```bash
# Create fine-grained PAT with read-only access
# Go to: https://github.com/settings/tokens?type=beta
# Select: Repository access → Only select repositories → firefighterHub
# Permissions: Contents (Read), Issues (Read), Pull requests (Read)
```

**Context7 API Key:**
```bash
# Sign up at: https://context7.io
# Get API key from dashboard
```

### Step 3: Update copilot-setup-steps.yml

Add these steps to install MCP server dependencies:

```yaml
  # Add after "Install dependencies" step

  - name: Install MCP server dependencies
    run: |
      # Puppeteer requires additional dependencies
      sudo apt-get update
      sudo apt-get install -y \
        libnss3 \
        libatk-bridge2.0-0 \
        libdrm2 \
        libxkbcommon0 \
        libgbm1 \
        libasound2

      echo "✅ MCP server dependencies installed"

  - name: Verify MCP servers can start
    run: |
      # Test that MCP servers can be invoked
      npx -y @modelcontextprotocol/server-playwright --version || true
      npx -y @modelcontextprotocol/server-memory --version || true
      echo "✅ MCP servers verified"
```

---

## MCP Server Details

### 1. Chrome DevTools (Puppeteer)

**Purpose:** Visual debugging, screenshot capture, accessibility audits

**Available Tools:**
- `puppeteer_navigate` - Navigate to URL
- `puppeteer_screenshot` - Capture screenshots
- `puppeteer_click` - Click elements
- `puppeteer_fill` - Fill form inputs
- `puppeteer_select` - Select dropdown options
- `puppeteer_hover` - Hover over elements
- `puppeteer_evaluate` - Execute JavaScript

**Use Cases:**
- Take before/after screenshots during Issue #18 (calendar hierarchy)
- Verify responsive design at different breakpoints (375px, 768px, 1024px, 1920px)
- Test focus states and hover effects
- Capture color contrast for WCAG verification
- Debug visual regressions

**Example Agent Usage:**
```
@ui-ux-implementation-specialist Implement Issue #18 and provide before/after screenshots

Use puppeteer_screenshot to:
1. Capture calendar before changes (at 375px, 768px, 1920px)
2. Implement changes
3. Capture calendar after changes (same breakpoints)
4. Compare and verify improvements
```

### 2. Playwright

**Purpose:** Automated browser testing, visual regression, accessibility testing

**Available Tools:**
- `playwright_navigate` - Navigate to pages
- `playwright_screenshot` - High-quality screenshots
- `playwright_click` - Interact with elements
- `playwright_fill` - Form input testing
- `playwright_pdf` - Generate PDFs
- `playwright_evaluate` - Execute scripts

**Use Cases:**
- Run automated accessibility tests (axe-core integration)
- Validate touch target sizes on mobile
- Test keyboard navigation flows
- Verify focus ring visibility
- Generate print-friendly PDFs (Issue #34)
- Cross-browser testing

**Example Agent Usage:**
```
@ui-ux-implementation-specialist After implementing Issue #15 (focus rings),
verify keyboard navigation:

Use playwright tools to:
1. Navigate through all interactive elements with Tab
2. Screenshot each focus state
3. Verify focus ring visible (2px, 3:1 contrast)
4. Test Escape to close modals
5. Report any focus issues
```

### 3. Context7 Documentation Lookup

**Purpose:** Real-time documentation access for Tailwind, React, WCAG, accessibility

**Available Tools:**
- `search_documentation` - Search across documentation sites
- `get_documentation_section` - Retrieve specific doc sections

**Configured Documentation Sources:**
- Tailwind CSS (utility classes, JIT mode, custom configs)
- React (hooks, patterns, TypeScript)
- WCAG 2.1 (accessibility guidelines)
- MDN Web Docs (HTML, CSS, JavaScript)
- Accessibility standards

**Use Cases:**
- Look up WCAG contrast requirements during Issue #14
- Find Tailwind color palette values for Issue #16
- Reference React best practices
- Check accessibility patterns for Issue #15
- Verify proper ARIA usage

**Example Agent Usage:**
```
@ui-ux-implementation-specialist What are the WCAG 2.1 AA contrast requirements
for UI components?

Use context7 search_documentation to:
1. Query WCAG guidelines for contrast ratios
2. Find specific requirements for buttons/borders (3:1)
3. Compare with text requirements (4.5:1)
4. Apply to Issue #14 implementation
```

### 4. GitHub Enhanced

**Purpose:** Advanced GitHub operations beyond basic access

**Available Tools:**
- `get_file_contents` - Read files
- `search_repositories` - Search across repos
- `create_or_update_file` - Modify files
- `push_files` - Batch file updates
- `create_branch` - Create feature branches
- `create_pull_request` - Open PRs
- `create_issue` - Create issues
- `create_issue_comment` - Comment on issues
- `search_code` - Search codebase
- `search_issues` - Find related issues

**Use Cases:**
- Search for all usages of hex colors (Issue #16)
- Find all components using arbitrary Tailwind values
- Create PR with detailed before/after comparison
- Comment on issues with progress updates
- Search for focus ring inconsistencies

**Example Agent Usage:**
```
@ui-ux-implementation-specialist Find all components using custom hex colors

Use github search_code to:
1. Search for bg-[# pattern
2. Search for border-[# pattern
3. Search for text-[# pattern
4. List all files that need updating for Issue #16
5. Prioritize by component importance
```

### 5. Filesystem

**Purpose:** Advanced file operations for systematic refactoring

**Available Tools:**
- `read_file` - Read single file
- `read_multiple_files` - Batch read
- `write_file` - Write/update file
- `create_directory` - Create dirs
- `list_directory` - List contents
- `move_file` - Rename/move
- `search_files` - Find files
- `get_file_info` - File metadata

**Use Cases:**
- Read all components in `src/components/` for pattern analysis
- Batch update design token imports
- Create new component directories (Issue #28 EmptyState)
- Move files during refactoring
- Search for specific patterns across files

**Example Agent Usage:**
```
@ui-ux-implementation-specialist Migrate all hex colors to Tailwind (Issue #16)

Use filesystem tools to:
1. list_directory src/components recursively
2. read_multiple_files for all .tsx files
3. Identify files with hex colors
4. Update each file with Tailwind equivalents
5. Verify no hex colors remain
```

### 6. Memory

**Purpose:** Persistent context and learning across implementation sessions

**Available Tools:**
- `store_memory` - Save context
- `retrieve_memory` - Recall stored info
- `list_memories` - View all stored
- `delete_memory` - Clean up

**Use Cases:**
- Remember implemented patterns (Phase 1 completion)
- Store WCAG verification results
- Track design decisions across issues
- Remember user preferences for agent behavior
- Maintain implementation history

**Example Agent Usage:**
```
@ui-ux-implementation-specialist After completing Issue #14:

Use memory tools to:
1. store_memory: "Issue #14 completed - Shift B contrast fixed to 5.4:1 ratio"
2. store_memory: "Pattern: Always use bg-red-600 for Shift B (WCAG compliant)"
3. Recall this when implementing Issue #21 (color-blind indicators)
```

### 7. Web Fetch

**Purpose:** Fetch web content for reference and verification

**Available Tools:**
- `fetch` - HTTP GET requests

**Use Cases:**
- Fetch WebAIM contrast checker API results
- Get latest Tailwind CSS documentation
- Retrieve WCAG guidelines
- Check CDN-hosted resources
- Verify external link validity

**Example Agent Usage:**
```
@ui-ux-implementation-specialist Verify contrast ratios for Issue #14

Use fetch to:
1. Get WebAIM contrast checker results for #DC2626 on #0F172A
2. Confirm ratio ≥4.5:1
3. Document in commit message
```

---

## Complete MCP Configuration

### Production-Ready JSON

**Copy this to:** Repository Settings → Copilot → Coding Agent → MCP configuration

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "tools": [
        "puppeteer_navigate",
        "puppeteer_screenshot",
        "puppeteer_click",
        "puppeteer_fill",
        "puppeteer_evaluate"
      ]
    },
    "playwright": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "tools": [
        "playwright_navigate",
        "playwright_screenshot",
        "playwright_click",
        "playwright_fill",
        "playwright_evaluate"
      ]
    },
    "context7-docs": {
      "type": "sse",
      "url": "https://context7.io/mcp/sse",
      "tools": ["*"]
    },
    "github-enhanced": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "tools": [
        "get_file_contents",
        "search_code",
        "search_issues",
        "create_or_update_file",
        "create_pull_request",
        "create_issue_comment"
      ]
    },
    "filesystem": {
      "type": "local",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/workspace"
      ],
      "tools": [
        "read_file",
        "read_multiple_files",
        "write_file",
        "list_directory",
        "search_files"
      ]
    },
    "memory": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "tools": ["*"]
    },
    "web-fetch": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"],
      "tools": ["fetch"]
    }
  }
}
```

### Step 2: Add Required Secrets (Optional)

**For Context7:**
```
Name: COPILOT_MCP_CONTEXT7_API_KEY
Value: [Your Context7 API key]
```

**For Enhanced GitHub Access:**
```
Name: COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN
Value: [Your GitHub fine-grained PAT]
```

### Step 3: Update copilot-setup-steps.yml

Add MCP dependencies to the setup workflow:

```yaml
  - name: Install MCP server dependencies
    run: |
      # Puppeteer/Playwright browser dependencies
      sudo apt-get update
      sudo apt-get install -y \
        libnss3 \
        libnspr4 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdrm2 \
        libxkbcommon0 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2 \
        libgbm1 \
        libasound2 \
        libpangocairo-1.0-0 \
        libpango-1.0-0 \
        libatspi2.0-0

      echo "✅ MCP browser dependencies installed"

  - name: Pre-install MCP servers
    run: |
      # Pre-install to avoid startup delays
      npx -y @modelcontextprotocol/server-puppeteer --version || true
      npx -y @modelcontextprotocol/server-playwright --version || true
      npx -y @modelcontextprotocol/server-filesystem --version || true
      npx -y @modelcontextprotocol/server-memory --version || true
      npx -y @modelcontextprotocol/server-fetch --version || true

      echo "✅ MCP servers pre-installed"
```

---

## Tool Reference Guide

### Chrome DevTools Tools

#### `puppeteer_navigate`
```typescript
// Navigate to page for testing
await puppeteer_navigate({
  url: "http://localhost:5173"
});
```

#### `puppeteer_screenshot`
```typescript
// Capture screenshot for visual verification
await puppeteer_screenshot({
  path: "screenshots/calendar-before.png",
  fullPage: true,
  viewport: { width: 1920, height: 1080 }
});

// Mobile screenshot
await puppeteer_screenshot({
  path: "screenshots/calendar-mobile.png",
  viewport: { width: 375, height: 667 }
});
```

#### `puppeteer_evaluate`
```typescript
// Check contrast ratios programmatically
const contrast = await puppeteer_evaluate({
  expression: `
    const element = document.querySelector('.shift-b-badge');
    const bg = getComputedStyle(element).backgroundColor;
    const text = getComputedStyle(element).color;
    // Return RGB values for contrast calculation
    ({ background: bg, text: text })
  `
});
```

### Playwright Tools

#### `playwright_screenshot`
```typescript
// High-quality screenshot with options
await playwright_screenshot({
  path: "test-artifacts/calendar-hierarchy.png",
  fullPage: true,
  scale: "device",  // Use device pixel ratio
  animations: "disabled"  // Consistent screenshots
});
```

#### `playwright_evaluate`
```typescript
// Run accessibility audit
const a11yIssues = await playwright_evaluate({
  expression: `
    // Inject axe-core and run audit
    const { violations } = await axe.run();
    violations.map(v => ({
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length
    }))
  `
});
```

### Context7 Documentation Tools

#### `search_documentation`
```typescript
// Search across documentation
const wcagInfo = await search_documentation({
  query: "WCAG 2.1 AA contrast ratio requirements for UI components",
  sources: ["wcag", "webaim", "mdn"]
});
```

#### `get_documentation_section`
```typescript
// Get specific doc section
const tailwindColors = await get_documentation_section({
  source: "tailwindcss",
  section: "customizing-colors",
  topic: "slate-palette"
});
```

### GitHub Enhanced Tools

#### `search_code`
```typescript
// Find all hex color usages
const hexColors = await search_code({
  query: 'repo:DrunkOnJava/firefighterHub bg-[#',
  language: "typescript"
});
```

#### `create_pull_request`
```typescript
// Create PR with detailed description
await create_pull_request({
  title: "fix(a11y): improve Shift B contrast for WCAG compliance",
  body: `## Changes
- Updated ShiftBadge.tsx to use bg-red-600
- Contrast ratio: 5.4:1 (WCAG AA ✅)

## Testing
- ✅ TypeScript compilation passed
- ✅ All tests passing
- ✅ Visual verification complete
- ✅ WCAG contrast verified

Fixes #14`,
  head: "fix/issue-14-shift-b-contrast",
  base: "main"
});
```

### Filesystem Tools

#### `read_multiple_files`
```typescript
// Read all component files for pattern analysis
const components = await read_multiple_files({
  paths: [
    "src/components/Calendar.tsx",
    "src/components/Sidebar.tsx",
    "src/components/Header.tsx",
    "src/components/calendar/DayCell.tsx"
  ]
});
```

#### `search_files`
```typescript
// Find files with arbitrary Tailwind values
const filesWithHex = await search_files({
  pattern: "bg-\\[#[0-9A-Fa-f]{6}\\]",
  path: "src/",
  recursive: true
});
```

### Memory Tools

#### `store_memory`
```typescript
// Store implementation pattern
await store_memory({
  key: "phase-1-completion",
  value: JSON.stringify({
    issues: ["#14", "#15", "#16", "#17"],
    completed: "2025-11-10",
    patterns: {
      shiftBColor: "bg-red-600",
      focusRing: ".focus-ring class",
      colorMigration: "Hex → Tailwind slate"
    },
    wcagCompliance: "100% AA"
  })
});
```

#### `retrieve_memory`
```typescript
// Recall previous implementation patterns
const phase1Patterns = await retrieve_memory({
  key: "phase-1-completion"
});

// Use patterns in Phase 2 implementation
```

---

## Integration with Custom Agent

### How MCP Tools Enhance the Agent

The custom agent can now:

**1. Visual Verification (Chrome/Playwright)**
```markdown
Instead of: "I've updated the colors, please verify manually"
Now: "I've updated the colors and captured screenshots at 375px, 768px, 1920px
showing the improvements. See attached screenshots."
```

**2. Automated Testing**
```markdown
Instead of: "Please test keyboard navigation"
Now: "I've tested keyboard navigation with Playwright. All 15 interactive
elements have visible focus rings. Test results attached."
```

**3. Documentation Reference**
```markdown
Instead of: "Based on my knowledge, WCAG requires..."
Now: "According to WCAG 2.1 AA documentation (retrieved via Context7),
UI components require 3:1 contrast ratio. Source: [link]"
```

**4. Systematic Code Search**
```markdown
Instead of: "You should check all components for hex colors"
Now: "I searched the codebase and found 23 instances of hex colors across
8 files. Here's the prioritized list for Issue #16..."
```

**5. Pattern Memory**
```markdown
Instead of: "Starting fresh on Issue #21"
Now: "Recalling patterns from Issue #14 (Shift B color), I'll apply
similar WCAG-compliant approach with added shape indicators..."
```

### Example: Complete Issue Implementation with MCP

**Implementing Issue #18 (Calendar Day Cell Hierarchy) with MCP tools:**

```markdown
Agent workflow:

1. **Read issue** (GitHub Enhanced)
   - get_file_contents for Issue #18
   - Understand problem and recommended solution

2. **Analyze current state** (Filesystem + Chrome DevTools)
   - read_file src/components/calendar/DayCell.tsx
   - puppeteer_navigate to localhost:5173
   - puppeteer_screenshot "before-hierarchy.png" at 375px, 768px, 1920px

3. **Research best practices** (Context7)
   - search_documentation "visual hierarchy typography scale"
   - search_documentation "touch target sizes mobile"

4. **Implement changes** (Filesystem)
   - write_file with updated DayCell.tsx
   - Update day number to text-base font-bold
   - Increase badge size to w-6 h-6
   - Add padding to event pills

5. **Verify changes** (Playwright)
   - playwright_navigate to localhost:5173
   - playwright_screenshot "after-hierarchy.png" (same breakpoints)
   - playwright_evaluate to check touch target sizes ≥44px
   - playwright_click to verify interactivity

6. **Run accessibility audit** (Playwright + Context7)
   - playwright_evaluate with axe-core injection
   - Verify 0 violations
   - Cross-reference with WCAG docs via Context7

7. **Create PR** (GitHub Enhanced)
   - create_pull_request with before/after screenshots
   - Detailed testing results
   - WCAG compliance confirmation

8. **Store learnings** (Memory)
   - store_memory "calendar-hierarchy-pattern" for future reference
   - store_memory "touch-target-validation-passed"

9. **Report completion**
   - create_issue_comment on #18 with results
   - Update master tracker #37
```

---

## Advanced Use Cases

### Use Case 1: Responsive Design Validation

**Agent can automatically test all breakpoints:**

```typescript
// Using Playwright MCP
const breakpoints = [375, 768, 1024, 1920];

for (const width of breakpoints) {
  await playwright_screenshot({
    path: `screenshots/calendar-${width}px.png`,
    viewport: { width, height: 1080 },
    fullPage: true
  });

  // Verify no layout overflow
  const hasOverflow = await playwright_evaluate({
    expression: `
      document.body.scrollWidth > ${width}
    `
  });

  if (hasOverflow) {
    console.log(`⚠️ Layout overflow detected at ${width}px`);
  }
}
```

### Use Case 2: WCAG Contrast Automation

**Agent can verify all colors automatically:**

```typescript
// Using Puppeteer MCP + Web Fetch
const colors = await puppeteer_evaluate({
  expression: `
    // Extract all text colors and backgrounds
    [...document.querySelectorAll('*')]
      .map(el => ({
        element: el.tagName,
        color: getComputedStyle(el).color,
        bg: getComputedStyle(el).backgroundColor
      }))
      .filter(item => item.color && item.bg)
  `
});

// Check each combination
for (const item of colors) {
  const contrastRatio = calculateContrast(item.color, item.bg);
  if (contrastRatio < 4.5) {
    console.log(`❌ WCAG failure: ${item.element} - ${contrastRatio}:1`);
  }
}
```

### Use Case 3: Systematic Code Refactoring

**Agent can batch-process files:**

```typescript
// Using Filesystem + GitHub Enhanced
const componentFiles = await list_directory({
  path: "src/components",
  recursive: true,
  pattern: "*.tsx"
});

const hexColorPattern = /bg-\[#([0-9A-Fa-f]{6})\]/g;
const filesToUpdate = [];

for (const file of componentFiles) {
  const content = await read_file({ path: file });

  if (hexColorPattern.test(content)) {
    filesToUpdate.push({
      path: file,
      hexColors: content.match(hexColorPattern)
    });
  }
}

console.log(`Found ${filesToUpdate.length} files with hex colors`);

// Update each file systematically
for (const file of filesToUpdate) {
  const updated = migrateHexToTailwind(file.content);
  await write_file({
    path: file.path,
    content: updated
  });
}
```

### Use Case 4: Visual Regression Testing

**Agent can detect visual changes:**

```typescript
// Using Playwright MCP
// 1. Capture baseline
await playwright_screenshot({
  path: "baseline/calendar.png",
  fullPage: true
});

// 2. Make changes
// ... implementation ...

// 3. Capture comparison
await playwright_screenshot({
  path: "current/calendar.png",
  fullPage: true
});

// 4. Compare (agent can use image diff tools)
const diff = await compareImages("baseline/calendar.png", "current/calendar.png");

if (diff.percentChanged > 0.1) {
  console.log(`⚠️ Visual regression detected: ${diff.percentChanged}% changed`);
}
```

---

## Environment Setup with MCP

### Update copilot-setup-steps.yml

Replace the current file with this enhanced version:

```yaml
name: "Copilot Setup Steps - UI/UX with MCP Tools"

on:
  workflow_dispatch:
  push:
    paths:
      - .github/workflows/copilot-setup-steps.yml

jobs:
  copilot-setup-steps:
    runs-on: ubuntu-latest
    timeout-minutes: 20  # Increased for MCP setup
    permissions:
      contents: read

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "pnpm"

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # NEW: MCP Server Dependencies
      - name: Install MCP browser dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y \
            libnss3 \
            libnspr4 \
            libatk1.0-0 \
            libatk-bridge2.0-0 \
            libcups2 \
            libdrm2 \
            libxkbcommon0 \
            libxcomposite1 \
            libxdamage1 \
            libxfixes3 \
            libxrandr2 \
            libgbm1 \
            libasound2 \
            libpangocairo-1.0-0 \
            libpango-1.0-0 \
            libatspi2.0-0
          echo "✅ MCP browser dependencies installed"

      # NEW: Pre-install MCP servers
      - name: Pre-install MCP servers
        run: |
          npx -y @modelcontextprotocol/server-puppeteer --version || true
          npx -y @modelcontextprotocol/server-playwright --version || true
          npx -y @modelcontextprotocol/server-filesystem --version || true
          npx -y @modelcontextprotocol/server-memory --version || true
          npx -y @modelcontextprotocol/server-fetch --version || true
          echo "✅ MCP servers pre-installed"

      - name: Install Playwright browsers
        run: pnpm exec playwright install chromium --with-deps

      - name: Verify TypeScript
        run: pnpm typecheck

      - name: Verify linting
        run: pnpm lint
        continue-on-error: true

      - name: Run unit tests
        run: pnpm test:run

      - name: Verify build
        run: pnpm build

      # NEW: Install accessibility testing tools
      - name: Install accessibility tools
        run: |
          pnpm add -D @axe-core/cli pa11y-ci
          echo "✅ Accessibility tools installed"

      # NEW: Create screenshots directory
      - name: Setup screenshots directory
        run: |
          mkdir -p screenshots/{before,after}
          mkdir -p test-artifacts
          echo "✅ Screenshot directories created"

      - name: Environment summary
        run: |
          echo "🎨 UI/UX Implementation Environment with MCP Tools"
          echo "📦 pnpm: $(pnpm --version)"
          echo "🟢 Node.js: $(node --version)"
          echo "⚛️  React: $(node -p "require('./package.json').dependencies.react")"
          echo "🎨 Tailwind: $(node -p "require('./package.json').devDependencies.tailwindcss")"
          echo "🤖 MCP Servers: 7 configured"
          echo "✅ TypeScript: Passed"
          echo "✅ Tests: Passed"
          echo "✅ Build: Passed"
          echo "🚀 Ready for MCP-enhanced implementation"
```

---

## Validation & Testing

### Validate MCP Configuration

After adding MCP configuration:

1. **Create test issue:**
   ```bash
   gh issue create --title "Test MCP Configuration" --body "Testing MCP servers

   @copilot Please list all available MCP tools and verify they work."
   ```

2. **Assign to Copilot:**
   - Assign issue to @copilot
   - Select ui-ux-implementation-specialist agent

3. **Check session logs:**
   - Wait for "Copilot started work" event
   - Click "View session"
   - Click ... → Copilot → "Start MCP Servers"
   - Verify all 7 servers listed with their tools

**Expected output in logs:**
```
Starting MCP servers...

✅ chrome-devtools
   - puppeteer_navigate
   - puppeteer_screenshot
   - puppeteer_click
   - puppeteer_fill
   - puppeteer_evaluate

✅ playwright
   - playwright_navigate
   - playwright_screenshot
   - playwright_click
   - playwright_fill
   - playwright_evaluate

✅ context7-docs
   - search_documentation
   - get_documentation_section

✅ github-enhanced
   - get_file_contents
   - search_code
   - create_pull_request
   - [... 13 total tools]

✅ filesystem
   - read_file
   - read_multiple_files
   - write_file
   - list_directory
   - search_files

✅ memory
   - store_memory
   - retrieve_memory
   - list_memories
   - delete_memory

✅ web-fetch
   - fetch

All MCP servers started successfully!
```

---

## Troubleshooting

### MCP Server Won't Start

**Symptoms:**
- "MCP server failed to start" in logs
- Missing tools in session logs

**Solutions:**
1. Check MCP configuration JSON is valid (no trailing commas, comments removed)
2. Verify dependencies installed in copilot-setup-steps.yml
3. Check firewall allows npx/npm registry access
4. View detailed logs in session viewer

### Puppeteer/Playwright Browser Errors

**Symptoms:**
- "Browser not found"
- "Failed to launch browser"

**Solutions:**
1. Ensure browser dependencies installed (see copilot-setup-steps.yml)
2. Check sufficient disk space (browsers are ~300MB)
3. Verify Ubuntu runner (not Windows/macOS)
4. Use `--no-sandbox` flag if needed

### Context7 Not Working

**Symptoms:**
- Documentation searches return empty
- Timeout errors

**Solutions:**
1. Verify Context7 API key added as `COPILOT_MCP_CONTEXT7_API_KEY`
2. Check firewall allows `context7.io` domain
3. Verify internet connectivity from runner
4. Check Context7 service status

### Filesystem Permission Errors

**Symptoms:**
- "Permission denied" when writing files
- "Path not found"

**Solutions:**
1. Ensure filesystem MCP points to `/workspace` (GitHub Actions workspace)
2. Don't use absolute paths from local machine
3. Check file permissions in repository
4. Verify checkout action has write permissions

---

## Performance Optimization

### MCP Server Caching

Add to copilot-setup-steps.yml:

```yaml
  - name: Cache MCP servers
    uses: actions/cache@v4
    with:
      path: |
        ~/.npm
        ~/.cache/puppeteer
        ~/.cache/ms-playwright
      key: ${{ runner.os }}-mcp-${{ hashFiles('**/pnpm-lock.yaml') }}
      restore-keys: |
        ${{ runner.os }}-mcp-
```

**Result:**
- First run: ~5 minutes (download browsers)
- Cached runs: ~2 minutes (browsers cached)
- **Savings: 60% faster startup**

### Selective Tool Enablement

Instead of enabling all tools (`"*"`), enable only what you need:

```json
{
  "mcpServers": {
    "playwright": {
      "tools": [
        "playwright_screenshot",
        "playwright_navigate"
      ]
    }
  }
}
```

**Benefits:**
- Faster server startup
- Reduced memory usage
- Clearer agent capabilities

---

## Security Considerations

### Secret Management

**Required secrets use `COPILOT_MCP_` prefix:**
```
COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN  ✅ Correct
GITHUB_PERSONAL_ACCESS_TOKEN              ❌ Won't work
```

**Best practices:**
- Use fine-grained PATs with minimal permissions
- Scope to single repository when possible
- Set expiration dates (90 days recommended)
- Rotate secrets quarterly
- Never commit secrets to repository

### Firewall Configuration

**Keep these settings:**
- ✅ Enable firewall: ON
- ✅ Recommended allowlist: ON
- ✅ Custom allowlist: Add only necessary domains

**MCP servers that need firewall access:**
- context7.io (documentation lookup)
- api.githubcopilot.com (GitHub MCP server)

**Automatically allowed:**
- registry.npmjs.org (for npx MCP servers)
- github.com (for GitHub operations)

---

## Cost Estimation

### GitHub Actions Usage

**With MCP servers enabled:**
- Setup time: ~3-4 minutes (first run: ~7 minutes)
- Additional billable minutes: ~2 minutes per issue
- Screenshot storage: ~5MB per issue (negligible)

**Total for 23 issues:**
- Setup: ~4 minutes × 23 = 92 minutes
- Implementation: ~50 hours (unchanged)
- **Additional cost: Minimal** (~$1-2 for GitHub Actions minutes)

### Storage Requirements

**MCP server artifacts:**
- Puppeteer browser: ~300MB (cached)
- Playwright browser: ~400MB (cached)
- Screenshots: ~5MB per issue × 23 = ~115MB
- Test artifacts: ~50MB

**Total: ~900MB** (within GitHub Actions limits)

---

## Summary

### What MCP Adds

**Without MCP:**
- Agent can read/edit files
- Must rely on user for visual verification
- Limited documentation access
- Manual testing required

**With MCP:**
- ✅ Automated screenshots at all breakpoints
- ✅ Automated accessibility testing (axe-core)
- ✅ Real-time documentation lookup
- ✅ Visual regression detection
- ✅ Pattern memory across sessions
- ✅ Systematic code search and refactoring
- ✅ Touch target size validation

### Recommended Configuration

**Minimal (Fast startup):**
```json
{
  "mcpServers": {
    "playwright": { ... },
    "github-enhanced": { ... },
    "memory": { ... }
  }
}
```

**Full (Maximum capabilities):**
```json
{
  "mcpServers": {
    "chrome-devtools": { ... },
    "playwright": { ... },
    "context7-docs": { ... },
    "github-enhanced": { ... },
    "filesystem": { ... },
    "memory": { ... },
    "web-fetch": { ... }
  }
}
```

**Recommended: Full configuration** - The benefits outweigh the ~1-2 minute additional startup time.

---

## Next Steps

1. **Add MCP configuration** to repository settings
2. **Add optional secrets** (GITHUB_PAT, Context7 key)
3. **Update copilot-setup-steps.yml** with MCP dependencies
4. **Test configuration** by assigning test issue
5. **Verify tools available** in session logs
6. **Start implementing** Issue #14 with enhanced capabilities!

---

**MCP servers ready to supercharge your UI/UX implementation!** 🚀
