# MaterialM Implementation Plan for FirefighterHub

**Date:** November 5, 2025
**Status:** Phase 1 - Research Complete
**Source:** MaterialM React/Tailwind Pro Template

---

## What We Discovered

### MaterialM Technical Stack
- **Component Library:** Flowbite React (✅ installed)
- **Color System:** OKLCH color space (perceptually uniform)
- **Theming:** CSS custom properties with 6 theme variants
- **Base Framework:** React + Tailwind CSS + TypeScript
- **Package Structure:** Monorepo with 8 variants (default, dark, horizontal, rtl, etc.)

### Key MaterialM Features Found

**1. OKLCH Color Definitions** (from `default-theme.css`):
```css
--dark: oklch(0.23 0.037 258.85)     /* Dark background */
--primary: oklch(66.93% 0.224 247.87) /* BLUE_THEME primary */
--info: oklch(0.78 0.1209 218.04)
--success: oklch(0.76 0.138061 180.4149)
--warning: oklch(0.83 0.1712 81.04)
--error: oklch(0.71 0.1892 5.4)
```

**2. Theme Variants Available:**
- BLUE_THEME (recommended for emergency services)
- AQUA_THEME
- PURPLE_THEME
- GREEN_THEME
- CYAN_THEME
- ORANGE_THEME

**3. Component Customization** (Flowbite theme):
- Buttons: 5 sizes (xs, sm, md, lg, xl)
- 12 color variants (primary, secondary, error, etc.)
- Cards: Elevated with dark mode support
- Modals: Full-screen and basic variants
- 700+ lines of comprehensive theme config

---

## Revised Implementation Strategy

### Why This Changes Everything

**Original Plan:** Custom M3 implementation (128-162 hours)
**New Plan:** Adapt MaterialM template (40-60 hours)

**Advantages:**
- ✅ Pre-built Flowbite theme configuration (700 lines)
- ✅ OKLCH color system (better than RGB)
- ✅ 6 theme variants to choose from
- ✅ Proven component patterns
- ✅ Dark mode built-in
- ✅ Much faster implementation

---

## Phase 1: Foundation (Week 1) - IN PROGRESS

### Completed ✅
- [x] Analyzed MaterialM template structure
- [x] Extracted Flowbite theme configuration
- [x] Installed Flowbite React
- [x] Installed Material Tailwind (backup library)
- [x] Identified OKLCH color system

### Next Steps (This Week)

**1. Create MaterialM Theme File** (2-3 hours)
```typescript
// src/utils/materialMTheme.ts
import { createTheme } from "flowbite-react";

export const materialMTheme = createTheme({
  // Copy 700 lines from MaterialM custom-theme.tsx
  // Adapt for FirefighterHub specific needs
});
```

**2. Set Up Theme Provider** (1-2 hours)
```tsx
// src/contexts/ThemeContext.tsx
import { Flowbite } from "flowbite-react";
import { materialMTheme } from "../utils/materialMTheme";

export function ThemeProvider({ children }) {
  return (
    <Flowbite theme={{ theme: materialMTheme }}>
      {children}
    </Flowbite>
  );
}
```

**3. Create Feature Flag** (1 hour)
```typescript
// .env.local
VITE_USE_MATERIALM=false  // Default: off

// src/hooks/useFeatureFlag.ts
export function useFeatureFlag(flag: string) {
  return import.meta.env[`VITE_USE_${flag}`] === 'true';
}
```

**4. Convert OKLCH to Tailwind** (2-3 hours)
Extend `tailwind.config.js` with OKLCH colors:
```javascript
theme: {
  extend: {
    colors: {
      // MaterialM OKLCH colors
      'materialm-dark': 'oklch(0.23 0.037 258.85)',
      'materialm-primary': 'oklch(66.93% 0.224 247.87)',
      // ... etc
    }
  }
}
```

---

## Simplified Implementation Timeline

### Week 1: MaterialM Theme Setup
- Create theme file from MaterialM
- Set up Flowbite provider
- Feature flag infrastructure
- **Deliverable:** Parallel theme ready

### Week 2-3: Pilot Components
- Migrate 3-5 components to MaterialM/Flowbite
- Calendar, Header, Toast
- A/B test with feature flag
- **Deliverable:** Proof of concept

### Week 4-6: Core Migration
- Migrate remaining 15+ components
- Update all tests
- Accessibility audit
- **Deliverable:** Complete UI migrated

### Week 7: Production Rollout
- Gradual rollout (10% → 100%)
- Monitor performance
- User feedback
- **Deliverable:** MaterialM live

### Week 8: Cleanup
- Remove old theme
- Archive legacy components
- Final documentation
- **Deliverable:** Clean codebase

**Total:** 8 weeks (vs original 20 weeks)
**Effort:** 40-60 hours (vs original 128-162 hours)

---

## Immediate Next Steps (Today/Tomorrow)

1. ✅ **Copy MaterialM theme config** to FirefighterHub
2. ✅ **Set up Flowbite provider** in App.tsx
3. ✅ **Create one pilot component** (Toast or Badge)
4. ✅ **Test with feature flag**
5. ✅ **Get user approval** on visual direction

---

## Key Decisions Made

**Color Theme:** BLUE_THEME (primary: oklch(66.93% 0.224 247.87))
- Professional blue for emergency services
- Matches firefighter context
- High contrast, WCAG compliant

**Component Library:** Flowbite React
- MaterialM's proven choice
- 40+ pre-built components
- Excellent dark mode support
- Active maintenance

**Migration Approach:** Feature flag + gradual rollout
- Zero breaking changes
- Instant rollback capability
- User choice (opt-in beta)

---

**Ready to proceed with implementation!**
