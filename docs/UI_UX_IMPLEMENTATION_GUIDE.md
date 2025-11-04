# UI/UX Implementation Guide

Quick reference for implementing the UI/UX design audit using the custom GitHub Copilot agent.

## Quick Start

### 1. Using the Custom Agent (Fastest Method)

The **ui-ux-implementation-specialist** custom agent is pre-configured with all the knowledge needed to implement audit issues.

**To use it:**

```bash
# Option A: Assign issue to Copilot with custom agent
1. Open issue (e.g., #14)
2. Click "Assignees" → select @copilot
3. Agent dropdown → select "ui-ux-implementation-specialist"
4. Wait for Copilot to create PR

# Option B: Use agents tab
1. Go to https://github.com/[your-repo]/copilot/agents
2. Select "ui-ux-implementation-specialist"
3. Type: "Implement Issue #14"
4. Review and apply suggested changes

# Option C: VS Code chat mode
1. Open Copilot Chat in VS Code
2. Select "ui-ux-implementation-specialist" mode
3. Ask: "Help me implement Issue #15"
```

### 2. Manual Implementation (If Not Using Agent)

If implementing manually, follow this workflow for EVERY issue:

```bash
# Step 1: Read the issue completely
gh issue view 14

# Step 2: Read affected files
# (Check "Location(s)" section in issue)

# Step 3: Implement recommended solution
# (Copy code examples from issue)

# Step 4: Test changes
pnpm typecheck          # Must pass
pnpm lint               # 8 warnings OK
pnpm test:run           # All tests pass
pnpm dev                # Visual verification

# Step 5: Verify accessibility (for WCAG issues)
# - Check contrast ratio with WebAIM tool
# - Test keyboard navigation
# - Test screen reader (VoiceOver/NVDA)

# Step 6: Commit
git add [files]
git commit -m "fix(a11y): improve Shift B contrast for WCAG compliance

- Update ShiftBadge.tsx to use bg-red-600
- Contrast ratio now 5.4:1 (WCAG AA ✅)

Fixes #14"

# Step 7: Push and verify
git push
gh pr view
```

## Implementation Priorities

### Start Here (Critical Fixes)

**Week 1 - Must complete these first:**

1. **Issue #14** (30 min) - Fix Shift B contrast ⚠️ **CRITICAL WCAG violation**
2. **Issue #15** (2 hrs) - Fix focus rings ⚠️ **CRITICAL accessibility issue**
3. **Issue #16** (4 hrs) - Migrate hex to Tailwind (foundation for all other work)
4. **Issue #17** (1 hr) - Document accent gradient (enables future development)

**Total: 7.5 hours**

**Why this order?**
- #14 and #15 are legal/accessibility requirements
- #16 creates foundation for all other color work
- #17 documents existing patterns before adding more

### Then Continue (Visual Hierarchy)

**Week 2 - Improve scannability:**

5. **Issue #18** - Calendar cell hierarchy (3 hrs)
6. **Issue #19** - Typography scale (2 hrs)
7. **Issue #20** - Spacing system (4 hrs)
8. **Issue #21** - Color-blind indicators (2 hrs)

**Total: 11 hours**

### And So On...

See full roadmap in Issue #37 or `.github/agents/README.md`

## Design Token Cheat Sheet

### When to Update vs. Use Tokens

**UPDATE tokens when:**
- Adding a new color not in the palette
- Creating a new spacing value needed across multiple components
- Defining a new component pattern (button variants, card styles)

**USE existing tokens when:**
- Styling any component (99% of the time)
- The needed value already exists in `colorSystem.ts` or `tokens.ts`

### Quick Token Reference

