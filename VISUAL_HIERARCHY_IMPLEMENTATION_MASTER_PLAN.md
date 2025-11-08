# Visual Hierarchy Audit - Master Implementation Plan
## Comprehensive Task List & Execution Strategy

**Created:** 2025-11-07  
**Status:** 🚀 Implementation Phase  
**Overall Progress:** 0% → Target 100%  
**Timeline:** 2 weeks to Grade A-

---

## Executive Summary

This master plan implements **109 prioritized improvements** identified in the comprehensive visual hierarchy audit. Current score: **83.71/100 (B+)**. Target score: **87.91/100 (A-)** with potential for **90+/100 (A)** after user testing validation.

### Impact Preview

| Metric | Before | After | Gain |
|--------|--------|-------|------|
| **VH Score** | 83.71/100 (B+) | 87.91/100 (A-) | +4.2 ✅ |
| **Lighthouse A11y** | 92/100 | 95/100 | +3 ✅ |
| **WCAG 2.1 AA** | 96.2% | 100% | +3.8% ✅ |
| **Touch Targets** | 14.5% | 100% | +85.5% ✅✅ |
| **Quick Add Discovery** | 4.2s | 1.8s | -57% ⚡ |

---

## Implementation Phases

### Phase 1: Foundation & Quick Wins ⏱️ 1 hour
- [ ] **Task 1.1:** Color contrast fixes (30 min)
- [ ] **Task 1.2:** Skip navigation link (15 min)
- [ ] **Task 1.3:** ARIA live regions (15 min)
- **Impact:** Lighthouse 92→95, WCAG 96.2%→100%

### Phase 2: Touch Target Compliance ⏱️ 4 hours
- [ ] **Task 2.1:** Icon button touch targets - 28 components (2 hrs)
- [ ] **Task 2.2:** Form control touch targets - 18 components (1 hr)
- [ ] **Task 2.3:** Modal close buttons - 12 components (30 min)
- [ ] **Task 2.4:** Calendar navigation (30 min)
- **Impact:** Touch compliance 14.5%→100%

### Phase 3: Visual Hierarchy Improvements ⏱️ 3 hours
- [ ] **Task 3.1:** Calendar day numbers 12px→16px (30 min)
- [ ] **Task 3.2:** Floating Action Button (1 hr)
- [ ] **Task 3.3:** Typography consolidation H3→body-emphasis (1.5 hrs)
- **Impact:** VH Score 83.71→87.91 (B+→A-)

### Phase 4: Design System Integration ⏱️ 2 hours
- [ ] **Task 4.1:** Create reusable UI components (1 hr)
- [ ] **Task 4.2:** Update design tokens (30 min)
- [ ] **Task 4.3:** Cleanup old code (30 min)
- **Impact:** Maintainability, consistency

### Phase 5: Testing & Validation ⏱️ 4 hours
- [ ] **Task 5.1:** Visual regression testing (1 hr)
- [ ] **Task 5.2:** Accessibility validation (1 hr)
- [ ] **Task 5.3:** Cross-browser testing (1 hr)
- [ ] **Task 5.4:** Mobile device testing (1 hr)
- **Impact:** Zero regressions

---

## Detailed Task Breakdown

## PRIORITY 1: QUICK WINS (1 hour) 🚀

### Task 1.1: Fix Muted Text Color Contrast (30 min)

**Issue:** `#4b5563` has 3.5:1 contrast (fails WCAG AA 4.5:1)  
**Solution:** Change to `#a3b2c8` (5.2:1 contrast)

**Files to Update:**
- `src/utils/theme.ts` - Update color tokens
- `src/utils/sidebarTheme.ts` - Muted text references
- `src/utils/calendarTheme.ts` - Muted text references

**Implementation:**
```typescript
// src/utils/theme.ts
export const getTheme = (isDarkMode: boolean) => {
  return {
    text: isDarkMode
      ? {
          primary: '#f3f4f6',    // gray-100 (15.2:1) ✅
          secondary: '#9ca3af',  // gray-400 (6.8:1) ✅
          tertiary: '#6b7280',   // gray-500 (4.9:1) ✅
          muted: '#a3b2c8',      // NEW (5.2:1) ✅ was #4b5563
        }
      : {
          primary: '#1e293b',
          secondary: '#64748b',
          tertiary: '#94a3b8',
          muted: '#a0aec0',      // NEW light mode
        },
  };
};
```

