# Header Hierarchy Implementation Tasks
**FirefighterHub SEO & Accessibility Optimization**  
*Priority-ordered task list with acceptance criteria*

---

## 🔴 CRITICAL TASKS (Week 1) - Fix Errors

### Task 1.1: Fix Duplicate H1 in Reports Component
**File**: `src/components/Reports.tsx` (Line 202)  
**Current**:
```tsx
<h1 className={`${tokens.typography.heading.h1}`}>
  Reports & Analytics
</h1>
```

**Fix**:
```tsx
<h2 className={`${tokens.typography.heading.h2}`}>
  Fire Department Hold Rotation Analytics
</h2>
```

**Acceptance Criteria**:
- [ ] H1 changed to H2
- [ ] SEO keyword added ("Fire Department")
- [ ] Validation script passes (only 1 H1 in codebase)

**Estimated Time**: 5 minutes

---

### Task 1.2: Add Schema.org Structured Data
**File**: `index.html` (before `</head>`)

**Implementation**:
```html
<!-- Add before </head> tag -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "FirefighterHub",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Workforce Management",
  "description": "Comprehensive firefighter shift management system for fire departments. Track hold rotations, manage shift schedules, and sync rosters in real-time across A, B, and C shifts.",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Firefighter shift rotation management",
    "Hold tracking and scheduling",
    "Real-time roster synchronization",
    "Activity audit logging",
    "Apparatus certification tracking",
    "Battalion chief administrative controls"
  ],
  "keywords": "firefighter shift management, hold rotation tracker, fire department roster, shift scheduling, battalion chief software",
  "audience": {
    "@type": "Audience",
    "audienceType": "Fire Departments, Battalion Chiefs, Fire Station Managers"
  },
  "url": "https://firefighter-hub.vercel.app"
}
</script>
```

**Acceptance Criteria**:
- [ ] Schema added to index.html
- [ ] Validates with https://validator.schema.org
- [ ] Google Rich Results Test passes
- [ ] Validation script detects schema

**Estimated Time**: 10 minutes

---

### Task 1.3: Optimize Page Title for SEO
**File**: `index.html` (Line 8)

**Current**:
```html
<title>Hold List Manager - Firefighter Rotation</title>
```

**Fix**:
```html
<title>Firefighter Shift Management & Hold Rotation Tracker | FirefighterHub</title>
```

**Acceptance Criteria**:
- [ ] Contains "firefighter" keyword
- [ ] Contains "shift" keyword  
- [ ] Contains "hold rotation" keyword
- [ ] Under 60 characters
- [ ] Validation script passes keyword checks

**Estimated Time**: 5 minutes

---

### Task 1.4: Enhance Meta Description
**File**: `index.html` (Lines 34-36)

**Current**:
```html
<meta
  name="description"
  content="Modern, fair, transparent hold rotation manager for firefighters. Track holds, preserve fairness, and sync rosters in real-time. Battalion-chief friendly, Supabase-backed."
/>
```

**Fix**:
```html
<meta
  name="description"
  content="Professional firefighter shift management system for fire departments. Track hold rotations, manage shift schedules, and sync rosters in real-time across A, B, and C shifts."
/>
```

**Character Count**: 157 (within 150-160 target)

**Acceptance Criteria**:
- [ ] 150-160 characters
- [ ] Contains 2-3 primary keywords
- [ ] Natural language (not keyword stuffing)
- [ ] Validation script passes length check

**Estimated Time**: 5 minutes

---

## ⚠️ HIGH PRIORITY TASKS (Week 2) - Fix Warnings

### Task 2.1: Create visualHeadings Utility
**File**: `src/styles/visualHeadings.ts` (Already created ✅)

**Next Step**: Export in index
**File**: `src/styles/index.ts`

**Add**:
```typescript
export { visualHeadings } from './visualHeadings';
export type { VisualHeadingKey } from './visualHeadings';
```

**Acceptance Criteria**:
- [ ] Module exports from styles/index.ts
- [ ] TypeScript types included
- [ ] No build errors

**Estimated Time**: 2 minutes

---

### Task 2.2: Refactor FirefighterProfileModal (Lines 381, 715, 729, 825, 848, 872, 887)
**File**: `src/components/FirefighterProfileModal.tsx`

**Changes Required**: 7 locations

**Example - Line 381**:
```tsx
// BEFORE
<input 
  className={`${tokens.typography.heading.h2} ...`}
/>

// AFTER
import { visualHeadings } from '../styles';

<input 
  className={`${visualHeadings.titleLarge} ...`}
/>
```

