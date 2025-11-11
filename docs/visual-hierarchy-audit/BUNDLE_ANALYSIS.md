# Bundle Size Analysis

**Date:** November 6, 2025
**Build Tool:** Vite 5.4.21
**Node Modules:** pnpm

## Production Bundle Breakdown

### Current Bundle Sizes

| Asset | Minified | Gzipped | % of Total |
|-------|----------|---------|------------|
| JavaScript (`index-rgql0bZb.js`) | 719.62 KB | **202.66 KB** | 92.3% |
| CSS (`index-DtauSjMl.css`) | 95.87 KB | 15.69 KB | 7.1% |
| HTML (`index.html`) | 3.75 KB | 1.26 KB | 0.6% |
| **TOTAL** | **819.24 KB** | **219.61 KB** | **100%** |

### Status Assessment

⚠️ **JavaScript bundle exceeds 500KB threshold**

Vite warning received:
```
(!) Some chunks are larger than 500 KB after minification.
Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking
```

✅ **Gzipped size is acceptable** (202KB < 250KB target), but optimization will improve mobile performance

## Production Dependencies Analysis

```
@supabase/supabase-js  2.76.1   [Estimated: 100-150KB gzipped]
lucide-react           0.344.0  [Estimated: 20-50KB depending on tree-shaking]
moment                 2.30.1   [Estimated: 70KB gzipped with locales] ⚠️ DEPRECATED
react-big-calendar     1.19.4   [Estimated: 50-80KB]
react-day-picker       9.11.1   [Estimated: 30-40KB]
react + react-dom      18.3.1   [Estimated: 40-50KB combined]
clsx                   2.1.1    [Small]
tailwind-merge         3.3.1    [Small]
```

## Optimization Opportunities

### 🔴 Critical (High Impact)

#### 1. Replace Moment.js with Modern Alternative
**Current:** `moment` 2.30.1 (~70KB gzipped)
**Problem:**
- Deprecated library
- Includes all locales by default
- Mutable API causes bugs
- Heavy for simple date operations

**Recommended Solutions:**

**Option A: date-fns (Recommended)**
```bash
pnpm remove moment
pnpm add date-fns
```
- **Size:** ~10-15KB gzipped (tree-shakeable)
- **Savings:** ~55-60KB gzipped
- **Migration:** Straightforward, well-documented

**Option B: Native Intl API (Zero Dependencies)**
- **Size:** 0KB (built into browsers)
- **Savings:** ~70KB gzipped
- **Limitation:** May need polyfills for older browsers
- **Best for:** Simple date formatting only

**Files to Update:**
- `src/utils/calendarUtils.ts` - Uses moment for date manipulation
- Any components importing moment

**Priority:** HIGH - Single largest optimization opportunity

#### 2. Code Split Large Components
**Target Components for React.lazy():**

```typescript
// Phase 2 implementation
const BigCalendar = lazy(() => import('./components/calendar/BigCalendar'));
const MaterialMCalendar = lazy(() => import('./components/calendar/MaterialMCalendar'));
const ActivityLogModal = lazy(() => import('./components/ActivityLogModal'));
const HelpModal = lazy(() => import('./components/HelpModal'));
```

**Estimated Savings:** 100-150KB from initial bundle (moved to separate chunks)