```typescript
import { colors, tokens } from '@/styles';

// COLORS
colors.structural.bg.app           // Main app background (slate-900)
colors.structural.bg.card          // Card backgrounds (slate-800)
colors.structural.bg.cardHover     // Card hover (slate-700)
colors.structural.border.default   // Standard borders (slate-900)
colors.structural.text.primary     // Primary text (gray-100)
colors.structural.text.secondary   // Secondary text (gray-400)

colors.semantic.primary.gradient   // Red-rose gradient (primary actions)
colors.semantic.scheduled.gradient // Blue gradient (scheduled holds)
colors.semantic.success.gradient   // Emerald-green gradient (completed)
colors.semantic.accent.gradient    // Red-orange gradient (CTAs) ← NEW in #17

// SPACING
tokens.spacing.card.md             // Card padding (16px / p-4)
tokens.spacing.section.md          // Section padding (12px / p-3)
tokens.spacing.gap.md              // Gap between items (12px / gap-3)

// TYPOGRAPHY
tokens.typography.heading.h1       // Main titles (text-4xl font-bold)
tokens.typography.heading.h2       // Section headers (text-2xl font-semibold)
tokens.typography.body.primary     // Standard text (text-base)
tokens.typography.body.small       // Fine print (text-xs)

// BORDERS
tokens.borders.radius.lg           // Standard radius (8px / rounded-lg)
tokens.borders.radius.xl           // Card radius (12px / rounded-xl)
tokens.borders.width.medium        // 2px borders (border-2)

// SHADOWS
tokens.shadows.sm                  // Subtle elevation
tokens.shadows.lg                  // Primary actions
tokens.shadows['2xl']              // Modals/toasts

// TRANSITIONS
tokens.transitions.fast            // 150ms (buttons, hovers)
tokens.transitions.normal          // 300ms (modals, drawers)
```

## Common Tasks

### Task: Change a Color

```typescript
// 1. Determine if color should be in design system
// 2. Add to colorSystem.ts if new semantic meaning:

semantic: {
  newCategory: {
    gradient: "bg-gradient-to-r from-color-500 to-color-600",
    solid: "bg-color-600",
    hover: "hover:from-color-500 hover:to-color-500",
    text: "text-color-400",
    // ... complete pattern
  }
}

// 3. Use in component:
import { colors } from '@/styles';
className={colors.semantic.newCategory.gradient}

// 4. Verify contrast ratio ≥ 4.5:1 for text, ≥ 3:1 for UI
```

### Task: Adjust Spacing

```typescript
// 1. Check if spacing token exists in tokens.ts
// 2. If not, add it:

spacing: {
  newCategory: {
    sm: 'p-2',  // 8px
    md: 'p-3',  // 12px
    lg: 'p-4',  // 16px
  }
}

// 3. Use in component:
import { tokens } from '@/styles';
className={tokens.spacing.newCategory.md}

// 4. Update all instances for consistency
```

### Task: Fix WCAG Contrast

```typescript
// 1. Identify failing color combination
// 2. Use WebAIM Contrast Checker:
//    https://webaim.org/resources/contrastchecker/
//    - Foreground: [current text color]
//    - Background: [current bg color]

// 3. If ratio < 4.5:1 for text:
//    - Lighten text color (slate-400 → slate-300)
//    - OR darken background (slate-700 → slate-800)

// 4. Verify new ratio ≥ 4.5:1
// 5. Update component with compliant colors
// 6. Test in browser DevTools "Emulate vision deficiencies"
```

### Task: Add Focus Indicators

```typescript
// 1. Find interactive element without focus ring
<button className="px-4 py-2 bg-blue-600">Click</button>

// 2. Add .focus-ring class
<button className="px-4 py-2 bg-blue-600 focus-ring">Click</button>

// 3. For tight layouts, use inset variant:
<button className="p-2 bg-transparent hover:bg-slate-700 focus-ring-inset">
  <Icon />
</button>

// 4. Test keyboard navigation:
//    - Tab to element
//    - Verify focus ring visible
//    - No layout shift
//    - Ring has 3:1 contrast vs background
```

## Testing Workflows

### Accessibility Testing

```bash
# 1. Contrast ratios
# Use WebAIM Contrast Checker manually
# https://webaim.org/resources/contrastchecker/

# 2. Keyboard navigation
# Manual test:
# - Tab through entire app
# - Shift+Tab backwards
# - Enter/Space to activate
# - Escape to close modals
# - Arrow keys where applicable

# 3. Screen reader (macOS)
# Enable VoiceOver: Cmd+F5
# Navigate: Ctrl+Option+Arrow Keys
# Verify all elements announced correctly

# 4. Color-blind simulation
# Chrome DevTools:
# 1. Open DevTools (Cmd+Option+I)
# 2. Cmd+Shift+P → "Rendering"
# 3. "Emulate vision deficiencies"
# 4. Test all 8 deficiency types

# 5. Touch target sizes
# Chrome DevTools:
# 1. Toggle device toolbar (Cmd+Shift+M)
# 2. Select iPhone SE (375px width)
# 3. Inspect touch targets (should be ≥44px)

# 6. Automated accessibility audit
pnpm exec playwright test --headed --project=chromium
pnpm exec axe http://localhost:5173
```

### Visual Regression Testing