**All Locations**:
1. Line 381: Input field → `visualHeadings.titleLarge`
2. Line 715: Position number → `visualHeadings.metricLarge`
3. Line 729: Station number → `visualHeadings.metricLarge`
4. Line 825: Section header → `visualHeadings.titleMedium`
5. Line 848: Stat value → `visualHeadings.metricLarge`
6. Line 872: Label → `visualHeadings.subtitleLarge`
7. Line 887: Label → `visualHeadings.subtitleLarge`

**Acceptance Criteria**:
- [ ] All 7 instances refactored
- [ ] No visual regression (screenshots match)
- [ ] TypeScript compiles
- [ ] Validation warnings reduced

**Estimated Time**: 20 minutes

---

### Task 2.3: Fix Skipped Heading Levels in HoldForm
**File**: `src/components/calendar/HoldForm.tsx` (Lines 78, 203)

**Current**:
```tsx
<h2>Select Firefighter</h2>
  ...
  <h4>Duration</h4>  {/* Line 78 - SKIPPED H3 */}
  ...
  <h4>Station</h4>   {/* Line 203 - SKIPPED H3 */}
```

**Fix**:
```tsx
<h2>Select Firefighter</h2>
  ...
  <h3>Hold Duration</h3>  {/* Changed from H4 */}
  ...
  <h3>Fire Station</h3>   {/* Changed from H4 */}
```

**Acceptance Criteria**:
- [ ] No skipped levels (H2 → H3)
- [ ] Screen reader navigation smooth
- [ ] Semantic hierarchy correct

**Estimated Time**: 5 minutes

---

### Task 2.4: Add ARIA Landmarks to Main Sections
**Files**: 
- `src/components/FirefighterList.tsx`
- `src/components/CalendarView.tsx`
- `src/components/NextUpBar.tsx`

**Pattern**:
```tsx
// BEFORE
<div className="roster-container">
  <h2>Active Members</h2>
</div>

// AFTER
<section aria-labelledby="roster-heading">
  <h2 id="roster-heading">Active Members</h2>
</section>
```

**Locations**:
1. FirefighterList.tsx - Roster section
2. CalendarView.tsx - Calendar grid
3. NextUpBar.tsx - Next up rotation (use `<aside>`)

**Acceptance Criteria**:
- [ ] All major sections have landmarks
- [ ] Headings linked with `aria-labelledby`
- [ ] Screen reader announces regions
- [ ] ARIA coverage >80%

**Estimated Time**: 30 minutes

---

## 🟡 MEDIUM PRIORITY (Week 3) - Enhancements

### Task 3.1: Add BreadcrumbList Schema
**File**: `index.html` (after SoftwareApplication schema)

**Implementation**:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://firefighter-hub.vercel.app"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Roster Management"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Hold Calendar"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Reports"
    }
  ]
}
</script>
```

**Estimated Time**: 10 minutes

---

### Task 3.2: Refactor Remaining Components with visualHeadings

**Files to Update**:
1. `src/components/ConfirmDialog.tsx` (Line 133)
2. `src/components/LoginModal.tsx` (Line 93)
3. `src/components/calendar/CalendarHeader.tsx` (Lines 56, 97)
4. `src/components/calendar/HoldList.tsx` (Line 104)
5. `src/components/ReactivateModal.tsx` (Line 114)

**Pattern**: Same as Task 2.2

**Estimated Time**: 40 minutes

---

### Task 3.3: Add Keyword-Rich Headers to Major Sections

**Changes**:

1. **FirefighterList.tsx**:
```tsx
// BEFORE
<h2>Active Members</h2>

// AFTER
<h2>Active Firefighter Roster - Shift {currentShift}</h2>
```

2. **CalendarView.tsx**:
```tsx
// BEFORE
<h2>Calendar</h2>

// AFTER
<h2>Hold Schedule Calendar - {monthName} {year}</h2>
```

3. **NextUpBar.tsx**:
```tsx
// BEFORE
<h2>Next Up</h2>

// AFTER
<h2>Next Up Rotation - All Shifts</h2>
```

**Acceptance Criteria**:
- [ ] Keywords integrated naturally
- [ ] Headers descriptive (not generic)
- [ ] No keyword stuffing
- [ ] Context-aware (shows shift/date)

**Estimated Time**: 20 minutes

---

## 🟢 LOW PRIORITY (Week 4+) - Polish

### Task 4.1: Add FAQPage Schema to HelpModal
**File**: `src/components/HelpModal.tsx`

**Add FAQ structured data for common questions**:
- "What is a hold rotation system?"
- "How do I schedule a hold?"
- "Can I manage multiple shifts?"

**Estimated Time**: 30 minutes

---

### Task 4.2: Create Accessibility Testing Suite
**File**: `playwright.config.ts` + new test files

**Add**:
```typescript
// tests/accessibility/header-hierarchy.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Header Hierarchy', () => {
  test('should have only one H1', async ({ page }) => {
    await page.goto('/');
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });
  
  test('should have sequential heading levels', async ({ page }) => {
    await page.goto('/');
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations.filter(v => v.id === 'heading-order')).toHaveLength(0);
  });
});
```

**Estimated Time**: 1 hour

---

### Task 4.3: Document Header Patterns in Storybook (Optional)
**Create visual documentation of header patterns**

**Estimated Time**: 2 hours

---

## Testing & Validation Checklist

After each task, run:

```bash
# 1. Validation script
pnpm run validate:headers

