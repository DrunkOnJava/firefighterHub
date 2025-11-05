# Material Design 3 Migration Guide

**Last Updated:** November 5, 2025
**Status:** Phase 1 Complete - Ready for Component Migration
**Target Completion:** Week 13 (8-week implementation timeline)

---

## Table of Contents

1. [Overview](#overview)
2. [Current Status](#current-status)
3. [Component Migration Pattern](#component-migration-pattern)
4. [Color System Migration](#color-system-migration)
5. [Component Reference](#component-reference)
6. [Feature Flag System](#feature-flag-system)
7. [Testing Checklist](#testing-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### What is MaterialM?

MaterialM is a React/Tailwind Pro template that implements Material Design 3 (M3) principles using:

- **Component Library:** Flowbite React
- **Color System:** OKLCH (perceptually uniform color space)
- **Theming:** CSS custom properties + Flowbite theme configuration
- **Design System:** Material Design 3 (m3.material.io)

### Why Migrate?

**Benefits:**
- ✅ Modern, professional design system
- ✅ Better accessibility (M3 built-in)
- ✅ Consistent component patterns
- ✅ Reduced custom CSS maintenance
- ✅ Dark mode optimized
- ✅ Mobile-first responsive design

**Safety Measures:**
- ✅ Feature flags prevent breaking changes
- ✅ Legacy components preserved
- ✅ Gradual rollout (10% → 100%)
- ✅ Instant rollback capability

---

## Current Status

### ✅ Phase 1 Complete (Week 1)

**Infrastructure:**
- [x] Flowbite React provider wrapping App
- [x] MaterialM CSS variables loaded
- [x] Feature flag system created
- [x] Tailwind config extended
- [x] Color system documentation

**Files Created:**
- `src/main.tsx` - Flowbite provider integration
- `src/styles/materialM.css` - OKLCH color variables
- `src/hooks/useFeatureFlag.ts` - Feature flag system
- `src/styles/colorSystemM3.ts` - M3 color tokens
- `src/utils/materialMTheme.ts` - Flowbite theme config
- `tailwind.config.js` - Extended with MaterialM colors

**Pilot Components:**
- `src/components/MaterialMPilot.tsx` - Live preview panel
- `src/components/CalendarMaterialMPreview.tsx` - Calendar mockup

### ⏳ Next Steps (Week 2+)

**Week 2:** Build reusable MaterialM wrapper components
**Week 3-4:** Migrate 5-7 pilot components
**Week 5-9:** Migrate 15 core components
**Week 10:** Comprehensive QA
**Week 11-12:** Production rollout
**Week 13:** Cleanup and finalize

---

## Component Migration Pattern

### Standard Migration Workflow

**For each component:**

#### 1. Create Feature Branch
```bash
git checkout -b feat/materialm-{component-name}
```

#### 2. Preserve Legacy Version
```bash
cp src/components/Component.tsx src/components/ComponentLegacy.tsx
```

#### 3. Add Feature Flag Check

```typescript
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { ComponentLegacy } from './ComponentLegacy';

export function Component(props: ComponentProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <ComponentLegacy {...props} />;
  }

  // MaterialM implementation below
  return (
    <FlowbiteComponent>
      {/* ... */}
    </FlowbiteComponent>
  );
}
```

#### 4. Implement MaterialM Version

```typescript
import { Button, Card, Modal } from 'flowbite-react';

export function Component({ title, onSubmit }: ComponentProps) {
  return (
    <Card>
      <h5 className="text-lg font-semibold">{title}</h5>
      <Button color="blue" onClick={onSubmit}>
        Submit
      </Button>
    </Card>
  );
}
```

#### 5. Update Tests

```typescript
describe('Component', () => {
  it('renders MaterialM version when feature flag enabled', () => {
    vi.mock('@/hooks/useFeatureFlag', () => ({
      useFeatureFlag: () => true,
    }));

    render(<Component title="Test" />);
    expect(screen.getByRole('button')).toHaveClass('flowbite-button');
  });

  it('renders legacy version when feature flag disabled', () => {
    vi.mock('@/hooks/useFeatureFlag', () => ({
      useFeatureFlag: () => false,
    }));

    render(<Component title="Test" />);
    expect(screen.getByRole('button')).not.toHaveClass('flowbite-button');
  });
});
```

#### 6. Visual Regression Test

```bash
# Before
pnpm exec playwright screenshot http://localhost:5173 \
  screenshots/before-{component}.png

# Toggle feature flag
localStorage.setItem('feature_MATERIALM', 'true')

# After
pnpm exec playwright screenshot http://localhost:5173 \
  screenshots/after-{component}.png
```

#### 7. Create Pull Request

```bash
git add .
git commit -m "feat(m3): migrate {Component} to MaterialM

- Implemented Flowbite {Component} wrapper
- Added feature flag for gradual rollout
- Preserved legacy version
- Updated tests

Co-Authored-By: Claude <noreply@anthropic.com>"

gh pr create --title "feat(m3): migrate {Component} to MaterialM"
```

---

## Color System Migration

### OKLCH vs Hex Colors

**Current System (Hex):**
```typescript
colors.structural.bg.card = "bg-[#3A4149]"
colors.semantic.primary.bg = "bg-blue-600"
```

**MaterialM System (OKLCH):**
```css
/* CSS Custom Properties */
--dark: oklch(0.23 0.037 258.85);
--primary: oklch(66.93% 0.224 247.87);
```

```typescript
// Tailwind Classes (hex approximation)
className="bg-materialm-dark"
className="bg-materialm-primary"
```

### Color Mapping Reference

| Current | MaterialM Tailwind | OKLCH Variable |
|---------|-------------------|----------------|
| `bg-slate-700` | `bg-materialm-dark` | `var(--dark)` |
| `bg-slate-800` | `bg-materialm-dark` | `var(--dark)` |
| `text-slate-100` | `text-gray-100` | (unchanged) |
| `bg-blue-600` | `bg-materialm-primary` | `var(--primary)` |
| `bg-emerald-600` | `bg-materialm-success` | `var(--success)` |
| `bg-red-600` | `bg-materialm-error` | `var(--error)` |
| `border-slate-600` | `border-materialm-border-dark` | `var(--darkborder)` |

### Using OKLCH Colors

**Option 1: CSS Custom Properties (Recommended)**
```tsx
<div style={{ backgroundColor: 'var(--primary)' }}>
  MaterialM Primary Color
</div>
```

**Option 2: Tailwind Classes (Convenience)**
```tsx
<div className="bg-materialm-primary">
  MaterialM Primary Color
</div>
```

**Option 3: Flowbite Props (Best for Flowbite Components)**
```tsx
<Button color="blue">
  MaterialM Styled Button
</Button>
```

---

## Component Reference

### Flowbite Components Available

#### Buttons
```tsx
import { Button } from 'flowbite-react';

<Button color="blue" size="md">Primary</Button>
<Button color="failure" size="md">Error</Button>
<Button color="gray" outline>Cancel</Button>
```

**Props:**
- `color`: `blue`, `gray`, `success`, `failure`, `warning`, `info`
- `size`: `xs`, `sm`, `md`, `lg`, `xl`
- `outline`: boolean (outline variant)
- `pill`: boolean (rounded)

#### Badges
```tsx
import { Badge } from 'flowbite-react';

<Badge color="success">● A</Badge>
<Badge color="failure">■ B</Badge>
<Badge color="info">◆ C</Badge>
```

**Props:**
- `color`: Same as Button
- `size`: `xs`, `sm`

#### Cards
```tsx
import { Card } from 'flowbite-react';

<Card>
  <h5 className="text-xl font-bold">Title</h5>
  <p className="text-gray-700 dark:text-gray-400">Content</p>
</Card>
```

#### Modals
```tsx
import { Modal, Button } from 'flowbite-react';

<Modal show={showModal} onClose={() => setShowModal(false)}>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>
    <p>Modal content...</p>
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={handleSubmit}>Submit</Button>
    <Button color="gray" onClick={() => setShowModal(false)}>
      Cancel
    </Button>
  </Modal.Footer>
</Modal>
```

#### Form Inputs
```tsx
import { Label, TextInput, Select, Checkbox } from 'flowbite-react';

<div>
  <Label htmlFor="name">Name</Label>
  <TextInput
    id="name"
    type="text"
    placeholder="Enter name..."
    sizing="md"
  />
</div>

<Select id="shift">
  <option>A</option>
  <option>B</option>
  <option>C</option>
</Select>

<Checkbox id="active" label="Is Active" />
```

#### Tables
```tsx
import { Table } from 'flowbite-react';

<Table>
  <Table.Head>
    <Table.HeadCell>Name</Table.HeadCell>
    <Table.HeadCell>Station</Table.HeadCell>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>John Doe</Table.Cell>
      <Table.Cell>#5</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Component API Differences

**Current Button:**
```tsx
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
  Click
</button>
```

**Flowbite Button:**
```tsx
<Button color="blue" size="md">
  Click
</Button>
```

**Current Modal:**
```tsx
<div className="fixed inset-0 z-50 bg-black/50">
  <div className="bg-slate-800 rounded-lg p-6">
    <h2>Title</h2>
    {/* ... */}
  </div>
</div>
```

**Flowbite Modal:**
```tsx
<Modal show={true} onClose={handleClose}>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>{/* ... */}</Modal.Body>
</Modal>
```

---

## Feature Flag System

### Enabling MaterialM

**Development (localhost):**
```bash
# Via environment variable
VITE_USE_MATERIALM=true pnpm dev

# Via browser console
localStorage.setItem('feature_MATERIALM', 'true')
location.reload()
```

**Production (Vercel):**
```bash
# Full rollout
vercel env add VITE_USE_MATERIALM production
# Enter: true

# Gradual rollout (percentage-based)
vercel env add VITE_MATERIALM_ROLLOUT production
# Enter: 25  (25% of users)
```

### Feature Flag Hooks

**Basic Usage:**
```typescript
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

function MyComponent() {
  const useMaterialM = useFeatureFlag('MATERIALM');

  return useMaterialM ? <MaterialMVersion /> : <LegacyVersion />;
}
```

**With Toggle:**
```typescript
import { useFeatureFlagWithToggle } from '@/hooks/useFeatureFlag';

function AdminPanel() {
  const [useMaterialM, toggleMaterialM] = useFeatureFlagWithToggle('MATERIALM');

  return (
    <button onClick={toggleMaterialM}>
      {useMaterialM ? 'Disable' : 'Enable'} MaterialM
    </button>
  );
}
```

**Percentage Rollout:**
```typescript
import { useRolloutFlag } from '@/hooks/useFeatureFlag';

function App() {
  const { user } = useAuth();
  const useMaterialM = useRolloutFlag('MATERIALM', user?.id || 'anonymous');

  // Admin can still override via localStorage
}
```

---

## Testing Checklist

### Per-Component Testing

**Functional Testing:**
- [ ] Component renders without errors
- [ ] All interactive elements work (buttons, inputs, etc.)
- [ ] Data updates correctly
- [ ] Error states handled properly
- [ ] Loading states displayed
- [ ] Feature flag toggle works (MaterialM ↔ Legacy)

**Visual Testing:**
- [ ] Matches MaterialM design
- [ ] Dark mode looks correct
- [ ] Light mode looks correct
- [ ] Hover states work
- [ ] Focus indicators visible (WCAG)
- [ ] Mobile responsive (375px, 768px, 1920px)

**Accessibility Testing:**
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 graphics)
- [ ] Focus visible (2:1 contrast ratio)
- [ ] Touch targets ≥44px on mobile
- [ ] No ARIA violations (axe-core)

**Performance Testing:**
- [ ] No memory leaks
- [ ] Render time <16ms (60fps)
- [ ] Bundle size increase acceptable (<100KB)

### Automated Testing

**Unit Tests:**
```bash
pnpm test:run
# Must pass: 93+ tests
```

**E2E Tests:**
```bash
pnpm test:e2e
# Must pass: All critical user flows
```

**Accessibility Audit:**
```bash
pnpm exec axe http://localhost:5173 --tags wcag2aa
# Must have: 0 violations
```

**Lighthouse:**
```bash
pnpm exec lighthouse http://localhost:5173 --view
# Target: Performance ≥90, Accessibility = 100
```

---

## Troubleshooting

### Common Issues

#### Issue: MaterialM styles not applying

**Symptoms:** Flowbite components look unstyled or broken

**Solutions:**
1. Check Flowbite provider is wrapping App (main.tsx:15)
2. Verify materialM.css is imported (main.tsx:9)
3. Check Tailwind config includes Flowbite content (tailwind.config.js:6)
4. Clear build cache: `rm -rf dist .vite && pnpm build`

#### Issue: Feature flag not working

**Symptoms:** Toggle doesn't switch between designs

**Solutions:**
1. Check localStorage: `localStorage.getItem('feature_MATERIALM')`
2. Check environment: `import.meta.env.VITE_USE_MATERIALM`
3. Clear localStorage: `localStorage.clear()` and reload
4. Verify useFeatureFlag hook imported correctly

#### Issue: TypeScript errors with Flowbite

**Symptoms:** `Property 'X' does not exist on type`

**Solutions:**
1. Install types: `pnpm add -D @types/flowbite-react`
2. Check Flowbite version: `pnpm list flowbite-react`
3. Update: `pnpm update flowbite-react`

#### Issue: Dark mode not working

**Symptoms:** MaterialM components stuck in light mode

**Solutions:**
1. Flowbite uses `<html class="dark">` for dark mode
2. Our existing useDarkMode hook sets this correctly
3. Verify: `document.documentElement.classList.contains('dark')`
4. Flowbite respects this automatically

#### Issue: Performance regression

**Symptoms:** App feels slower after MaterialM

**Solutions:**
1. Check bundle size: `pnpm build && ls -lh dist/assets/`
2. Profile with React DevTools
3. Memoize expensive Flowbite components: `React.memo()`
4. Lazy load non-critical components: `React.lazy()`

#### Issue: Visual regression in legacy mode

**Symptoms:** Old design looks broken after MaterialM added

**Solutions:**
1. Check CSS specificity conflicts
2. Verify legacy components have correct classes
3. Test with feature flag off: `localStorage.setItem('feature_MATERIALM', 'false')`
4. Check materialM.css doesn't override global styles

---

## Additional Resources

### Documentation
- **Material Design 3:** https://m3.material.io/
- **Flowbite React:** https://flowbite-react.com/
- **OKLCH Color:** https://oklch.com/

### Internal Docs
- **Implementation Plan:** `docs/MATERIALM_IMPLEMENTATION_PLAN.md`
- **Handoff Document:** `.github/MATERIALM_HANDOFF.md`
- **Color System:** `src/styles/colorSystemM3.ts`
- **Theme Config:** `src/utils/materialMTheme.ts`

### Reference Components
- **Pilot Panel:** `src/components/MaterialMPilot.tsx`
- **Calendar Preview:** `src/components/CalendarMaterialMPreview.tsx`

---

## Support & Questions

**For questions about:**
- MaterialM implementation → See `docs/MATERIALM_IMPLEMENTATION_PLAN.md`
- Feature flags → See `src/hooks/useFeatureFlag.ts` comments
- Color system → See `src/styles/colorSystemM3.ts` comments
- Flowbite components → Visit https://flowbite-react.com/docs/

**Before migrating a component:**
1. Review this guide completely
2. Check if a wrapper component exists in `src/components/m3/` (Week 2+)
3. Look at pilot examples in `MaterialMPilot.tsx`
4. Test both MaterialM and legacy paths

---

**Migration Status:** Phase 1 Complete ✅
**Next Milestone:** Week 2 - Build MaterialM wrapper components
**Questions?** Reference the handoff document or implementation plan.