**Benefits:**
- Faster initial page load
- Calendar loads only when needed
- Modals load on-demand
- Better caching (chunks don't change as often)

### 🟡 Medium Priority

#### 3. Optimize lucide-react Icon Imports

**Current (if using barrel imports):**
```typescript
import { Icon1, Icon2, Icon3 } from 'lucide-react';
```

**Problem:** May bundle all icons if tree-shaking fails

**Solution: Individual imports**
```typescript
import Icon1 from 'lucide-react/dist/esm/icons/icon-1';
import Icon2 from 'lucide-react/dist/esm/icons/icon-2';
```

**Check current usage:**
```bash
grep -r "from 'lucide-react'" src/
```

**Estimated Savings:** 10-30KB if currently importing entire package

#### 4. Lazy Load Supabase Client for Non-Critical Features

**Current:** Supabase client loaded on app init
**Opportunity:** Defer client initialization for admin features

```typescript
// Only load Supabase when needed (e.g., after login)
const loadSupabase = async () => {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url, key);
};
```

**Estimated Savings:** 50-80KB from initial bundle
**Trade-off:** Slight delay when first using admin features
**Recommendation:** Skip for now, Supabase needed immediately

#### 5. Implement Manual Chunks in vite.config.ts

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom'],
        'vendor-supabase': ['@supabase/supabase-js'],
        'vendor-calendar': ['react-big-calendar', 'react-day-picker'],
        'vendor-icons': ['lucide-react'],
      }
    }
  }
}
```

**Benefits:**
- Better long-term caching
- Vendor chunks change less frequently
- Parallel chunk loading

### 🟢 Low Priority (Nice to Have)

#### 6. Tree-Shake Unused Tailwind Classes
**Current:** CSS is 95.87KB → 15.69KB gzipped (already good)
**Opportunity:** Audit for unused utilities

```bash
# Already configured in tailwind.config.js
content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
```

**Status:** ✅ Tailwind purge is working well

#### 7. Consider CSS-in-JS Bundle Impact
**Current:** Some inline styles in components
**Analysis Needed:** Check if any CSS-in-JS libraries are bundled

#### 8. Compress Static Assets Further
**Current:**
- `og-image.png`: 719KB (already compressed from linkimage.png)

**Opportunity:**
- Convert to WebP: ~350-400KB (50% savings)
- Implement lazy loading
- Use responsive images

## Implementation Roadmap

### Phase 1: Quick Wins (Week 1)
1. ✅ Document bundle analysis
2. ⏭️ Replace moment with date-fns (~60KB savings)
3. ⏭️ Verify lucide-react tree-shaking

**Expected Result:** 719KB → ~650KB minified, 202KB → ~145KB gzipped

### Phase 2: Code Splitting (Week 2)
1. Lazy load BigCalendar and MaterialMCalendar
2. Lazy load all modal components
3. Implement Suspense boundaries with loading states
4. Configure manual chunks in vite.config.ts

**Expected Result:** Initial bundle ~400KB minified, ~110KB gzipped

### Phase 3: Advanced Optimization (Week 3)
1. Optimize images (WebP conversion)
2. Implement image lazy loading
3. Further code splitting based on routes/features
4. Bundle analysis with webpack-bundle-analyzer

**Expected Result:** Initial bundle ~350KB minified, ~95KB gzipped

## Performance Impact

### Current State
- **First Load:** 202KB gzipped JavaScript
- **LCP:** 611ms (excellent, but mostly render delay)
- **Parse Time:** Estimated 150-200ms on mobile

### After Phase 1 (Moment Replacement)
- **First Load:** ~145KB gzipped JavaScript
- **LCP:** Estimated 550ms (slightly better)
- **Parse Time:** ~110ms on mobile

### After Phase 2 (Code Splitting)
- **Initial Load:** ~110KB gzipped JavaScript
- **LCP:** Estimated 450-500ms (**~20% improvement**)
- **Parse Time:** ~70ms on mobile
- **Calendar/Modals:** Load on-demand (+30-40KB each)

## Monitoring

### Tools to Integrate
1. **Vercel Analytics** - Real user bundle transfer sizes
2. **webpack-bundle-analyzer** - Visual bundle composition
3. **Lighthouse CI** - Track bundle size in CI/CD
4. **bundlephobia.com** - Check dependency sizes before adding

### Metrics to Track
- Gzipped bundle size (target: < 150KB initial)
- Number of chunks (target: 4-6 chunks)
- Cache hit rate on repeat visits
- Parse time on mobile devices

## Next Steps

1. ✅ Complete bundle analysis documentation
2. ⏭️ Start Phase 1: Replace moment with date-fns
3. ⏭️ Set up webpack-bundle-analyzer for visual analysis
4. ⏭️ Create bundle size CI check to prevent regressions

---

*Generated by Claude Code Mobile Optimization Project*