# 2. TypeScript check
pnpm typecheck

# 3. Build test
pnpm build

# 4. Screen reader test
# - macOS: Cmd+F5 (VoiceOver)
# - Navigate with Ctrl+Option+H (headings)

# 5. Lighthouse audit
# - Open DevTools → Lighthouse
# - Run SEO audit
# - Target score: 95+

# 6. Schema validation
# - Visit https://validator.schema.org
# - Paste index.html schema blocks
```

---

## Success Metrics

### Before Implementation
- ❌ Multiple H1 tags: 2
- ⚠️ Heading style on non-headings: 46
- ⚠️ No schema markup
- ⚠️ Meta description: 0 chars (missing)
- ⚠️ Missing keywords in title

### After Implementation (Target)
- ✅ Single H1 tag: 1
- ✅ Heading style on non-headings: 0
- ✅ Schema markup: 3 types (SoftwareApplication, Breadcrumb, FAQ)
- ✅ Meta description: 150-160 chars
- ✅ All keywords in title

### Lighthouse Score Targets
| Category | Before | After | Target |
|----------|--------|-------|--------|
| SEO | 87 | ? | 95+ |
| Accessibility | 92 | ? | 95+ |
| Performance | 94 | 94 | Maintain |

---

## Implementation Order (Recommended)

### Sprint 1 (Week 1) - Critical Fixes
**Day 1**: Tasks 1.1, 1.3, 1.4 (Quick wins - 15 min total)  
**Day 2**: Task 1.2 (Schema markup - 10 min)  
**Day 3**: Validation testing

**Deliverable**: Validation script passes with 0 errors

---

### Sprint 2 (Week 2) - Visual/Semantic Separation
**Day 1**: Tasks 2.1 (Already done ✅)  
**Day 2-3**: Task 2.2 (FirefighterProfileModal refactor - 20 min)  
**Day 4**: Task 2.3 (HoldForm heading fix - 5 min)  
**Day 5**: Task 2.4 (ARIA landmarks - 30 min)

**Deliverable**: All warnings addressed, ARIA coverage >80%

---

### Sprint 3 (Week 3) - SEO Enhancement
**Day 1**: Task 3.1 (Breadcrumb schema - 10 min)  
**Day 2-3**: Task 3.2 (Remaining components - 40 min)  
**Day 4**: Task 3.3 (Keyword-rich headers - 20 min)  
**Day 5**: Full regression testing

**Deliverable**: Lighthouse SEO score 95+

---

### Sprint 4 (Week 4+) - Polish (Optional)
**As time permits**: Tasks 4.1, 4.2, 4.3

---

## Dependencies

```json
// package.json additions (if needed)
{
  "devDependencies": {
    "@axe-core/playwright": "^4.8.0",
    "pa11y": "^7.0.0",
    "@lhci/cli": "^0.13.0"
  },
  "scripts": {
    "validate:headers": "./scripts/validate-headers.sh",
    "test:a11y": "playwright test --grep accessibility",
    "lighthouse": "lhci autorun"
  }
}
```

---

## Rollback Plan

If issues arise:

1. **Git revert specific commits**:
   ```bash
   git log --oneline --grep="header"
   git revert <commit-sha>
   ```

2. **Restore backup files**:
   ```bash
   git checkout main -- src/components/Reports.tsx
   ```

3. **Disable schema** (if breaking):
   - Comment out `<script type="application/ld+json">` blocks

---

## Notes for Reviewers

- **Visual regression**: Screenshot before/after for modal components
- **Keyword density**: Ensure <3% (natural language)
- **Screen reader**: Test full navigation flow (VoiceOver/NVDA)
- **Mobile**: Test header hierarchy on small screens
- **Performance**: Verify no bundle size increase from schema

---

## Resources

- [WCAG 2.1 Headings Guideline](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html)
- [Schema.org SoftwareApplication](https://schema.org/SoftwareApplication)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Lighthouse SEO Audits](https://developer.chrome.com/docs/lighthouse/seo/)

---

**Last Updated**: 2025-11-07  
**Estimated Total Time**: ~4-6 hours across 4 weeks  
**Priority**: High (SEO/Accessibility impact)
