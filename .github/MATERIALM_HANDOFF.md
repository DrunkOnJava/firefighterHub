# MaterialM Implementation - Comprehensive Session Handoff

**Date Created:** November 5, 2025
**Session Duration:** Full day (CI/CD audit through MaterialM pilot)
**Next Session Goal:** Complete MaterialM redesign (8-week timeline, 40-60 hours)
**Status:** Phase 1 Foundation - Pilot created, awaiting full implementation approval

---

## CRITICAL CONTEXT: What Happened Today

### Session Overview
This was an extraordinarily productive session that:
1. Fixed critical CI/CD infrastructure issues
2. Merged 23 PRs (17 manual + 6 Copilot)
3. Resolved 65% of UI/UX audit issues
4. Implemented MaterialM pilot for design preview
5. Established foundation for full Material Design 3 migration

### PRs Merged (23 Total)

**CI/CD Infrastructure (3):**
- #42 - TypeScript/ESLint fixes (59 errors → 0)
- #52 - Copilot workflow fixes
- #53 - Quality pipeline refactor (single-build fan-out)

**Phase 2 - Visual Hierarchy (4) - 100% COMPLETE:**
- #43 - Calendar visual hierarchy
- #44 - Typography 1.25x scale
- #45 - Spacing standardization
- #46 - Color-blind indicators (●■◆)

**Phase 3 - Component Consistency (3) - 60%:**
- #47 - Icon sizes
- #48 - Elevation shadow system
- #51 - Border radius hierarchy

**Visual Refinements (4):**
- #65 - Teal-cyan accent (rejected)
- #66 - Subtle elevated event pills
- #67 - Event pill text size
- #68 - Thin shift badge borders

**Copilot Batch (6):**
- #64 - Phase 1 critical (focus rings + Tailwind migration)
- #60 - 44px touch targets (WCAG)
- #61 - Light mode WCAG fixes
- #56 - Empty state components
- #55 - Button micro-interactions
- #63 - Print stylesheet

**Documentation:**
- #69 - Session summary

**Closed (Conflicts):** #49, #50, #54, #57, #58, #59, #62 (7 PRs)

---

## CRITICAL FINDINGS FROM TODAY

### 1. False-Green PR Problem - SOLVED

**Root Cause:**
- Rulesets alone don't mark checks as "Required" in GitHub PR UI
- Classic branch protection was missing
- Quality checks had soft warnings instead of hard failures

**Solution Implemented:**
- Enabled classic branch protection via GitHub REST API
- Required checks: build, lint, typecheck (strict mode)
- Created quality pipeline with hard enforcement gates
- Eliminated duplicate workflow runs

**Proof of Fix:**
```bash
curl -L \
  -H "Authorization: Bearer $(gh auth token)" \
  https://api.github.com/repos/DrunkOnJava/firefighterHub/branches/main/protection/required_status_checks
```
Returns 3 required checks with strict mode enabled.

### 2. Quality Pipeline Architecture

**New Structure (in `.github/workflows/`):**
- `quality-reusable.yml` - Core logic (build → fan-out to 4 jobs)
- `quality-pr.yml` - Thin PR trigger
- `quality-main.yml` - Post-merge audit

**Hard Gates Implemented:**
- Design Token Validation: Fails on arbitrary values or <95% usage
- Accessibility: Fails on critical/serious axe violations
- Lighthouse: Requires 100% accessibility score
- VRT: Fails if avg pixel diff >1.0%

**Location:** All in `.github/workflows/`

### 3. Current Repository State

**Main Branch:** commit a319cf3 (print stylesheet)
**Code Quality:**
- TypeScript: 0 errors ✅
- ESLint: 0 errors, 4 warnings ✅
- Build: Passing (2.0-2.2s) ✅
- Tests: 405/445 passing (91% - 40 disabled due to React act() warnings)