```bash
# 1. Take "before" screenshot
# Run dev server
pnpm dev

# Navigate to component
# Take screenshot (Cmd+Shift+4 on macOS)
# Save as: before-issue-14.png

# 2. Implement changes

# 3. Take "after" screenshot
# Refresh browser
# Take screenshot
# Save as: after-issue-14.png

# 4. Compare side-by-side
# Open both images
# Verify:
# - Colors changed as expected
# - No unintended changes
# - Layout intact
# - Text legible
```

### Performance Testing

```bash
# 1. Before changes - Lighthouse audit
pnpm dev
# Open http://localhost:5173
# Chrome DevTools → Lighthouse
# Run audit, save scores

# 2. Implement changes

# 3. After changes - Lighthouse audit
# Run audit again
# Compare scores:
# - Performance (should be same or better)
# - Accessibility (should improve)
# - Best Practices (should maintain 100)

# 4. Bundle size check
pnpm build
ls -lh dist/assets/*.js
# Verify no significant increase (< 5%)
```

## Troubleshooting

### "TypeScript errors after implementing changes"

```bash
# 1. Read error message
pnpm typecheck

# 2. Common fixes:
# - Add missing type import
# - Add type assertion: `as "A" | "B" | "C"`
# - Update interface with new optional prop

# 3. Verify fix
pnpm typecheck
```

### "Visual changes don't match issue description"

```bash
# 1. Re-read issue "Recommended Solution" section
# 2. Verify exact code examples were used
# 3. Check design tokens match
# 4. Clear browser cache (Cmd+Shift+R)
# 5. Restart dev server (Ctrl+C, pnpm dev)
```

### "Contrast ratio still failing WCAG"

```bash
# 1. Double-check WebAIM Contrast Checker input:
#    - Foreground: Exact hex from browser DevTools
#    - Background: Exact hex from DevTools (not assumed)

# 2. For text, need ≥ 4.5:1 (normal) or ≥ 3:1 (large ≥18px)
# 3. For UI components (buttons, borders), need ≥ 3:1

# 4. If failing, try:
#    - Lighter text (slate-400 → slate-300 → slate-200)
#    - Darker background (slate-700 → slate-800 → slate-900)

# 5. Re-verify until passing
```

### "Agent not following instructions"

```markdown
# Make prompts more specific:

❌ Too vague: "Fix the calendar colors"

✅ Specific: "Implement Issue #16: Migrate custom hex colors to Tailwind

Follow the migration guide in the issue:
1. Update colorSystem.ts structural colors
2. Replace hex values in DayCell.tsx
3. Add slate-850 custom color to tailwind.config.js
4. Verify visual consistency with before/after screenshots
5. Run typecheck and build verification"
```

## Phase Completion Checklist

Before marking a phase complete:

### Phase 1 Complete When:
- [ ] Issue #14 closed (Shift B contrast fixed)
- [ ] Issue #15 closed (Focus rings standardized)
- [ ] Issue #16 closed (Hex colors migrated)
- [ ] Issue #17 closed (Accent gradient documented)
- [ ] All Phase 1 tests passing
- [ ] WCAG AA compliance achieved
- [ ] No visual regressions
- [ ] Design system docs updated

### Phase 2 Complete When:
- [ ] Issues #18-#21 all closed
- [ ] Typography scale strengthened
- [ ] Spacing system standardized
- [ ] Calendar hierarchy improved
- [ ] Color-blind indicators added
- [ ] All tests passing
- [ ] 30-40% faster calendar scanning (user testing)

### Continue for Phases 3-5...

## Success Metrics

Track progress toward audit completion goals:

### Quantitative
- [ ] 23/23 issues closed (0% complete → 100% complete)
- [ ] 0 TypeScript errors (maintain throughout)
- [ ] 100% WCAG 2.1 AA compliance
- [ ] < 5% hex color usage (95%+ Tailwind classes)
- [ ] 44px+ minimum touch targets
- [ ] 100% component focus indicator coverage

### Qualitative
- [ ] Design feels cohesive and professional
- [ ] Users can scan calendar 30-40% faster
- [ ] New users complete first action without confusion
- [ ] App passes axe/WAVE accessibility audits
- [ ] Firefighters can use app in bright station environments

## Resources

### Documentation
- **Full Audit Report:** See comprehensive audit analysis (November 4, 2025)
- **Master Tracking Issue:** #37
- **Custom Agent:** `.github/agents/ui-ux-implementation-specialist.md`
- **Agent README:** `.github/agents/README.md`
- **Project Docs:** `CLAUDE.md`

