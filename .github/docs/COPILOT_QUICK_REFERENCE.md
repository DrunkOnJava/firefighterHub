# GitHub Copilot UI/UX Agent - Quick Reference Card

## Quick Start (60 Seconds)

```bash
# 1. Setup environment (one-time)
./.github/scripts/setup-copilot-environment.sh

# 2. Verify it works
gh workflow run "Copilot Setup Steps" --ref main
gh run watch

# 3. Use the agent
# Go to Issue #14, assign to @copilot, select "ui-ux-implementation-specialist"
```

---

## Agent Quick Reference

### When to Use This Agent

**Use ui-ux-implementation-specialist for:**
- Implementing Issues #14-#36 (UI/UX audit)
- Design system improvements
- Accessibility fixes (WCAG compliance)
- Color system changes
- Component styling updates
- Typography/spacing standardization

**Do not use for:**
- Database schema changes
- Business logic implementation
- API endpoint creation
- Authentication/security features

### How to Use

**Method 1: Issue Assignment**
1. Open issue (e.g., #14)
2. Assign to @copilot
3. Select "ui-ux-implementation-specialist"
4. Wait for PR

**Method 2: Agents Tab**
1. Visit: github.com/[repo]/copilot/agents
2. Select agent from dropdown
3. Type: "Implement Issue #14"
4. Review suggestions

**Method 3: VS Code**
1. Open Copilot Chat
2. Switch to agent mode
3. Ask questions or request implementations

---

## Implementation Checklist

### For Every Issue:

```
Read issue completely
Understand problem and recommended solution
Read affected files
Update design tokens FIRST (if needed)
Implement solution from issue
Run: pnpm typecheck
Run: pnpm lint
Run: pnpm test:run
Run: pnpm dev (visual check)
Verify WCAG (if accessibility issue)
Take before/after screenshots
Commit with issue reference
Report results
```

### WCAG Verification (Critical Issues):

```
Check contrast with WebAIM Contrast Checker
Verify ≥4.5:1 for normal text
Verify ≥3:1 for large text/UI components
Test keyboard navigation (Tab, Enter, Esc)
Verify focus ring visible (2px, 3:1 contrast)
Check touch targets ≥44px on mobile
Test color-blind simulation (8 types)
Test screen reader (VoiceOver/NVDA)
```

---

## Design Token Quick Reference

### Import Statement
```typescript
import { colors, tokens } from '@/styles';
```

### Common Colors
```typescript
// Backgrounds
colors.structural.bg.app          // slate-900 (main)
colors.structural.bg.card         // slate-800 (cards)
colors.structural.bg.cardHover    // slate-700 (hover)

// Text
colors.structural.text.primary    // gray-100 (high emphasis)
colors.structural.text.secondary  // gray-400 (medium emphasis)

// Semantic
colors.semantic.primary.gradient  // Red-rose (primary actions)
colors.semantic.accent.gradient   // Red-orange (CTAs) - NEW
colors.semantic.scheduled.gradient // Blue (scheduled)
colors.semantic.success.gradient  // Emerald (completed)
```

### Common Spacing
```typescript
tokens.spacing.card.md      // p-4 (16px) - Cards
tokens.spacing.section.md   // p-3 (12px) - Sections
tokens.spacing.gap.md       // gap-3 (12px) - Gaps
```

### Common Typography
```typescript
tokens.typography.heading.h1     // text-4xl font-bold
tokens.typography.heading.h2     // text-2xl font-semibold
tokens.typography.body.primary   // text-base
tokens.typography.body.small     // text-xs
```

---

## Testing Commands

```bash
# TypeScript
pnpm typecheck

# Linting (8 warnings OK)
pnpm lint

# Unit tests
pnpm test:run

# E2E tests
pnpm test:e2e:headed

# Build
pnpm build

# Dev server
pnpm dev
```

---

## Success Criteria

### Code Quality
- 0 TypeScript errors
- ≤8 lint warnings
- All tests passing
- 95%+ design token usage

### Accessibility
- 100% WCAG AA compliance
- All focus indicators visible
- 44px+ touch targets
- Color-blind safe

### Visual
- Matches design spec
- Responsive (375px-1920px)
- No layout overflow
- Dark mode works

---

## Quick Links

- **Master Issue:** #37
- **Phase 1 Issues:** #14, #15, #16, #17
- **Agent Config:** `.github/agents/ui-ux-implementation-specialist.md`
- **Environment Setup:** `.github/docs/ENVIRONMENT_CONFIGURATION.md`
- **Implementation Guide:** `docs/UI_UX_IMPLEMENTATION_GUIDE.md`
- **WebAIM Checker:** https://webaim.org/resources/contrastchecker/
- **WCAG Guide:** https://www.w3.org/WAI/WCAG21/quickref/

---

**Last Updated:** November 4, 2025