**Deployment:**
- Production: https://firefighter-hub.vercel.app
- Status: Waiting for Vercel rate limit (hit after 12+ PRs today)
- Latest deployed: commit b40c45c (PR #51)
- Pending: commits #65-#69 (will deploy automatically in ~4-6 hours)

---

## MATERIALM MIGRATION: Current Status

### What We Started

**Discovery Phase Complete:**
1. Analyzed MaterialM.fig Figma file (180MB, 567 components, #2a303d background)
2. Found MaterialM React/Tailwind Pro template (coded implementation)
3. Extracted design system (OKLCH colors, Flowbite React theme)
4. Installed dependencies (flowbite, flowbite-react, @material-tailwind/react)
5. Created pilot components for visual preview

### Files Created

**1. `src/styles/colorSystemM3.ts`** (189 lines)
- Material Design 3 color system extracted from Figma
- Surface hierarchy (dim, base, bright, 5 container levels)
- Primary/secondary/tertiary color roles
- State layer opacities (hover: 8%, pressed: 12%)
- Motion tokens (emphasized easing, duration scale)
- Export: `colorsM3` object with all M3 tokens

**2. `src/utils/materialMTheme.ts`** (122 lines)
- Flowbite React theme configuration
- Adapted from MaterialM template's custom-theme.tsx
- Button, badge, card, modal, toast definitions
- OKLCH color palette (primary, secondary, semantic)
- Export: `materialMTheme` for Flowbite provider

**3. `src/components/MaterialMPilot.tsx`** (231 lines)
- Live preview component (bottom-right floating panel)
- Toggle between current and MaterialM designs
- Demos: Shift badges, buttons, cards, forms, button variants
- Import and add to App.tsx (line 23, line 445)
- State: `useMaterialM` boolean toggle

**4. `src/components/CalendarMaterialMPreview.tsx`** (130 lines)
- Full-screen calendar preview (MaterialM styling)
- Shows grid with sample days, holds, "today" indicator
- Flowbite Card wrapper with MaterialM colors
- Triggered when useMaterialM = true

**5. `docs/MATERIALM_IMPLEMENTATION_PLAN.md`** (186 lines)
- Complete 8-week implementation timeline
- Phase-by-phase breakdown
- Risk assessment
- OKLCH color documentation

**6. `docs/MATERIAL_DESIGN_3_MIGRATION.md`** (created but not finished)
- Migration guide placeholder

### Dependencies Installed

**Packages added to package.json:**
```json
"dependencies": {
  "flowbite": "^3.1.2",
  "flowbite-react": "^0.12.10",
  "@material-tailwind/react": "^2.1.10"
}
```

**Current bundle size:**
- Before: ~556KB (gzipped: 142KB)
- After: ~662KB (gzipped: 175KB)
- Increase: +106KB (33KB gzipped) - acceptable for full design system

---

## TECHNICAL DEEP DIVE: MaterialM System

### MaterialM Architecture (from template analysis)

**Source Location:** `/tmp/materialm-react-tailwind-pro-main/`

**Key Files Analyzed:**
1. `packages/default/src/css/theme/default-theme.css` (700+ lines)
   - OKLCH color definitions in CSS custom properties
   - 6 theme variants (BLUE, AQUA, PURPLE, GREEN, CYAN, ORANGE)
   - Shadow system (elevation1-4)
   - Border radius tokens (sm: 7px, md: 9px, lg: 24px)
   - Typography scale (13px-64px)

2. `packages/default/src/utils/theme/custom-theme.tsx` (740 lines)
   - Flowbite theme customization
   - Component-specific styling (buttons, cards, modals, tables, etc.)
   - Dark mode variants
   - State configurations (hover, active, disabled)

### OKLCH Color System Explained

**What is OKLCH:**
- Perceptually uniform color space (better than RGB/HSL)
- Syntax: `oklch(Lightness Chroma Hue / Alpha)`
- Example: `oklch(66.93% 0.224 247.87)` = MaterialM primary blue

**MaterialM Color Palette (from default-theme.css):**
```css
/* Backgrounds */
--dark: oklch(0.23 0.037 258.85)        /* #2a303d equivalent */
--darkgray: oklch(0.26 0.0374 260)

/* BLUE_THEME Primary */
--primary: oklch(66.93% 0.224 247.87)
--primary-emphasis: oklch(63.47% 0.213 247.92)
--lightprimary: oklch(66.93% 0.224 247.87 / 12.5%)

/* BLUE_THEME Secondary */
--secondary: oklch(58.25% 0.213 291.79)
--secondary-emphasis: oklch(55.04% 0.205 292.12)
--lightsecondary: oklch(58.25% 0.213 291.79 / 12.5%)

/* Semantic */
--info: oklch(0.78 0.1209 218.04)
--success: oklch(0.76 0.138061 180.4149)
--warning: oklch(0.83 0.1712 81.04)
--error: oklch(0.71 0.1892 5.4)

/* Light variants (12.5-18% opacity) */
--lightsuccess: oklch(0.76 0.138061 180.4149 / 14.51%)
--lighterror: oklch(0.71 0.1892 5.4 / 18.82%)
--lightinfo: oklch(0.78 0.1209 218.04 / 14.51%)
--lightwarning: oklch(0.83 0.1712 81.04 / 14.51%)
```

### Flowbite React Theme System

**How Flowbite Theming Works:**
```typescript
import { Flowbite } from "flowbite-react";
import { customTheme } from "./theme";

<Flowbite theme={{ theme: customTheme }}>
  <App />
</Flowbite>
```

**Customization Points:**
- button.color.* - Button color variants
- button.size.* - Size variants (xs, sm, md, lg, xl)
- card.root.base - Card base styling
- modal.content.inner - Modal container
- badge.root.color.* - Badge colors
- ...40+ component types

---

## IMPLEMENTATION PLAN: Detailed 8-Week Roadmap

### PHASE 1: Foundation (Week 1) - PARTIALLY COMPLETE

**Status:** ✅ Pilot created, ⏳ Full setup pending

**Completed:**
- [x] Analyzed MaterialM template structure
- [x] Extracted OKLCH color system
- [x] Installed Flowbite React
- [x] Created colorSystemM3.ts
- [x] Created materialMTheme.ts
- [x] Created pilot components
- [x] Added pilot to App.tsx

**Remaining Tasks:**

**1. Wrap App in Flowbite Provider** (30 min)
```typescript
// src/main.tsx
import { Flowbite } from "flowbite-react";
import { materialMTheme } from "./utils/materialMTheme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Flowbite theme={{ theme: materialMTheme }}>
      <App />
    </Flowbite>
  </React.StrictMode>
);
```

**2. Create Feature Flag Hook** (1 hour)
```typescript
// src/hooks/useFeatureFlag.ts
export function useFeatureFlag(flag: string): boolean {
  const [enabled, setEnabled] = useState(
    () => import.meta.env[`VITE_USE_${flag}`] === 'true' ||
          localStorage.getItem(`feature_${flag}`) === 'true'
  );

  return enabled;
}

// Usage
const useMaterialM = useFeatureFlag('MATERIALM');
```

**3. Add MaterialM CSS** (30 min)
Copy MaterialM's `default-theme.css` to `src/styles/materialM.css`:
```bash
cp /tmp/materialm-react-tailwind-pro-main/packages/default/src/css/theme/default-theme.css \
   src/styles/materialM.css
```

Import in main.tsx:
```typescript
import './styles/materialM.css';
```

**4. Extend Tailwind Config** (1 hour)
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // MaterialM OKLCH colors
        'materialm': {
          dark: '#2a303d',
          primary: '#5d87ff',
          secondary: '#764ba2',
          // ... map all OKLCH to hex for Tailwind
        }
      }
    }
  }
}
```

**5. Document Migration Guide** (2 hours)
Complete `docs/MATERIAL_DESIGN_3_MIGRATION.md` with:
- Component mapping (current → MaterialM)
- Color token migration
- Import statement changes
- Testing checklist

**Phase 1 Deliverables:**
- ✅ Flowbite provider wrapping app
- ✅ Feature flag infrastructure
- ✅ MaterialM CSS variables active
- ✅ Extended Tailwind config
- ✅ Complete migration documentation

**Effort:** 5-6 hours remaining
**Timeline:** Complete by end of Week 1

---

### PHASE 2: Component Wrappers (Week 2)

**Goal:** Create MaterialM wrapper components without breaking existing

**Tasks:**

**1. Create M3 Component Directory** (15 min)
```bash
mkdir -p src/components/m3
```

**2. Build Wrapper Components** (3-4 hours each)

**ButtonM3.tsx** (reference: MaterialM button implementation)
```typescript
import { Button as FlowbiteButton } from "flowbite-react";
import { materialMTheme } from "@/utils/materialMTheme";