**Testing:**
- [ ] Verify contrast with WebAIM checker
- [ ] Visual inspection of all muted text instances
- [ ] Lighthouse re-run (expect 92→95)

**Affected Components:** ~40 instances
- ActivityLog.tsx - timestamps
- FirefighterProfileModal.tsx - metadata labels
- All modal helper text
- Disabled state text

---

### Task 1.2: Add Skip Navigation Link (15 min)

**Issue:** Missing WCAG 2.4.1 "Bypass Blocks"  
**Solution:** Add keyboard-accessible skip link

**Files to Update:**
- `src/App.tsx` - Add skip link before main content
- `src/index.css` - Add sr-only utilities if needed

**Implementation:**
```tsx
// src/App.tsx
function App() {
  return (
    <>
      {/* Skip link - visible only on keyboard focus */}
      <a
        href="#main-content"
        className="
          sr-only
          focus:not-sr-only focus:absolute focus:top-4 focus:left-4
          focus:z-50 focus:px-4 focus:py-2
          focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
        "
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-slate-900">
        <Header {...props} />
        
        <main id="main-content" tabIndex={-1} className="flex flex-col lg:flex-row">
          {/* Content */}
        </main>
      </div>
    </>
  );
}
```

**Testing:**
- [ ] Tab on page load - skip link should appear
- [ ] Press Enter - focus jumps to main content
- [ ] Screen reader announces link

---

### Task 1.3: Add ARIA Live Regions (15 min)

**Issue:** Dynamic updates not announced to screen readers  
**Solution:** Add aria-live to real-time components

**Files to Update:**
- `src/components/NextUpBar.tsx`
- `src/components/Sidebar.tsx`
- `src/components/roster/RosterList.tsx`

**Implementation:**
```tsx
// src/components/NextUpBar.tsx
export const NextUpBar = ({ nextUpFirefighter }: Props) => {
  return (
    <div className="...">
      <div
        aria-live="polite"
        aria-atomic="true"
        className="..."
      >
        <span className="font-medium">Next up:</span>{' '}
        {nextUpFirefighter ? (
          <span className="text-emerald-400">{nextUpFirefighter.name}</span>
        ) : (
          <span className="text-gray-400">No available firefighters</span>
        )}
      </div>
    </div>
  );
};
```

```tsx
// src/components/Sidebar.tsx (roster count)
<div
  aria-live="polite"
  aria-atomic="false"
  className="text-sm text-gray-400"
>
  {availableCount} firefighters available
</div>
```

**Testing:**
- [ ] Complete a hold - verify "Next up: [name]" announced
- [ ] Change shift - verify count update announced
- [ ] VoiceOver/NVDA testing

---

## PRIORITY 2: TOUCH TARGET COMPLIANCE (4 hours) 🎯

### Task 2.1: Icon Button Touch Targets (2 hours)

**Issue:** 28 icon buttons are 24×24px (need 44×44px minimum)  
**Strategy:** Add padding to create 44×44px clickable area

**Step 1: Create Reusable IconButton Component (30 min)**

**File:** `src/components/ui/IconButton.tsx` (NEW)

```tsx
import { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string; // For aria-label and tooltip
  variant?: 'default' | 'primary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = ({
  icon: Icon,
  label,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) => {
  const sizeClasses = {
    sm: 'min-w-[40px] min-h-[40px] p-2',
    md: 'min-w-[44px] min-h-[44px] p-2.5',
    lg: 'min-w-[48px] min-h-[48px] p-3',
  };

  const variantClasses = {
    default: 'text-gray-400 hover:text-white hover:bg-slate-700',
    primary: 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20',
    danger: 'text-red-400 hover:text-red-300 hover:bg-red-900/20',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        rounded-md
        ${variantClasses[variant]}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        transition-colors
        ${className}
      `}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};
```

**Step 2: Migrate Header Icons (30 min)**

**File:** `src/components/Header.tsx`

```tsx
// BEFORE
<button onClick={toggleHelp} className="text-gray-400">
  <HelpCircle className="w-6 h-6" />
</button>

// AFTER
import { IconButton } from './ui/IconButton';

<IconButton
  icon={HelpCircle}
  label="Open help"
  onClick={toggleHelp}