### Tools
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **WCAG Quick Reference:** https://www.w3.org/WAI/WCAG21/quickref/
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **axe DevTools:** Browser extension for a11y testing
- **GitHub Copilot Docs:** https://docs.github.com/en/copilot

### Commands
```bash
# Development
pnpm dev              # Start dev server (localhost:5173)
pnpm build            # Production build
pnpm typecheck        # TypeScript validation
pnpm lint             # ESLint check

# Testing
pnpm test             # Vitest watch mode
pnpm test:run         # Run tests once
pnpm test:coverage    # Coverage report
pnpm test:e2e:headed  # E2E with visible browser

# GitHub CLI
gh issue list --label "ui/ux"              # List all audit issues
gh issue view 14                            # View specific issue
gh issue list --label "phase: 1"           # View Phase 1 issues
gh issue list --label "priority: critical" # View critical issues
```

## FAQ

### Q: Should I implement multiple issues in one PR?

**A: No.** Implement one issue per PR for easier review and debugging. Exception: Very small related issues can be combined if it makes sense (ask first).

### Q: Can I skip the testing steps?

**A: No.** Testing is critical for quality. Every issue has a testing checklist that MUST be completed before closing.

### Q: What if the recommended solution doesn't work?

**A: Document the issue and ask for guidance.** Explain what you tried, what error occurred, and propose an alternative. Don't guess or improvise.

### Q: Do I need to update documentation for every change?

**A: Yes, if:**
- You added new design tokens (update `src/styles/README.md`)
- You created new components (add JSDoc comments)
- You changed component props (update interface comments)
- You added new patterns (document in code comments)

**A: No, if:**
- Just fixing a color value in existing token
- Small bug fix with no pattern change

### Q: How do I know if my contrast ratio is correct?

**A: Use WebAIM Contrast Checker:**
1. Go to https://webaim.org/resources/contrastchecker/
2. Enter foreground color (text/icon color)
3. Enter background color
4. Check ratio:
   - Normal text (< 18px): Need ≥ 4.5:1
   - Large text (≥ 18px bold / ≥ 24px): Need ≥ 3:1
   - UI components: Need ≥ 3:1
5. Look for "WCAG AA" pass indicators

### Q: What if I break something?

**A: Don't panic:**
1. Run `pnpm typecheck` to identify TypeScript errors
2. Run `pnpm test:run` to find failing tests
3. Check browser console for runtime errors
4. Revert your changes: `git checkout HEAD -- [file]`
5. Re-read the issue and try again more carefully
6. Ask for help if stuck

## Quick Wins

Easy issues to start with (if new to the codebase):

1. **Issue #23** (2 hrs) - Border radius consistency
   - Simple find-and-replace task
   - Clear documentation
   - Low risk of breaking things

2. **Issue #36** (1 hr) - Station number formatting
   - Create utility function
   - Update a few locations
   - Easy to test

3. **Issue #31** (1 hr) - Document hover patterns
   - Mostly documentation work
   - Minimal code changes
   - Good for learning the codebase

## Advanced: Creating New Components

If an issue requires creating a new component (e.g., #25 LoadingSpinner, #28 EmptyState):

### Component Creation Checklist
- [ ] Create file in appropriate directory
- [ ] Define TypeScript interface for props
- [ ] Use design tokens exclusively
- [ ] Add JSDoc comments
- [ ] Include accessibility attributes (aria-label, role)
- [ ] Create test file (`.test.tsx`)
- [ ] Export from barrel file (index.ts)
- [ ] Document usage in comments
- [ ] Add to Storybook (if applicable)

### Example Template
```typescript
/**
 * ComponentName Component
 *
 * Brief description of what this component does.
 *
 * @example
 * ```tsx
 * <ComponentName
 *   variant="primary"
 *   onClick={handleClick}
 * />
 * ```
 */

import { colors, tokens } from '@/styles';

interface ComponentNameProps {
  /** Description of prop */
  variant?: 'primary' | 'secondary';
  /** Description of prop */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function ComponentName({
  variant = 'primary',
  onClick,
  className = ''
}: ComponentNameProps) {
  return (
    <div
      className={`
        ${tokens.spacing.card.md}
        ${tokens.borders.radius.lg}
        ${colors.structural.bg.card}
        ${className}
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Descriptive label"
    >
      Component content
    </div>
  );
}
```

---

**Ready to implement? Start with Phase 1, Issue #14!** 🚀

*For questions or issues, reference the custom agent documentation in `.github/agents/README.md` or consult Issue #37.*