interface ButtonM3Props {
  variant?: 'filled' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function ButtonM3({
  variant = 'filled',
  color = 'primary',
  size = 'md',
  ...props
}: ButtonM3Props) {
  // Map MaterialM variants to Flowbite props
  const flowbiteColor = color === 'error' ? 'failure' : color;
  const outline = variant === 'outlined';

  return (
    <FlowbiteButton
      color={flowbiteColor}
      size={size}
      outline={outline}
      {...props}
    />
  );
}
```

**CardM3.tsx** - Similar pattern for cards
**DialogM3.tsx** - Modal wrapper
**InputM3.tsx** - Form input wrapper
**BadgeM3.tsx** - Badge/chip wrapper

**3. Create Component Showcase** (2 hours)
```typescript
// src/views/ComponentShowcase.tsx
export function ComponentShowcase() {
  return (
    <div className="p-8 space-y-8">
      <section>
        <h2>Buttons</h2>
        <ButtonM3 variant="filled" color="primary">Primary</ButtonM3>
        <ButtonM3 variant="outlined" color="secondary">Secondary</ButtonM3>
        {/* ... all variants */}
      </section>
    </div>
  );
}
```

Access via: `http://localhost:5173/showcase` (add route)

**4. Create Conversion Utilities** (1 hour)
```typescript
// src/utils/m3Converter.ts
export function convertColorToM3(
  currentColor: string
): string {
  const colorMap = {
    'bg-slate-700': 'bg-materialm-dark',
    'text-slate-100': 'text-white',
    // ... complete mapping
  };
  return colorMap[currentColor] || currentColor;
}
```

**Phase 2 Deliverables:**
- 5-6 wrapper components in `src/components/m3/`
- Component showcase page
- Conversion utilities
- Component documentation

**Effort:** 12-15 hours
**Timeline:** Week 2

---

### PHASE 3: Pilot Component Migration (Week 3-4)

**Goal:** Migrate 5-7 low-risk components to validate approach

**Pilot Components Selected:**

**1. Toast.tsx** (Lowest risk - isolated)
```typescript
// Before
export function Toast({ message, type }: ToastProps) {
  return (
    <div className="bg-slate-700 text-slate-100 rounded-lg p-4">
      {message}
    </div>
  );
}

// After
import { Toast as FlowbiteToast } from "flowbite-react";

export function Toast({ message, type }: ToastProps) {
  const useM3 = useFeatureFlag('MATERIALM');

  if (!useM3) {
    return <ToastLegacy message={message} type={type} />;
  }

  return (
    <FlowbiteToast>
      <div className="text-sm">{message}</div>
    </FlowbiteToast>
  );
}
```

**2. ShiftBadge.tsx** (Low risk - already has shape indicators)
**3. EmptyState.tsx** (Low risk - stateless)
**4. MetricCard.tsx** (Medium risk - visual only)
**5. LoadingButton.tsx** (Medium risk - button variant)
**6. SkeletonLoader.tsx** (Low risk - animation)
**7. ConnectionStatusIndicator.tsx** (Low risk - status badge)

**Migration Pattern (for each component):**
1. Create `{Component}Legacy.tsx` copy of current
2. Update `{Component}.tsx` with feature flag check
3. Implement MaterialM version using Flowbite components
4. Update tests (both legacy and MaterialM paths)
5. Visual regression test (screenshot before/after)
6. Accessibility audit (axe-core)

**Testing Checklist Per Component:**
```bash
# TypeScript
pnpm typecheck

# Linting
pnpm lint

# Unit tests
pnpm test -- Component.test.tsx

# Visual regression
pnpm exec playwright test --config=playwright.vrt.config.ts

# Accessibility
pnpm exec axe http://localhost:5173

# Manual testing
# 1. Toggle feature flag on/off
# 2. Test in light/dark mode
# 3. Test keyboard navigation
# 4. Test screen reader (VoiceOver on Mac)
```

**Phase 3 Deliverables:**
- 5-7 migrated components with feature flags
- Before/after screenshots for each
- Updated test suite (all passing)
- Feedback document (what works, what doesn't)

**Effort:** 20-24 hours
**Timeline:** Weeks 3-4

---

### PHASE 4: Core Component Migration (Week 5-9)

**Goal:** Migrate all high-impact user-facing components

**Priority Order (15 components):**

**Tier 1: Navigation & Layout (Week 5)**
1. **Header.tsx** (src/components/Header.tsx - 224 lines)
   - Current: Dark slate with icon buttons
   - MaterialM: Flowbite Navbar with theme colors
   - Complexity: MEDIUM (logo, buttons, shift selector integration)
   - Dependencies: Button, Badge (shift selector)

2. **Sidebar.tsx** (src/components/Sidebar.tsx - 215 lines)
   - Current: Upcoming schedule panel
   - MaterialM: Flowbite Sidebar/Card hybrid
   - Complexity: LOW (mostly display logic)
   - Dependencies: Badge, Card

3. **MobileNav.tsx** (src/components/MobileNav.tsx - 147 lines)
   - Current: Slide-out mobile menu
   - MaterialM: Flowbite Drawer
   - Complexity: MEDIUM (animations, responsive)
   - Dependencies: Drawer, Button

**Tier 2: Calendar System (Week 6-7) - HIGHEST PRIORITY**
4. **Calendar.tsx** (src/components/Calendar.tsx - 184 lines)
   - Current: Custom grid with day cells
   - MaterialM: Keep grid, style with Flowbite Card
   - Complexity: HIGH (core feature, complex state)
   - Dependencies: DayCell, Card
   - **CRITICAL:** This is the most important component

5. **DayCell.tsx** (src/components/calendar/DayCell.tsx - 183 lines)
   - Current: Dark slate cells with event pills
   - MaterialM: Lighter background, Flowbite badges for pills
   - Complexity: MEDIUM (event rendering, hover states)
   - Dependencies: Badge
   - **File location:** src/components/calendar/DayCell.tsx

6. **DayModal.tsx** (src/components/calendar/DayModal.tsx - 253 lines)
   - Current: Custom modal for hold management
   - MaterialM: Flowbite Modal with form inputs
   - Complexity: HIGH (forms, validation, hold scheduling)
   - Dependencies: Modal, Button, TextInput, Datepicker

7. **CalendarHeader.tsx** (src/components/calendar/CalendarHeader.tsx - 89 lines)
   - Current: Month navigation, shift indicator
   - MaterialM: Flowbite card header pattern
   - Complexity: LOW (display only)
   - Dependencies: Button, Badge

**Tier 3: Modals & Forms (Week 8)**
8. **FirefightersModal.tsx** (src/components/FirefightersModal.tsx - 321 lines)
   - Current: Manage all firefighters
   - MaterialM: Flowbite Modal + Table
   - Complexity: HIGH (table, editing, form validation)
   - Dependencies: Modal, Table, TextInput, Button

9. **CompleteHoldModal.tsx** (src/components/CompleteHoldModal.tsx - 134 lines)
   - Current: Mark hold complete
   - MaterialM: Flowbite Modal + Select
   - Complexity: MEDIUM (dropdown, position selection)
   - Dependencies: Modal, Select, Button

10. **QuickAddFirefighterModal.tsx** (src/components/QuickAddFirefighterModal.tsx - 180 lines)
    - Current: Quick add form
    - MaterialM: Flowbite Modal + Form
    - Complexity: MEDIUM (form validation)
    - Dependencies: Modal, TextInput, Checkbox, Button

11. **TransferShiftModal.tsx** (src/components/TransferShiftModal.tsx - 92 lines)
    - Current: Shift transfer
    - MaterialM: Flowbite Modal + Select
    - Complexity: LOW (simple form)
    - Dependencies: Modal, Select, Button

**Tier 4: Display Components (Week 9)**
12. **FirefighterList.tsx** (src/components/FirefighterList.tsx - 298 lines)
    - Current: Draggable list
    - MaterialM: Flowbite Table/List
    - Complexity: HIGH (drag-and-drop, reordering)
    - Dependencies: Table, Button
    - **CAUTION:** Preserve drag-and-drop functionality

13. **ActivityLogModal.tsx** (src/components/ActivityLogModal.tsx - 106 lines)
    - Current: Activity history
    - MaterialM: Flowbite Modal + Timeline
    - Complexity: LOW (display only)
    - Dependencies: Modal, Timeline

14. **HelpModal.tsx** (src/components/HelpModal.tsx - 113 lines)
    - Current: Help documentation
    - MaterialM: Flowbite Modal + Accordion
    - Complexity: LOW (static content)
    - Dependencies: Modal, Accordion

15. **KeyboardShortcutsModal.tsx** (src/components/KeyboardShortcutsModal.tsx - 67 lines)
    - Current: Shortcuts table
    - MaterialM: Flowbite Modal + Table
    - Complexity: LOW (static table)
    - Dependencies: Modal, Table

**Migration Workflow (Per Component):**

```bash
# 1. Create feature branch
git checkout -b feat/materialm-{component-name}

# 2. Create legacy backup
cp src/components/Component.tsx src/components/ComponentLegacy.tsx

# 3. Update component with feature flag
# (Add useFeatureFlag, conditional rendering)

# 4. Implement MaterialM version
# (Use Flowbite components, apply theme)

# 5. Update tests
# Test both legacy and MaterialM paths

# 6. Visual regression test
pnpm exec playwright screenshot http://localhost:5173 \
  screenshots/before-{component}.png
# Toggle feature flag
pnpm exec playwright screenshot http://localhost:5173 \
  screenshots/after-{component}.png

# 7. Accessibility audit
pnpm exec axe http://localhost:5173 --tags wcag2aa

# 8. Create PR
gh pr create --title "feat(m3): migrate {Component} to MaterialM" \
  --body "Migrated to Flowbite/MaterialM with feature flag"

# 9. Wait for CI, review, merge
gh pr merge --squash --delete-branch

# 10. Update main, repeat for next component
git checkout main && git pull
```

**Phase 4 Deliverables:**
- 15 migrated components with feature flags
- Legacy versions preserved
- All tests passing (93+)
- Visual regression screenshots
- Accessibility audit reports

**Effort:** 35-40 hours
**Timeline:** Weeks 5-9

---

### PHASE 5: Testing & QA (Week 10)

**Comprehensive Testing:**

**1. Functional Testing** (4 hours)
- Test all user flows with MaterialM enabled
- Calendar: Create/edit/delete holds
- Roster: Add/remove/reorder firefighters
- Shift switching, dark mode toggle
- Mobile responsive (375px, 768px, 1920px)

**2. Accessibility Audit** (3 hours)
```bash
# Automated
pnpm exec axe http://localhost:5173 --tags wcag2a,wcag2aa,wcag21aa

# Manual
- Keyboard navigation (tab through all elements)
- Screen reader (VoiceOver: Cmd+F5)
- Color contrast (verify WCAG AA minimum)
- Touch targets (44px minimum on mobile)
```

**3. Performance Profiling** (2 hours)
```bash
# Lighthouse audit
pnpm exec lhci autorun

# React DevTools Profiler
# Record interaction, check for:
# - Components rendering >16ms
# - Unnecessary re-renders
# - Memory leaks

# Bundle analysis
pnpm exec vite-bundle-visualizer
```

**4. Cross-Browser Testing** (2 hours)
- Chrome (primary)
- Firefox
- Safari
- Mobile Safari (iOS)
- Mobile Chrome (Android)

**Acceptance Criteria:**
- [ ] All user flows working (no regressions)
- [ ] Lighthouse: Performance ≥90, Accessibility = 100
- [ ] Zero WCAG AA violations
- [ ] Bundle size <700KB gzipped
- [ ] All tests passing (93+ tests)
- [ ] No console errors

**Phase 5 Deliverables:**
- QA test report
- Accessibility compliance doc
- Performance benchmarks
- Cross-browser compatibility matrix

**Effort:** 11-13 hours
**Timeline:** Week 10

---

### PHASE 6: Production Rollout (Week 11-12)

**Gradual Rollout Strategy:**

**Week 11:**
- **Day 1:** 10% rollout (localStorage feature flag + random assignment)
- **Day 2:** Monitor for issues, collect feedback
- **Day 3:** 25% rollout
- **Day 4:** Monitor
- **Day 5:** 50% rollout
- **Day 6-7:** Collect extensive feedback

**Week 12:**
- **Day 1:** 75% rollout
- **Day 2:** Monitor
- **Day 3:** 100% rollout (full production)
- **Day 4-5:** Final monitoring, documentation

**Rollout Implementation:**

**1. Feature Flag with Percentage** (2 hours)
```typescript
// src/utils/rollout.ts
export function shouldUseMaterialM(userId: string): boolean {
  const rolloutPercentage = Number(import.meta.env.VITE_MATERIALM_ROLLOUT) || 0;

  // Admin override
  if (localStorage.getItem('feature_MATERIALM') === 'true') return true;

  // Percentage-based (deterministic)
  const hash = userId.split('').reduce((acc, char) =>
    acc + char.charCodeAt(0), 0
  );
  return (hash % 100) < rolloutPercentage;
}
```

**2. Environment Variables**
```bash
# .env.local (development)
VITE_USE_MATERIALM=false
VITE_MATERIALM_ROLLOUT=0

# Vercel (production)
# Day 1: VITE_MATERIALM_ROLLOUT=10
# Day 3: VITE_MATERIALM_ROLLOUT=25
# Day 5: VITE_MATERIALM_ROLLOUT=50
# Week 12 Day 1: VITE_MATERIALM_ROLLOUT=75
# Week 12 Day 3: VITE_MATERIALM_ROLLOUT=100
```

**3. Monitoring Setup** (3 hours)
- Error tracking (Sentry or console.error monitoring)
- Analytics (track MaterialM vs legacy usage)
- User feedback form (in-app survey)

**4. Rollback Plan**
```bash
# Instant rollback via Vercel env var
vercel env rm VITE_MATERIALM_ROLLOUT production
vercel --prod

# Or feature flag
localStorage.setItem('feature_MATERIALM', 'false')
location.reload()
```

**Rollback Triggers:**
- WCAG AA violations detected
- Performance regression >20%
- Critical bugs >5/day
- Core functionality broken

**Phase 6 Deliverables:**
- Gradual rollout complete
- User feedback report
- Production stability metrics
- Rollback procedures documented

**Effort:** 8-10 hours
**Timeline:** Weeks 11-12

---

### PHASE 7: Cleanup (Week 13)

**Goal:** Remove legacy system, finalize migration

**Tasks:**

**1. Remove Feature Flags** (2 hours)
```bash
# Find all feature flag usage
grep -r "useFeatureFlag.*MATERIALM" src/

# Remove conditional logic
# Replace: {useM3 ? <ComponentM3 /> : <ComponentLegacy />}
# With: <ComponentM3 />
```

**2. Archive Legacy Components** (1 hour)
```bash
mkdir -p src/components/legacy
mv src/components/*Legacy.tsx src/components/legacy/
```

**3. Clean Up Imports** (2 hours)
```bash
# Update all imports
# From: import { Button } from "./components/Button"
# To: import { ButtonM3 as Button } from "./components/m3/Button"

# Or rename files
mv src/components/m3/ButtonM3.tsx src/components/Button.tsx
```

**4. Remove Old Color System** (1 hour)
```bash
# Backup
mv src/styles/colorSystem.ts src/styles/colorSystemLegacy.ts

# Rename M3 to primary
mv src/styles/colorSystemM3.ts src/styles/colorSystem.ts

# Update imports throughout codebase
sed -i 's/colorSystemM3/colorSystem/g' src/**/*.tsx
```

**5. Final Documentation** (2 hours)
- Update CLAUDE.md with MaterialM patterns
- Create MATERIAL_DESIGN_3_GUIDE.md (usage for future devs)
- Update README.md with new screenshots
- Document component API changes

**Phase 7 Deliverables:**
- Clean codebase (single design system)
- Legacy components archived
- Complete documentation
- Updated README with MaterialM

**Effort:** 8-10 hours
**Timeline:** Week 13

---

## DETAILED TECHNICAL SPECIFICATIONS

### Color System Migration

**Current System (colorSystem.ts):**
```typescript
colors.structural.bg.card = "bg-[#3A4149]"
colors.structural.text.primary = "text-gray-100"
colors.semantic.primary.bg = "bg-blue-600"
```

**MaterialM System (colorSystemM3.ts):**
```typescript
colorsM3.surface.container = "#2a303d"      // OKLCH converted
colorsM3.neutral.onSurface = "#e5e7eb"
colorsM3.primary.primary = "oklch(66.93% 0.224 247.87)"
```

**Migration Strategy:**
1. Keep both systems in parallel (Phase 1-6)
2. Components check feature flag
3. Remove old system in Phase 7

### Component Architecture Changes

**Before (Example: Button):**
```typescript
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
  Click
</button>
```

**After (MaterialM):**
```typescript
import { Button } from "flowbite-react";

<Button color="blue" size="md">
  Click
</Button>
```

**Styling Override:**
```typescript
// Via theme
import { materialMTheme } from "@/utils/materialMTheme";

// Custom classes still work
<Button className="custom-class" color="blue" size="md">
  Click
</Button>
```

### State Management (No Changes)

**Important:** MaterialM migration is **purely visual**.
**No changes to:**
- Supabase integration (useFirefighters, useScheduledHolds hooks)
- State management (React hooks, contexts)
- Business logic (rotation logic, hold completion)
- Database schema
- API endpoints

**Affected:**
- Component rendering (JSX)
- CSS classes
- Theme context (dark mode still works)

---

## CRITICAL FILES REFERENCE

### Files to Understand

**1. Current Color System:**
- `src/styles/colorSystem.ts` (190 lines) - Current design tokens
- `src/styles/tokens.ts` (346 lines) - Spacing, typography, shadows
- `src/utils/theme.ts` (95 lines) - Dark mode utilities

**2. MaterialM System (New):**
- `src/styles/colorSystemM3.ts` (189 lines) - M3 color tokens
- `src/utils/materialMTheme.ts` (122 lines) - Flowbite theme config
- `src/styles/materialM.css` (TODO: copy from MaterialM template)

**3. Pilot Components:**
- `src/components/MaterialMPilot.tsx` (231 lines) - Preview panel
- `src/components/CalendarMaterialMPreview.tsx` (130 lines) - Calendar mockup

**4. Main App:**
- `src/App.tsx` (451 lines) - Add lines 23, 445 for MaterialMPilot
- `src/main.tsx` (TODO: wrap in Flowbite provider)

### MaterialM Template Reference

**Location:** `/tmp/materialm-react-tailwind-pro-main/`

**Key Reference Files:**
- `packages/default/src/css/theme/default-theme.css` - Complete CSS variables
- `packages/default/src/utils/theme/custom-theme.tsx` - Flowbite config (740 lines!)
- `packages/default/src/components/apps/calendar/index.tsx` - Calendar implementation
- `packages/default/tailwind.config.js` - Tailwind extensions

**To Copy:**
1. CSS theme variables → `src/styles/materialM.css`
2. Flowbite theme object → Enhance `src/utils/materialMTheme.ts`
3. Component patterns → Reference for each migration

---

## COMMANDS & SCRIPTS

### Development Workflow

**Start dev server:**
```bash
pnpm dev
# Runs on http://localhost:5173 (or 5174 if 5173 in use)
```

**Build:**
```bash
pnpm build
# Output: dist/ (2.30 kB HTML, ~80KB CSS, ~660KB JS)
```

**Type checking:**
```bash
pnpm typecheck
# Must have 0 errors before committing
```

**Linting:**
```bash
pnpm lint
# 0 errors acceptable, <8 warnings acceptable
```

**Testing:**
```bash
pnpm test:run          # All tests
pnpm test:coverage     # With coverage report
pnpm test:e2e          # Playwright E2E tests
```

### MaterialM Pilot Control

**Toggle MaterialM preview:**
```typescript
// In browser console
localStorage.setItem('feature_MATERIALM', 'true')
location.reload()
```

**Or use the UI:**
- Click "Toggle" button in bottom-right panel
- Switch between "Current" and "MaterialM"

### Git Workflow

**Feature branch pattern:**
```bash
git checkout -b feat/materialm-{component-name}
git add .
git commit -m "feat(m3): migrate {Component} to MaterialM

- Implemented Flowbite {Component} wrapper
- Added feature flag for gradual rollout
- Preserved legacy version
- Updated tests

Co-Authored-By: Claude <noreply@anthropic.com>"
git push -u origin feat/materialm-{component-name}
gh pr create --title "feat(m3): migrate {Component} to MaterialM"
```

---

## TESTING STRATEGY

### Automated Testing

**Unit Tests (Vitest):**
```typescript
describe('ButtonM3', () => {
  it('renders with MaterialM styles when feature flag enabled', () => {
    vi.mock('../hooks/useFeatureFlag', () => ({
      useFeatureFlag: () => true
    }));

    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('flowbite-button');
  });

  it('renders legacy styles when feature flag disabled', () => {
    vi.mock('../hooks/useFeatureFlag', () => ({
      useFeatureFlag: () => false
    }));

    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).not.toHaveClass('flowbite-button');
  });
});
```

**Visual Regression (Playwright):**
```typescript
// tests/vrt/materialm.spec.ts
test('Calendar with MaterialM', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.evaluate(() => {
    localStorage.setItem('feature_MATERIALM', 'true');
  });
  await page.reload();
  await expect(page).toHaveScreenshot('calendar-materialm.png');
});
```

**Accessibility (axe-core):**
```bash
pnpm exec axe http://localhost:5173 \
  --tags wcag2a,wcag2aa,wcag21aa \
  --stdout > a11y-report.json
```

### Manual Testing Checklist

**For Each Component Migration:**
- [ ] Feature flag ON: Component renders with MaterialM
- [ ] Feature flag OFF: Component renders with legacy
- [ ] Dark mode works in both versions
- [ ] Light mode works in both versions
- [ ] Keyboard navigation functional
- [ ] Screen reader announces correctly
- [ ] Hover states work
- [ ] Focus indicators visible
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Data updates correctly (if interactive)

---

## RISK MITIGATION

### Technical Risks

**Risk 1: Bundle Size**
- **Concern:** Flowbite + Material Tailwind = large bundle
- **Current:** 662KB (175KB gzipped)
- **Mitigation:**
  - Code splitting (`React.lazy()`)
  - Tree-shaking (import only needed components)
  - CDN for Flowbite CSS
- **Monitor:** Bundle size must stay <800KB

**Risk 2: Performance Regression**
- **Concern:** Extra wrapping, theme context overhead
- **Mitigation:**
  - React.memo() on MaterialM components
  - useMemo() for theme computations
  - Lazy load non-critical components
- **Monitor:** Lighthouse performance ≥90

**Risk 3: Breaking Changes**
- **Concern:** Flowbite components have different APIs
- **Mitigation:**
  - Feature flags for instant rollback
  - Preserve legacy components
  - Comprehensive testing before rollout
- **Monitor:** User-reported bugs

### User Experience Risks

**Risk 4: User Confusion**
- **Concern:** Visual changes may disorient users
- **Mitigation:**
  - Gradual rollout (10% → 100%)
  - In-app announcement
  - Help documentation updated
  - Allow toggle back to legacy (admin setting)
- **Monitor:** User feedback, help requests

---

## DEPENDENCIES & VERSIONS

**Installed (package.json):**
```json
{
  "dependencies": {
    "flowbite": "^3.1.2",
    "flowbite-react": "^0.12.10",
    "@material-tailwind/react": "^2.1.10"
  }
}
```

**Peer Dependencies (Already installed):**
- react: ^18.3.1
- react-dom: ^18.3.1
- tailwindcss: ^3.4.18

**Optional (for full MaterialM parity):**
- react-big-calendar: ^1.17.1 (if switching to MaterialM calendar component)
- moment: ^2.30.1 (for react-big-calendar)

---

## NEXT SESSION: IMMEDIATE ACTIONS

**When you start the next session, do this FIRST:**

### 1. Review This Document (15 min)
Read entire handoff to understand context.

### 2. Check Current State (5 min)
```bash
cd /Users/griffin/Projects/firefighterHub
git status
git log --oneline -10
pnpm dev
```

Verify:
- Main branch is clean
- Dev server starts successfully
- MaterialMPilot appears in bottom-right

### 3. User Decision Point (5 min)
Ask user to review MaterialM pilot:
- "Do you like the Flowbite/MaterialM design direction?"
- "Should we proceed with full implementation?"
- "Any changes to pilot before committing?"

### 4. If Approved, Begin Week 1 Tasks (4-5 hours)

**Task 1: Wrap App in Flowbite Provider**
```typescript
// Edit src/main.tsx
import { Flowbite } from "flowbite-react";
import { materialMTheme } from "./utils/materialMTheme";
import './styles/materialM.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Flowbite theme={{ theme: materialMTheme }}>
      <App />
    </Flowbite>
  </React.StrictMode>
);
```

**Task 2: Copy MaterialM CSS**
```bash
cp /tmp/materialm-react-tailwind-pro-main/materialM-react-tailwind-pro-main/packages/default/src/css/theme/default-theme.css \
   src/styles/materialM.css
```

**Task 3: Create useFeatureFlag Hook**
```typescript
// Create src/hooks/useFeatureFlag.ts
export function useFeatureFlag(flag: string): boolean {
  const [enabled, setEnabled] = useState(
    () => import.meta.env[`VITE_USE_${flag}`] === 'true' ||
          localStorage.getItem(`feature_${flag}`) === 'true'
  );

  const toggle = () => {
    const newValue = !enabled;
    localStorage.setItem(`feature_${flag}`, String(newValue));
    setEnabled(newValue);
  };

  return enabled;
}
```

**Task 4: Extend Tailwind Config**
Add OKLCH colors from MaterialM to `tailwind.config.js`.

**Task 5: Complete Migration Documentation**
Finish `docs/MATERIAL_DESIGN_3_MIGRATION.md`.

### 5. Week 1 Completion Criteria

By end of Week 1, you should have:
- [ ] Flowbite provider wrapping app
- [ ] Feature flag system working
- [ ] MaterialM CSS variables active
- [ ] Tailwind config extended
- [ ] Migration documentation complete
- [ ] Zero breaking changes (everything still works)

**Then proceed to Week 2 (Component Wrappers).**

---

## IMPORTANT NOTES & GOTCHAS

### 1. Don't Break Production

**RULE:** Every commit must pass CI and not break existing functionality.

**How:**
- Always use feature flags
- Never remove legacy code until Phase 7
- Test both MaterialM=on and MaterialM=off states
- Run full test suite before committing

### 2. Flowbite Component Naming

**Flowbite uses different prop names:**
- `color="failure"` (not `color="error"`)
- `sizing="md"` (not `size="md"` for some components)
- `outline={true}` (for outline variants)

**Always check:**
- Flowbite docs: https://flowbite-react.com/
- MaterialM template for examples

### 3. Dark Mode Integration

**Flowbite dark mode works via:**
```html
<html class="dark">
```

**Current system:**
```typescript
const { isDarkMode, toggleDarkMode } = useDarkMode();
// Sets `dark` class on document.documentElement
```

**They're compatible!** No changes needed to dark mode system.

### 4. OKLCH Color Support

**Modern browsers support OKLCH** (Chrome 111+, Safari 15.4+).

**Fallback for older browsers:**
```css
background-color: #5d87ff;  /* Hex fallback */
background-color: oklch(66.93% 0.224 247.87);  /* OKLCH */
```

MaterialM template already includes fallbacks.

### 5. Accessibility Must Not Regress

**Current WCAG Compliance:**
- Color-blind indicators (●■◆) - WCAG 1.4.1 ✅
- Focus rings (7.2:1 contrast) - WCAG AAA ✅
- Touch targets (44px minimum) - WCAG 2.1 AA ✅
- Light mode contrast fixed - WCAG AA ✅

**MaterialM Migration Must Maintain:**
- All shape indicators on shift badges
- Focus ring system (may need to adapt for Flowbite)
- Touch target sizes
- Color contrast ratios

**Before merging any component:**
```bash
pnpm exec axe http://localhost:5173 --tags wcag2aa
# Must have 0 violations
```

---

## QUESTIONS & DECISION LOG

### Decisions Made (November 5, 2025)

**Q: Which Material Design library?**
**A:** Flowbite React (MaterialM's proven choice)

**Q: Migration strategy?**
**A:** Feature flags + gradual rollout (zero breaking changes)

**Q: Timeline?**
**A:** 8 weeks (vs original 20-week custom implementation)

**Q: Color theme?**
**A:** BLUE_THEME (primary: oklch(66.93% 0.224 247.87))

**Q: Pilot components?**
**A:** Created MaterialMPilot.tsx with toggle preview

**Q: Keep current event pill design?**
**A:** YES - User approved subtle elevated cards with blue left border

**Q: Keep shape indicators?**
**A:** YES - WCAG 1.4.1 compliance required (●■◆)

### Pending Decisions (Next Session)

**Q: Proceed with full MaterialM implementation?**
**A:** User said "Option 1" but needs to review pilot first

**Q: Keep current calendar architecture or switch to react-big-calendar?**
**A:** TBD - Current calendar is custom, MaterialM uses react-big-calendar

**Q: Dark mode vs light mode default?**
**A:** TBD - Current defaults to dark, MaterialM supports both

**Q: Remove MaterialM pilot after migration?**
**A:** TBD - Could keep for A/B testing or remove

---

## FILE STRUCTURE OVERVIEW

```
firefighterHub/
├── .github/
│   ├── workflows/
│   │   ├── ci-core.yml               # 3 required checks (build, lint, typecheck)
│   │   ├── quality-reusable.yml      # NEW: Single-build fan-out
│   │   ├── quality-pr.yml            # NEW: PR quality trigger
│   │   └── quality-main.yml          # NEW: Main branch quality audit
│   ├── MATERIALM_HANDOFF.md          # THIS FILE
│   ├── FINAL_SESSION_SUMMARY.md      # Today's session summary
│   └── CI_ENFORCEMENT_FIXES.md       # CI/CD problem analysis
├── docs/
│   ├── MATERIALM_IMPLEMENTATION_PLAN.md  # 8-week plan
│   ├── MATERIAL_DESIGN_3_MIGRATION.md    # Migration guide (incomplete)
│   ├── FOCUS_RING_SYSTEM.md              # From PR #64
│   ├── LIGHT_MODE_WCAG_AUDIT.md          # From PR #61
│   └── TOUCH_TARGET_AUDIT.md             # From PR #60
├── src/
│   ├── components/
│   │   ├── MaterialMPilot.tsx        # NEW: Pilot preview panel
│   │   ├── CalendarMaterialMPreview.tsx  # NEW: Calendar mockup
│   │   ├── m3/ (TODO)                # MaterialM wrappers go here
│   │   ├── Calendar.tsx              # TARGET: Migrate in Week 6-7
│   │   ├── calendar/
│   │   │   └── DayCell.tsx           # TARGET: Migrate in Week 6-7
│   │   └── ... (40 components total)
│   ├── styles/
│   │   ├── colorSystem.ts            # Current design tokens
│   │   ├── colorSystemM3.ts          # NEW: Material Design 3 tokens
│   │   ├── tokens.ts                 # Current spacing/typography
│   │   └── materialM.css (TODO)      # Copy from MaterialM template
│   ├── utils/
│   │   ├── materialMTheme.ts         # NEW: Flowbite theme config
│   │   └── theme.ts                  # Current dark mode utils
│   ├── hooks/
│   │   └── useFeatureFlag.ts (TODO)  # Feature flag hook
│   └── App.tsx                       # Modified: line 23, 445
├── package.json                       # Updated: +3 dependencies
└── tailwind.config.js (TODO)          # Extend with OKLCH colors
```

---

## COMMUNICATION GUIDELINES

### With User

**Always clarify before:**
- Making breaking changes
- Changing core functionality
- Removing existing features
- Major visual overhauls

**Keep user informed:**
- Progress updates every 2-3 hours of work
- Screenshots of visual changes
- Before/after comparisons
- Test results

### Code Quality Standards

**Every commit must:**
- Pass TypeScript compilation (0 errors)
- Pass ESLint (<8 warnings)
- Pass build
- Pass existing tests
- Include descriptive commit message
- Reference issue/PR numbers

**PR Standards:**
- Clear title with conventional commit format
- Comprehensive description
- Screenshots for visual changes
- Test plan included
- Breaking changes noted
- Co-authored by Claude

---

## EMERGENCY PROCEDURES

### If Something Breaks

**1. Check what changed:**
```bash
git log -1 --stat
git diff HEAD~1
```

**2. Revert if needed:**
```bash
git revert HEAD
git push origin main
```

**3. Disable feature flag:**
```typescript
// In browser console
localStorage.setItem('feature_MATERIALM', 'false')
location.reload()
```

**4. Check CI/CD:**
```bash
gh run list --limit 5
gh pr checks <number>
```

### If Copilot PRs Get Stuck

**Workflow approval required:**
- Open PR in browser
- Click "Approve and run" for workflows
- Cannot be done via API (security restriction)

**If conflicts:**
```bash
gh pr close <number> --comment "Closing due to conflicts. Will recreate."
gh issue reopen <issue-number>
```

Copilot will automatically create new PR.

---

## SUCCESS METRICS

### Phase 1 (Week 1) Success Criteria
- [ ] Flowbite provider active
- [ ] Feature flag system working
- [ ] MaterialM CSS loaded
- [ ] Tailwind config extended
- [ ] Documentation complete
- [ ] Dev server shows toggle working
- [ ] Zero breaking changes
- [ ] All existing tests passing

### Full Migration Success Criteria
- [ ] All 15 core components migrated
- [ ] Feature flag enables MaterialM across entire app
- [ ] Lighthouse: Performance ≥90, Accessibility = 100
- [ ] Bundle size <800KB
- [ ] All 93+ tests passing (both legacy and MaterialM paths)
- [ ] Zero WCAG AA violations
- [ ] User feedback >80% positive
- [ ] Production stable (no critical bugs)

---

## REFERENCE LINKS & RESOURCES

### Documentation
- **Flowbite React:** https://flowbite-react.com/
- **Material Design 3:** https://m3.material.io/
- **OKLCH Color:** https://oklch.com/
- **Tailwind CSS:** https://tailwindcss.com/docs

### Internal Docs (Created Today)
- `.github/FINAL_SESSION_SUMMARY.md` - Complete session recap
- `.github/CI_ENFORCEMENT_FIXES.md` - CI/CD problem analysis
- `.github/BRANCH_PROTECTION_SETUP.md` - Branch protection guide
- `docs/MATERIALM_IMPLEMENTATION_PLAN.md` - 8-week timeline
- `docs/FOCUS_RING_SYSTEM.md` - Focus indicator system (PR #64)
- `docs/LIGHT_MODE_WCAG_AUDIT.md` - Light mode fixes (PR #61)
- `docs/TOUCH_TARGET_AUDIT.md` - Touch target compliance (PR #60)

### Template Source
- **Local:** `/tmp/materialm-react-tailwind-pro-main/`
- **Package:** `packages/default/` (main template variant)
- **Key Files:**
  - `src/css/theme/default-theme.css` (700 lines CSS variables)
  - `src/utils/theme/custom-theme.tsx` (740 lines Flowbite config)
  - `src/components/apps/calendar/` (calendar implementation)

---

## FINAL HANDOFF CHECKLIST

**Before starting next session, verify:**
- [ ] This handoff document read completely
- [ ] Repository cloned and up to date
- [ ] All dependencies installed (`pnpm install`)
- [ ] Dev server runs (`pnpm dev`)
- [ ] MaterialM pilot visible in browser
- [ ] User has approved MaterialM direction
- [ ] Week 1 tasks clearly understood
- [ ] Questions answered or noted

**First action items:**
1. Show user the MaterialMPilot toggle functionality
2. Get explicit approval for full implementation
3. If approved: Begin Week 1 Task 1 (Flowbite provider)
4. If not approved: Remove pilot and revert changes

---

## TIMELINE SUMMARY (8 Weeks Total)

| Week | Phase | Focus | Hours | Status |
|------|-------|-------|-------|--------|
| 1 | Foundation | Setup, CSS, flags | 5-6 | ⏳ 60% complete |
| 2 | Wrappers | Build M3 components | 12-15 | ⏳ Pending |
| 3-4 | Pilot | Migrate 5-7 components | 20-24 | ⏳ Pending |
| 5 | Core (Nav) | Header, Sidebar, Mobile | 12-15 | ⏳ Pending |
| 6-7 | Core (Calendar) | Calendar, DayCell, Modals | 18-20 | ⏳ Pending |
| 8 | Core (Forms) | Firefighter modals, forms | 12-15 | ⏳ Pending |
| 9 | Core (Display) | Lists, activity, help | 10-12 | ⏳ Pending |
| 10 | QA | Testing, audit, profiling | 11-13 | ⏳ Pending |
| 11-12 | Rollout | Production deployment | 8-10 | ⏳ Pending |
| 13 | Cleanup | Remove legacy, docs | 8-10 | ⏳ Pending |

**Total Effort:** 116-150 hours (reduced from original 128-162)
**Total Duration:** 13 weeks (reduced from original 20)

---

**This handoff provides everything needed to continue the MaterialM implementation with full context and detailed next steps.**

**Last Updated:** November 5, 2025 15:30 PST
**Created By:** Claude Code (Senior Engineering Session)
**For:** Next Claude Code Session - MaterialM Implementation