/>
<IconButton
  icon={Activity}
  label="View activity log"
  onClick={toggleActivityLog}
/>
<IconButton
  icon={isDarkMode ? Sun : Moon}
  label="Toggle dark mode"
  onClick={toggleDarkMode}
/>
```

**Components to Migrate:**
- [ ] `Header.tsx` - 3 icon buttons
- [ ] `CalendarView.tsx` - 6 icon buttons (nav arrows, actions)
- [ ] `Sidebar.tsx` - 4 icon buttons (filter, export)
- [ ] `FilterPanel.tsx` - 3 icon buttons
- [ ] All modals - close buttons (separate task)

**Testing per component:**
- [ ] Visual check - icon same size, larger tap area
- [ ] Mobile test - easy to tap, no misclicks
- [ ] Keyboard test - focus ring visible

---

### Task 2.2: Form Control Touch Targets (1 hour)

**Issue:** 18 checkboxes/radios are 16×16px clickable areas  
**Solution:** Wrap in larger labels with min-h-[44px]

**Step 1: Create Reusable Checkbox Component (20 min)**

**File:** `src/components/ui/Checkbox.tsx` (NEW)

```tsx
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
}

export const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  description,
}: CheckboxProps) => {
  return (
    <label
      className={`
        flex items-start gap-3
        min-h-[44px] py-2 px-2
        rounded-md
        cursor-pointer group
        hover:bg-slate-800/50
        transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="
          mt-0.5 w-4 h-4
          rounded border-gray-300
          text-blue-600 focus:ring-blue-500 focus:ring-2
          cursor-pointer
          disabled:cursor-not-allowed
        "
      />
      <div className="flex-1">
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
          {label}
        </span>
        {description && (
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        )}
      </div>
    </label>
  );
};
```

**Step 2: Migrate Forms (40 min)**

**Files to Update:**
- [ ] `QuickAddFirefighterModal.tsx` - Certification checkboxes (4×)
- [ ] `FilterPanel.tsx` - Filter options (6×)
- [ ] `ScheduledHoldModal.tsx` - Duration radios (2×)
- [ ] `TransferShiftModal.tsx` - Shift selection (3×)

**Example Migration:**
```tsx
// BEFORE
<div className="flex items-center gap-2">
  <input type="checkbox" id="engine" checked={certs.engine} />
  <label htmlFor="engine">Engine</label>
</div>

// AFTER
<Checkbox
  label="Engine"
  checked={certs.engine}
  onChange={(checked) => setCerts({ ...certs, engine: checked })}
  description="Certified to operate engine apparatus"
/>
```

---

### Task 2.3: Modal Close Buttons (30 min)

**Issue:** 12 modal close buttons are 32×32px  
**Solution:** Increase to min-w-[44px] min-h-[44px]

**Files to Update:**
- `src/components/ActivityLogModal.tsx`
- `src/components/CompleteHoldModal.tsx`
- `src/components/FirefighterProfileModal.tsx`
- `src/components/FirefightersModal.tsx`
- `src/components/HelpModal.tsx`
- `src/components/KeyboardShortcutsModal.tsx`
- `src/components/LoginModal.tsx`
- `src/components/QuickAddFirefighterModal.tsx`
- `src/components/ReactivateModal.tsx`
- `src/components/TransferShiftModal.tsx`
- `src/components/CalendarSubscribeModal.tsx`
- `src/components/calendar/ScheduledHoldModal.tsx`

**Pattern to Apply:**
```tsx
// BEFORE
<button onClick={onClose} className="absolute top-4 right-4">
  <X className="w-8 h-8 text-gray-400" />
</button>

// AFTER
<button
  onClick={onClose}
  className="
    absolute top-2 right-2
    inline-flex items-center justify-center
    min-w-[44px] min-h-[44px]
    p-2
    rounded-md
    text-gray-400 hover:text-white hover:bg-slate-700
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    transition-colors
  "
  aria-label="Close dialog"
>
  <X className="w-6 h-6" />
</button>
```

**Automation Script:**
Create `scripts/migrate-modal-close-buttons.ts` to automate replacements

---

### Task 2.4: Calendar Navigation Touch Targets (30 min)

**Issue:** Month navigation arrows are 32×32px  
**Solution:** Increase to 44×44px with padding

**File:** `src/components/Calendar.tsx` or `src/components/CalendarView.tsx`

```tsx
// BEFORE
<button onClick={handlePreviousMonth}>
  <ChevronLeft className="w-8 h-8 text-gray-400" />
</button>

// AFTER
<IconButton
  icon={ChevronLeft}
  label="Previous month"
  onClick={handlePreviousMonth}
  size="md"
/>

<IconButton
  icon={ChevronRight}
  label="Next month"
  onClick={handleNextMonth}
  size="md"
/>
```

---

## PRIORITY 3: VISUAL HIERARCHY IMPROVEMENTS (3 hours) 📊

### Task 3.1: Increase Calendar Day Numbers (30 min)

**Issue:** Day numbers are 12px (text-xs) - hard to scan  
**Solution:** Increase to 16px (text-base) with medium weight

**File:** `src/components/Calendar.tsx`

```tsx
// Find day number rendering
// BEFORE
<span className="text-xs text-gray-400">{dayNumber}</span>

// AFTER
<span className="text-base font-medium text-gray-300">{dayNumber}</span>
```

**Changes:**
- `text-xs` (12px) → `text-base` (16px) = +33% size
- Add `font-medium` (500 weight) for better visibility
- `text-gray-400` → `text-gray-300` for higher contrast

**Testing:**
- [ ] View calendar at arm's length - numbers easily readable
- [ ] Lighthouse contrast check passes
- [ ] F-pattern scannability improved

**Impact:**
- Scannability: +8 points (77.68 → 85.68)
- F-pattern effectiveness: 60/100 → 75/100 (+15)

---

### Task 3.2: Implement Floating Action Button (1 hour)

**Issue:** Quick Add button in far-right header (off Z-pattern, 4.2s discovery)  
**Solution:** Floating Action Button (bottom-right, always visible)

**Step 1: Create FAB Component (30 min)**

**File:** `src/components/ui/FloatingActionButton.tsx` (NEW)

```tsx
import { LucideIcon } from 'lucide-react';

interface FABProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left';
  variant?: 'primary' | 'secondary';
}

export const FloatingActionButton = ({
  icon: Icon,
  label,
  onClick,
  position = 'bottom-right',
  variant = 'primary',
}: FABProps) => {
  const positionClasses = {
    'bottom-right': 'bottom-24 right-6 lg:bottom-8 lg:right-8',
    'bottom-left': 'bottom-24 left-6 lg:bottom-8 lg:left-8',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600',
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed ${positionClasses[position]}
        z-40
        w-14 h-14 lg:w-16 lg:h-16
        ${variantClasses[variant]}
        text-white
        rounded-full shadow-2xl
        hover:scale-110
        focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500
        transition-all duration-200
        group
      `}
      aria-label={label}
      title={label}
    >
      <Icon className="w-8 h-8 mx-auto group-hover:scale-110 transition-transform" />
      
      {/* Tooltip on desktop */}
      <span className="
        hidden lg:block
        absolute right-full mr-3 top-1/2 -translate-y-1/2
        px-3 py-1.5
        bg-slate-800 text-white text-sm font-medium
        rounded-md shadow-lg
        opacity-0 group-hover:opacity-100 group-focus:opacity-100
        pointer-events-none
        transition-opacity
        whitespace-nowrap
      ">
        {label}
      </span>
    </button>
  );
};
```

**Step 2: Integrate into App (15 min)**

**File:** `src/App.tsx`

```tsx
import { FloatingActionButton } from './components/ui/FloatingActionButton';
import { Plus } from 'lucide-react';

function App() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  return (
    <>
      {/* Main content */}
      
      {/* Floating Action Button - Quick Add */}
      <FloatingActionButton
        icon={Plus}
        label="Quick Add Firefighter"
        onClick={() => setShowQuickAdd(true)}
        position="bottom-right"
        variant="primary"
      />

      {/* Quick Add Modal */}
      <QuickAddFirefighterModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onAdd={handleQuickAdd}
      />
    </>
  );
}
```

**Step 3: Remove Old Header Button (15 min)**

**File:** `src/components/Header.tsx`

```tsx
// Remove Quick Add button from header
// Keep only: Logo, Shift Selector, Help, Activity Log, Dark Mode
```

**Testing:**
- [ ] FAB visible on desktop (bottom-right)
- [ ] FAB visible on mobile (above bottom nav)
- [ ] Click opens Quick Add modal
- [ ] Tooltip shows on desktop hover
- [ ] Focus ring visible on keyboard nav
- [ ] Doesn't overlap with critical content

**A/B Testing Setup (Optional):**
```tsx
const useFloatingActionButton = featureFlags.get('floating-action-button') ?? true;

{useFloatingActionButton ? (
  <FloatingActionButton icon={Plus} label="Quick Add" onClick={handleQuickAdd} />
) : (
  // Old header button
)}
```

**Impact:**
- Action Clarity: +4.8 points (85.35 → 90.15)
- Discovery time: 4.2s → 1.8s (-57%)
- First-click success: 68% → 92% (+24%)

---

### Task 3.3: Typography Consolidation - Remove H3 (1.5 hours)

**Issue:** 5 hierarchy levels with H2 and H3 same size (20px)  
**Solution:** Consolidate to 4 levels (H1, H2, Body Emphasis, Body, Caption)

**Step 1: Update Design Tokens (15 min)**

**File:** `src/utils/tokens.ts`

```typescript
export const tokens = {
  typography: {
    heading: {
      h1: {
        size: 'text-3xl',      // 30px
        weight: 'font-bold',   // 700
        leading: 'leading-tight', // 1.25
      },
      h2: {
        size: 'text-xl',       // 20px
        weight: 'font-semibold', // 600
        leading: 'leading-snug', // 1.375
      },
      // H3 REMOVED
    },
    body: {
      default: {
        size: 'text-base',     // 16px
        weight: 'font-normal', // 400
        leading: 'leading-normal', // 1.5
      },
      emphasis: {
        size: 'text-base',     // 16px (NEW - replaces H3)
        weight: 'font-semibold', // 600
        leading: 'leading-normal', // 1.5
      },
    },
    caption: {
      default: {
        size: 'text-sm',       // 14px
        weight: 'font-normal', // 400
        leading: 'leading-relaxed', // 1.6
      },
      small: {
        size: 'text-xs',       // 12px
        weight: 'font-normal', // 400
        leading: 'leading-relaxed', // 1.6
      },
    },
  },
};
```

**Step 2: Find All H3 Usage (15 min)**

```bash
# Search for H3 elements
grep -rn "text-xl" src/components/ | grep -E "<h3|h3>"

# Expected files:
# - Sidebar.tsx - "Available" / "On Hold" sections
# - CalendarView.tsx - Legend headers
# - ActivityLog.tsx - Section headers
# - Reports.tsx - Report section headers
```

**Step 3: Migrate Components (1 hour)**

**Pattern:**
```tsx
// BEFORE - Presentational H3 (not semantic heading)
<h3 className="text-xl font-semibold text-gray-200">Available Firefighters</h3>

// AFTER - Body emphasis (appropriate level)
<p className="text-base font-semibold text-gray-200">Available Firefighters</p>

// OR - If semantic heading needed
<h2 className="text-base font-semibold text-gray-200" id="available-section">
  Available Firefighters
</h2>
```

**Files to Update:**
- [ ] `src/components/Sidebar.tsx`
- [ ] `src/components/roster/RosterList.tsx`
- [ ] `src/components/Calendar.tsx`
- [ ] `src/components/CalendarView.tsx`
- [ ] `src/components/ActivityLog.tsx`
- [ ] `src/components/Reports.tsx`

**Testing:**
- [ ] Visual regression - hierarchy still clear
- [ ] Lighthouse heading structure check
- [ ] Screen reader heading navigation

**Impact:**
- Info Prioritization: +0.9 points (89.52 → 90.42)
- Clearer 4-level hierarchy (easier to scan)
- Better semantic HTML

---

## PRIORITY 4: DESIGN SYSTEM INTEGRATION (2 hours) 🎨

### Task 4.1: Create Reusable UI Components (1 hour)

**Components to Create:**

1. **IconButton** ✅ (created in Task 2.1)
2. **Checkbox** ✅ (created in Task 2.2)
3. **FloatingActionButton** ✅ (created in Task 3.2)
4. **Radio** (NEW - similar to Checkbox)
5. **Button** (standardize all button variants)

**File:** `src/components/ui/Button.tsx` (NEW)

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const sizeClasses = {
    sm: 'min-h-[40px] px-3 py-2 text-sm',
    md: 'min-h-[44px] px-4 py-2 text-base',
    lg: 'min-h-[48px] px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-md hover:shadow-lg',
    tertiary: 'bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white',
    danger: 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-md hover:shadow-lg',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        rounded-md font-medium
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};
```

**File:** `src/components/ui/index.ts` (NEW - barrel export)

```tsx
export { Button } from './Button';
export { IconButton } from './IconButton';
export { Checkbox } from './Checkbox';
export { FloatingActionButton } from './FloatingActionButton';
// Future: Radio, Select, Input, etc.
```

---

### Task 4.2: Update Design Tokens (30 min)

**File:** `src/utils/tokens.ts`

```typescript
export const tokens = {
  // Spacing
  spacing: {
    gap: {
      section: 'gap-8',       // 32px - major section separation (NEW)
      sectionLarge: 'gap-12', // 48px - page-level separation (NEW)
    },
    padding: {
      section: 'p-6',         // 24px - standard section padding (NEW)
      modal: 'p-5',           // 20px - modal content padding
    },
  },

  // Touch targets
  touchTarget: {
    min: 'min-w-[44px] min-h-[44px]', // WCAG 2.5.5
    icon: 'p-2.5',          // Padding for 24px icons → 44px total (NEW)
    control: 'min-h-[44px]', // Form controls (NEW)
  },

  // Typography (updated in Task 3.3)
  typography: {
    // ... (see Task 3.3)
  },

  // Icons
  icons: {
    xs: 'w-4 h-4',   // 16px
    sm: 'w-5 h-5',   // 20px
    md: 'w-6 h-6',   // 24px (default)
    lg: 'w-8 h-8',   // 32px
    xl: 'w-10 h-10', // 40px
  },

  // Focus indicators
  focus: {
    ring: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
    ringThick: 'focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500', // NEW
  },
};
```

**Update Tailwind Config (if needed):**

**File:** `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      minHeight: {
        'touch-target': '44px', // Already exists
      },
      minWidth: {
        'touch-target': '44px', // Already exists
      },
      // Add any missing utilities
    },
  },
};
```

---

### Task 4.3: Cleanup Old Code (30 min)

**Remove Duplicate/Outdated Code:**

1. **Old button styles** - replace with `<Button>` component
2. **Inline icon buttons** - replace with `<IconButton>`
3. **Inconsistent spacing** - use tokens.spacing
4. **Hardcoded colors** - use theme tokens

**Script to Find Hardcoded Values:**

```bash
# Find hardcoded colors
grep -rn "#[0-9a-fA-F]\{6\}" src/components/ | grep -v ".test."

# Find inline styles
grep -rn "style={{" src/components/

# Find non-token spacing (look for specific px values)
grep -rn "p-\[.*px\]" src/components/
```

**Files to Audit:**
- All modal components
- Form components
- Button instances
- Spacing between sections

---

## PRIORITY 5: TESTING & VALIDATION (4 hours) ✅

### Task 5.1: Visual Regression Testing (1 hour)

**Setup Playwright Visual Comparisons:**

**File:** `tests/visual-regression/hierarchy.spec.ts` (NEW)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visual Hierarchy - Before/After', () => {
  test('Calendar day numbers increased size', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="calendar"]');
    
    const dayNumber = page.locator('.calendar-day-number').first();
    await expect(dayNumber).toHaveScreenshot('calendar-day-number.png');
    
    // Verify font size
    const fontSize = await dayNumber.evaluate(
      el => window.getComputedStyle(el).fontSize
    );
    expect(fontSize).toBe('16px'); // text-base
  });

  test('FAB positioned correctly', async ({ page }) => {
    await page.goto('/');
    
    const fab = page.locator('[aria-label="Quick Add Firefighter"]');
    await expect(fab).toBeVisible();
    
    // Desktop: bottom-right
    await page.setViewportSize({ width: 1920, height: 1080 });
    const boxDesktop = await fab.boundingBox();
    expect(boxDesktop?.x).toBeGreaterThan(1800); // Right side
    expect(boxDesktop?.y).toBeGreaterThan(1000); // Bottom
    
    // Mobile: above bottom nav
    await page.setViewportSize({ width: 375, height: 667 });
    const boxMobile = await fab.boundingBox();
    expect(boxMobile?.y).toBeLessThan(600); // Above nav
  });

  test('All icon buttons have 44×44px touch targets', async ({ page }) => {
    await page.goto('/');
    
    const iconButtons = page.locator('[aria-label][role="button"]');
    const count = await iconButtons.count();
    
    for (let i = 0; i < count; i++) {
      const button = iconButtons.nth(i);
      const box = await button.boundingBox();
      
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
});
```

**Run Tests:**
```bash
pnpm test:e2e -- tests/visual-regression/
```

---

### Task 5.2: Accessibility Validation (1 hour)

**Lighthouse Audit:**

```bash
# Start dev server
pnpm dev &
sleep 10

# Run Lighthouse
npx lighthouse http://localhost:5173 \
  --only-categories=accessibility \
  --output json \
  --output html \
  --output-path=./docs/visual-hierarchy-audit/lighthouse-after

# Expected results:
# - Accessibility: 95/100 ✅ (was 92)
# - Color contrast: 100% ✅ (was 87.5%)
# - Touch targets: No issues ✅ (was 65 issues)
```

**WCAG 2.1 AA Checklist:**

- [ ] 1.4.3 Contrast (Minimum) - muted text now 5.2:1 ✅
- [ ] 2.1.1 Keyboard - all interactive elements accessible ✅
- [ ] 2.4.1 Bypass Blocks - skip link added ✅
- [ ] 2.4.6 Headings and Labels - semantic hierarchy ✅
- [ ] 2.5.5 Target Size - all 44×44px minimum ✅
- [ ] 4.1.3 Status Messages - aria-live regions ✅

**Screen Reader Testing:**

```bash
# macOS VoiceOver
# 1. Cmd+F5 to enable
# 2. Tab through interface
# 3. Verify announcements:
#    - "Skip to main content" on first Tab
#    - "Next up: [name]" when hold completed
#    - "[count] firefighters available" on shift change
# 4. Navigate by headings (Ctrl+Option+Cmd+H)
# 5. Verify heading hierarchy: H1 → H2 (no gaps)

# Windows NVDA (if available)
# Similar testing on Windows VM
```

---

### Task 5.3: Cross-Browser Testing (1 hour)

**Browsers to Test:**
- Chrome 120+ (primary)
- Firefox 120+
- Safari 17+ (macOS/iOS)
- Edge 120+

**Test Scenarios:**

1. **Touch Targets**
   - [ ] Chrome: All buttons 44×44px
   - [ ] Firefox: All buttons 44×44px
   - [ ] Safari: All buttons 44×44px
   - [ ] Edge: All buttons 44×44px

2. **Color Contrast**
   - [ ] Chrome DevTools: Verify muted text contrast
   - [ ] Firefox DevTools: Verify muted text contrast
   - [ ] Safari Web Inspector: Verify muted text contrast

3. **Focus Indicators**
   - [ ] Chrome: Tab through, ring-2 visible
   - [ ] Firefox: Tab through, ring-2 visible
   - [ ] Safari: Tab through, ring-2 visible

4. **Floating Action Button**
   - [ ] Chrome: Positioned correctly, tooltip works
   - [ ] Firefox: Positioned correctly, tooltip works
   - [ ] Safari: Positioned correctly, tooltip works
   - [ ] Mobile Safari: Above bottom nav, tap works

**Automation with Playwright:**

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

```bash
pnpm test:e2e -- --project=chromium --project=firefox --project=webkit
```

---

### Task 5.4: Mobile Device Testing (1 hour)

**Real Devices:**
- iPhone SE (375px width) - smallest common viewport
- iPhone 12/13 (390px width) - most common
- iPad Mini (768px width) - tablet
- Android (various sizes) - if available

**Test Scenarios:**

1. **Touch Target Accuracy**
   - [ ] Tap all icon buttons - no misclicks
   - [ ] Tap checkboxes/radios - easy to select
   - [ ] Tap FAB - obvious and accessible
   - [ ] Tap modal close buttons - easy to hit

2. **Calendar Scannability**
   - [ ] Day numbers readable at arm's length
   - [ ] Hold badges visible and tappable
   - [ ] Month navigation arrows easy to tap

3. **FAB Positioning**
   - [ ] Doesn't overlap bottom nav
   - [ ] Doesn't cover critical content
   - [ ] Easy to reach with thumb (right side)

4. **Scroll Performance**
   - [ ] Smooth scrolling with FAB fixed
   - [ ] No layout shifts during scroll
   - [ ] Touch gestures work correctly

**BrowserStack/Sauce Labs (if available):**
```bash
# Test on real devices remotely
# - iPhone 11, 12, 13, 14
# - Samsung Galaxy S21, S22
# - iPad Pro, iPad Air
```

---

## Implementation Checklist Summary

### Phase 1: Quick Wins ✅ (1 hour)
- [ ] Muted text color contrast fix
- [ ] Skip navigation link
- [ ] ARIA live regions
- [ ] Lighthouse re-run (expect 95/100)

### Phase 2: Touch Targets ✅ (4 hours)
- [ ] Create IconButton component
- [ ] Migrate 28 icon buttons
- [ ] Create Checkbox component
- [ ] Migrate 18 form controls
- [ ] Update 12 modal close buttons
- [ ] Update calendar navigation
- [ ] Touch target validation script

### Phase 3: Visual Hierarchy ✅ (3 hours)
- [ ] Calendar day numbers 12px→16px
- [ ] Floating Action Button component
- [ ] Integrate FAB into App
- [ ] Remove old Quick Add button
- [ ] Typography consolidation (H3 removal)
- [ ] Update design tokens

### Phase 4: Design System ✅ (2 hours)
- [ ] Create Button component
- [ ] Create ui/index.ts barrel export
- [ ] Update tokens.ts
- [ ] Cleanup old code
- [ ] Remove hardcoded values

### Phase 5: Testing ✅ (4 hours)
- [ ] Visual regression tests
- [ ] Lighthouse accessibility audit
- [ ] Screen reader testing
- [ ] Cross-browser testing
- [ ] Mobile device testing

---

## Success Metrics

### Pre-Implementation (Baseline)
- VH Score: 83.71/100 (B+)
- Lighthouse A11y: 92/100
- WCAG 2.1 AA: 96.2%
- Touch Targets: 14.5% compliant
- Quick Add Discovery: 4.2s

### Post-Implementation (Target)
- VH Score: **87.91/100 (A-)** ✅
- Lighthouse A11y: **95/100** ✅
- WCAG 2.1 AA: **100%** ✅
- Touch Targets: **100% compliant** ✅
- Quick Add Discovery: **1.8s** ✅

### ROI
- Implementation Cost: $8,220 (88 hours)
- Annual Value: $25,000+
- ROI: **204%** in first year

---

## Risk Mitigation

### Potential Risks
1. **Visual regressions** → Playwright snapshot testing
2. **Accessibility regressions** → Automated Lighthouse checks
3. **Mobile UX issues** → Real device testing
4. **Dark mode compatibility** → Test both modes in parallel
5. **Performance impact** → Lighthouse performance monitoring

### Rollback Plan
```bash
# If issues arise
git revert <commit-sha>
git push origin main --force-with-lease

# Feature flag approach (safer)
const useNewHierarchy = featureFlags.get('visual-hierarchy-v2') ?? false;
```

---

## Timeline

**Total Time:** 14 hours development + testing  
**Schedule:** 2 weeks (7 hours/week)

### Week 1
- Monday: Phase 1 (1 hr) + Phase 2 start (3 hrs) = 4 hrs
- Wednesday: Phase 2 finish (1 hr) + Phase 3 (3 hrs) = 4 hrs

### Week 2
- Monday: Phase 4 (2 hrs) + Phase 5 start (2 hrs) = 4 hrs
- Wednesday: Phase 5 finish (2 hrs) = 2 hrs

**Total:** 14 hours spread across 2 weeks

---

## Next Steps

1. **Review this plan** with team
2. **Create feature branch**: `feature/visual-hierarchy-improvements`
3. **Start with Phase 1** (Quick Wins - 1 hour)
4. **Proceed systematically** through phases
5. **Test continuously** after each task
6. **Document learnings** for future audits

---

**Plan Status:** ✅ Complete  
**Ready for Implementation:** ✅ Yes  
**Estimated Completion:** 2 weeks from start date
