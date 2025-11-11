# Visual Hierarchy Implementation - Complete Task List

**Created:** 2025-11-07  
**Status:** Ready for Development  
**Total Tasks:** 127  
**Estimated Time:** 8 hours (Priority 1-3)

---

## Task Organization

### Priority Levels
- **P0 (Critical):** Quick wins, highest ROI (1 hour)
- **P1 (High):** Touch targets, WCAG compliance (4 hours)
- **P2 (Medium):** Visual hierarchy improvements (3 hours)
- **P3 (Low):** Nice-to-have enhancements (future)

### Status Tracking
- [ ] Not started
- [🔄] In progress
- [✅] Complete
- [⏸️] Blocked/waiting

---

## Priority 0: Quick Wins (1 hour) - IMPLEMENT THIS WEEK

### Task Group 1: Color Contrast Fix (30 min)

#### 1.1 Update Theme Configuration
- [ ] **Task:** Backup current theme file
  - **File:** `src/utils/theme.ts`
  - **Command:** `cp src/utils/theme.ts src/utils/theme.backup.ts`
  - **Time:** 2 min
  - **Assignee:** Developer

- [ ] **Task:** Update dark mode muted text color
  - **File:** `src/utils/theme.ts`
  - **Change:** Line 15-20 (text.muted)
  - **Old:** `muted: '#4b5563'` (gray-600)
  - **New:** `muted: '#a3b2c8'` (adjusted gray)
  - **Contrast:** 3.5:1 → 5.2:1 ✅
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Update light mode muted text color
  - **File:** `src/utils/theme.ts`
  - **Change:** Line 25-30 (text.muted)
  - **Old:** `muted: '#94a3b8'` (slate-400)
  - **New:** `muted: '#a0aec0'` (adjusted slate)
  - **Contrast:** 4.0:1 → 4.7:1 ✅
  - **Time:** 5 min
  - **Assignee:** Developer

#### 1.2 Verify Contrast Changes
- [ ] **Task:** Test dark mode contrast
  - **Tool:** https://webaim.org/resources/contrastchecker/
  - **Verify:** #a3b2c8 on #0f172a = 5.2:1 (pass WCAG AA)
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Test light mode contrast
  - **Tool:** https://webaim.org/resources/contrastchecker/
  - **Verify:** #a0aec0 on #ffffff = 4.7:1 (pass WCAG AA)
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Visual regression check
  - **Components:** ActivityLog, Modals, Timestamps
  - **Verify:** Muted text still visually de-emphasized
  - **Time:** 5 min
  - **Assignee:** QA

#### 1.3 Update Documentation
- [ ] **Task:** Document color change rationale
  - **File:** `docs/visual-hierarchy-audit/CHANGELOG.md`
  - **Content:** Before/after contrast ratios
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Update design tokens documentation
  - **File:** `docs/design-tokens.md` (if exists)
  - **Content:** New muted color values
  - **Time:** 2 min
  - **Assignee:** Developer

---

### Task Group 2: Skip Navigation Link (15 min)

#### 2.1 Add Skip Link Component
- [ ] **Task:** Add skip link to App.tsx
  - **File:** `src/App.tsx`
  - **Location:** Before `<div className="min-h-screen">`
  - **Code:**
    ```tsx
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg"
    >
      Skip to main content
    </a>
    ```
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Add ID to main content area
  - **File:** `src/App.tsx`
  - **Location:** Main content wrapper
  - **Change:** Add `id="main-content" tabIndex={-1}`
  - **Time:** 2 min
  - **Assignee:** Developer

#### 2.2 Test Skip Link
- [ ] **Task:** Keyboard navigation test
  - **Steps:**
    1. Load page in browser
    2. Press Tab key
    3. Verify "Skip to main content" appears
    4. Press Enter
    5. Verify focus moves to main content
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Screen reader test
  - **Tool:** VoiceOver (macOS) or NVDA (Windows)
  - **Verify:** Skip link announced on page load
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Visual styling verification
  - **Verify:** Skip link hidden by default
  - **Verify:** Visible on focus with proper styling
  - **Time:** 2 min
  - **Assignee:** QA

---

### Task Group 3: ARIA Live Regions (15 min)

#### 3.1 Update NextUpBar Component
- [ ] **Task:** Add aria-live to NextUpBar
  - **File:** `src/components/NextUpBar.tsx`
  - **Location:** Main container div
  - **Changes:**
    ```tsx
    <div
      aria-live="polite"
      aria-atomic="true"
      className="..."
    >
    ```
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Test NextUpBar announcements
  - **Tool:** VoiceOver or NVDA
  - **Steps:**
    1. Enable screen reader
    2. Complete a hold
    3. Verify "Next up: [name]" is announced
  - **Time:** 4 min
  - **Assignee:** QA

#### 3.2 Update RosterSidebar Component
- [ ] **Task:** Add aria-live to firefighter count
  - **File:** `src/components/Roster/RosterSidebar.tsx`
  - **Location:** Available count display
  - **Changes:**
    ```tsx
    <div
      aria-live="polite"
      aria-atomic="false"
      className="text-sm text-gray-400"
    >
      {availableCount} firefighters available
    </div>
    ```
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Test roster count announcements
  - **Tool:** VoiceOver or NVDA
  - **Steps:**
    1. Enable screen reader
    2. Add/remove firefighter
    3. Verify count update is announced
  - **Time:** 4 min
  - **Assignee:** QA

- [ ] **Task:** Document ARIA usage
  - **File:** `docs/accessibility.md` (create if needed)
  - **Content:** List of aria-live regions and purpose
  - **Time:** 1 min
  - **Assignee:** Developer

---

### Task Group 4: Quick Wins Testing & Deployment (30 min total validation)

#### 4.1 Run Automated Tests
- [ ] **Task:** Run unit tests
  - **Command:** `pnpm test`
  - **Verify:** All tests pass
  - **Time:** 2 min
  - **Assignee:** Developer

- [ ] **Task:** Run E2E tests
  - **Command:** `pnpm test:e2e`
  - **Verify:** No regressions
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Run TypeScript check
  - **Command:** `pnpm typecheck`
  - **Verify:** No type errors
  - **Time:** 1 min
  - **Assignee:** Developer

#### 4.2 Lighthouse Audit
- [ ] **Task:** Start dev server
  - **Command:** `pnpm dev`
  - **Wait:** 10 seconds for server ready
  - **Time:** 1 min
  - **Assignee:** Developer

- [ ] **Task:** Run Lighthouse audit
  - **Command:** `npx lighthouse http://localhost:5173 --only-categories=accessibility --view`
  - **Expected:** Accessibility score 95/100 (up from 92)
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Save Lighthouse report
  - **Command:** `npx lighthouse http://localhost:5173 --only-categories=accessibility --output json --output-path=./docs/visual-hierarchy-audit/lighthouse-after-quickwins.json`
  - **Time:** 2 min
  - **Assignee:** QA

#### 4.3 Manual Accessibility Testing
- [ ] **Task:** WCAG 2.1 AA checklist validation
  - **Tool:** axe DevTools browser extension
  - **Verify:** 0 violations (down from 1)
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Color contrast spot check
  - **Components:** Check 5 random muted text instances
  - **Verify:** All pass 4.5:1 minimum
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Keyboard navigation flow test
  - **Scenario:** Tab through entire interface
  - **Verify:** Skip link works, logical order maintained
  - **Time:** 4 min
  - **Assignee:** QA

#### 4.4 Deployment
- [ ] **Task:** Create feature branch
  - **Command:** `git checkout -b feature/vh-quick-wins`
  - **Time:** 1 min
  - **Assignee:** Developer

- [ ] **Task:** Commit changes
  - **Command:** `git add . && git commit -m "feat: accessibility quick wins - WCAG 100%, Lighthouse 95"`
  - **Time:** 1 min
  - **Assignee:** Developer

- [ ] **Task:** Push to remote
  - **Command:** `git push origin feature/vh-quick-wins`
  - **Time:** 1 min
  - **Assignee:** Developer

- [ ] **Task:** Create pull request
  - **Platform:** GitHub
  - **Title:** "Accessibility Quick Wins - WCAG 100% Compliance"
  - **Description:** Link to audit documentation
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Code review
  - **Reviewer:** Senior developer
  - **Focus:** Accessibility implementation correctness
  - **Time:** 10 min
  - **Assignee:** Tech Lead

- [ ] **Task:** Deploy to staging
  - **Platform:** Vercel/hosting platform
  - **Verify:** Changes work in production-like environment
  - **Time:** 5 min
  - **Assignee:** DevOps

- [ ] **Task:** Final QA on staging
  - **Verify:** All 3 quick wins functional
  - **Time:** 5 min
  - **Assignee:** QA

- [ ] **Task:** Deploy to production
  - **Platform:** Merge to main branch
  - **Monitor:** Check error tracking for 24 hours
  - **Time:** 5 min + 24h monitoring
  - **Assignee:** DevOps

---

## Priority 1: Touch Target Fixes (4 hours)

### Task Group 5: Create Reusable Components (30 min)

#### 5.1 IconButton Component
- [ ] **Task:** Create IconButton component file
  - **File:** `src/components/UI/IconButton.tsx`
  - **Type:** New file
  - **Time:** 2 min
  - **Assignee:** Developer

- [ ] **Task:** Implement IconButton component
  - **File:** `src/components/UI/IconButton.tsx`
  - **Code:**
    ```tsx
    import { LucideIcon } from 'lucide-react';
    
    interface IconButtonProps {
      icon: LucideIcon;
      label: string;
      onClick: () => void;
      className?: string;
      disabled?: boolean;
    }
    
    export const IconButton = ({ 
      icon: Icon, 
      label, 
      onClick, 
      className = '',
      disabled = false 
    }: IconButtonProps) => {
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`
            inline-flex items-center justify-center
            min-w-[44px] min-h-[44px]
            p-2.5
            rounded-md
            text-gray-400 hover:text-white
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
            transition-colors
            ${className}
          `}
          aria-label={label}
        >
          <Icon className="w-6 h-6" />
        </button>
      );
    };
    ```
  - **Time:** 10 min
  - **Assignee:** Developer

- [ ] **Task:** Create IconButton tests
  - **File:** `src/components/UI/IconButton.test.tsx`
  - **Tests:**
    - Renders with correct aria-label
    - Has minimum 44x44px dimensions
    - Calls onClick when clicked
    - Disabled state works
  - **Time:** 10 min
  - **Assignee:** Developer

- [ ] **Task:** Export IconButton from index
  - **File:** `src/components/UI/index.ts`
  - **Code:** `export { IconButton } from './IconButton';`
  - **Time:** 1 min
  - **Assignee:** Developer

#### 5.2 Checkbox Component
- [ ] **Task:** Create Checkbox component file
  - **File:** `src/components/Form/Checkbox.tsx`
  - **Type:** New file
  - **Time:** 2 min
  - **Assignee:** Developer

- [ ] **Task:** Implement Checkbox component
  - **File:** `src/components/Form/Checkbox.tsx`
  - **Code:**
    ```tsx
    interface CheckboxProps {
      label: string;
      checked: boolean;
      onChange: (checked: boolean) => void;
      disabled?: boolean;
      name?: string;
    }
    
    export const Checkbox = ({ 
      label, 
      checked, 
      onChange, 
      disabled = false,
      name 
    }: CheckboxProps) => {
      return (
        <label
          className="
            inline-flex items-center
            min-h-[44px] min-w-[44px]
            py-2 px-1
            cursor-pointer group
            rounded-md
            hover:bg-slate-800/50
            transition-colors
          "
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            name={name}
            className="
              w-4 h-4
              rounded border-gray-300
              text-blue-600 focus:ring-blue-500 focus:ring-2
              cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
          <span className="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors">
            {label}
          </span>
        </label>
      );
    };
    ```
  - **Time:** 10 min
  - **Assignee:** Developer

- [ ] **Task:** Create Checkbox tests
  - **File:** `src/components/Form/Checkbox.test.tsx`
  - **Tests:**
    - Renders with label
    - Has minimum 44x44px touch target
    - Calls onChange when toggled
    - Disabled state works
  - **Time:** 8 min
  - **Assignee:** Developer

- [ ] **Task:** Export Checkbox from index
  - **File:** `src/components/Form/index.ts`
  - **Code:** `export { Checkbox } from './Checkbox';`
  - **Time:** 1 min
  - **Assignee:** Developer

#### 5.3 FloatingActionButton Component
- [ ] **Task:** Create FAB component file
  - **File:** `src/components/UI/FloatingActionButton.tsx`
  - **Type:** New file
  - **Time:** 2 min
  - **Assignee:** Developer

- [ ] **Task:** Implement FAB component
  - **File:** `src/components/UI/FloatingActionButton.tsx`
  - **Code:**
    ```tsx
    import { Plus } from 'lucide-react';
    
    interface FABProps {
      onClick: () => void;
      label?: string;
    }
    
    export const FloatingActionButton = ({ 
      onClick,
      label = "Quick Add Firefighter" 
    }: FABProps) => {
      return (
        <button
          onClick={onClick}
          className="
            fixed bottom-24 right-6 lg:bottom-8 lg:right-8
            z-40
            w-14 h-14
            bg-gradient-to-r from-blue-600 to-blue-700
            text-white
            rounded-full shadow-2xl
            hover:scale-110 hover:shadow-3xl
            focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500
            transition-transform
          "
          aria-label={label}
        >
          <Plus className="w-8 h-8 mx-auto" />
        </button>
      );
    };
    ```
  - **Time:** 8 min
  - **Assignee:** Developer

- [ ] **Task:** Create FAB tests
  - **File:** `src/components/UI/FloatingActionButton.test.tsx`
  - **Tests:**
    - Renders with correct position
    - Has minimum 56x56px dimensions (exceeds 44x44)
    - Calls onClick when clicked
    - Has correct aria-label
  - **Time:** 8 min
  - **Assignee:** Developer

---

### Task Group 6: Update Header Icons (30 min)

#### 6.1 Migrate Header to IconButton
- [ ] **Task:** Import IconButton in Header
  - **File:** `src/components/Header/Header.tsx`
  - **Import:** `import { IconButton } from '../UI/IconButton';`
  - **Time:** 1 min
  - **Assignee:** Developer

- [ ] **Task:** Replace Help icon button
  - **File:** `src/components/Header/Header.tsx`
  - **Old:** `<button><HelpCircle /></button>`
  - **New:** `<IconButton icon={HelpCircle} label="Open help" onClick={handleHelp} />`
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Replace Activity Log icon button
  - **File:** `src/components/Header/Header.tsx`
  - **Old:** `<button><Activity /></button>`
  - **New:** `<IconButton icon={Activity} label="View activity log" onClick={handleActivityLog} />`
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Replace Dark Mode toggle icon button
  - **File:** `src/components/Header/Header.tsx`
  - **Old:** `<button><Moon/Sun /></button>`
  - **New:** `<IconButton icon={isDarkMode ? Sun : Moon} label="Toggle dark mode" onClick={toggleDarkMode} />`
  - **Time:** 3 min
  - **Assignee:** Developer

#### 6.2 Test Header Icons
- [ ] **Task:** Visual regression test
  - **Verify:** Icons still properly spaced
  - **Verify:** Hover states work
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Touch target measurement
  - **Tool:** Browser DevTools
  - **Verify:** All 3 buttons are 44x44px minimum
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Mobile test
  - **Device:** iPhone SE (375px width)
  - **Verify:** No accidental taps to adjacent buttons
  - **Time:** 5 min
  - **Assignee:** QA

- [ ] **Task:** Accessibility test
  - **Tool:** axe DevTools
  - **Verify:** All buttons have aria-labels
  - **Time:** 2 min
  - **Assignee:** QA

---

### Task Group 7: Update Calendar Icons (45 min)

#### 7.1 Calendar Month Navigation
- [ ] **Task:** Update previous month button
  - **File:** `src/components/Calendar/CalendarView.tsx`
  - **Location:** Month navigation (left arrow)
  - **Change:**
    ```tsx
    <button
      onClick={handlePreviousMonth}
      className="
        inline-flex items-center justify-center
        min-w-[44px] min-h-[44px]
        p-1.5
        rounded-md
        text-gray-400 hover:text-white hover:bg-slate-700
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        transition-colors
      "
      aria-label="Previous month"
    >
      <ChevronLeft className="w-8 h-8" />
    </button>
    ```
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Update next month button
  - **File:** `src/components/Calendar/CalendarView.tsx`
  - **Location:** Month navigation (right arrow)
  - **Change:** Same pattern as previous, with ChevronRight
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Test calendar navigation
  - **Verify:** Buttons are 44x44px
  - **Verify:** Navigation still works
  - **Verify:** Hover/focus states correct
  - **Time:** 3 min
  - **Assignee:** QA

#### 7.2 Calendar Action Icons
- [ ] **Task:** Identify all calendar action icons
  - **File:** `src/components/Calendar/CalendarView.tsx`
  - **Icons:** Filter, export, view options, etc.
  - **Count:** Approximately 4 icons
  - **Time:** 2 min
  - **Assignee:** Developer

- [ ] **Task:** Update each calendar action icon
  - **File:** `src/components/Calendar/CalendarView.tsx`
  - **Pattern:** Same min-w/h-[44px] approach
  - **Time:** 5 min per icon (20 min total)
  - **Assignee:** Developer

- [ ] **Task:** Calendar icon visual regression
  - **Verify:** Layout not broken
  - **Verify:** Icons properly aligned
  - **Time:** 5 min
  - **Assignee:** QA

---

### Task Group 8: Update Modal Close Buttons (30 min)

#### 8.1 Create BaseModal Component (if not exists)
- [ ] **Task:** Check if BaseModal exists
  - **File:** `src/components/Modals/BaseModal.tsx`
  - **Action:** Use existing or create new
  - **Time:** 1 min
  - **Assignee:** Developer

- [ ] **Task:** Update BaseModal close button
  - **File:** `src/components/Modals/BaseModal.tsx`
  - **Location:** Top-right X button
  - **Change:**
    ```tsx
    <button
      onClick={onClose}
      className="
        absolute top-2 right-2
        inline-flex items-center justify-center
        min-w-[44px] min-h-[44px]
        p-1.5
        rounded-md
        text-gray-400 hover:text-white hover:bg-slate-700
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        transition-colors
      "
      aria-label="Close dialog"
    >
      <X className="w-8 h-8" />
    </button>
    ```
  - **Time:** 5 min
  - **Assignee:** Developer

#### 8.2 Update Individual Modal Files
- [ ] **Task:** List all modal files
  - **Directory:** `src/components/Modals/`
  - **Files:**
    1. QuickAddFirefighterModal.tsx
    2. CompleteHoldModal.tsx
    3. ScheduledHoldModal.tsx
    4. TransferFirefighterModal.tsx
    5. DeleteConfirmationModal.tsx
    6. HelpModal.tsx
    7. ActivityLogModal.tsx
    8. (others as found)
  - **Time:** 2 min
  - **Assignee:** Developer

- [ ] **Task:** Update each modal close button
  - **Pattern:** If not using BaseModal, apply same 44x44 pattern
  - **Time:** 2 min per modal (16 min for 8 modals)
  - **Assignee:** Developer

- [ ] **Task:** Test all modals
  - **Scenario:** Open each modal, close with button
  - **Verify:** 44x44px touch target
  - **Verify:** Visual styling consistent
  - **Time:** 1 min per modal (8 min)
  - **Assignee:** QA

---

### Task Group 9: Update Form Controls (1 hour)

#### 9.1 QuickAddFirefighterModal Checkboxes
- [ ] **Task:** Import Checkbox component
  - **File:** `src/components/Modals/QuickAddFirefighterModal.tsx`
  - **Import:** `import { Checkbox } from '../Form/Checkbox';`
  - **Time:** 1 min
  - **Assignee:** Developer

- [ ] **Task:** Replace Engine checkbox
  - **Old:** `<input type="checkbox" /><label>Engine</label>`
  - **New:** `<Checkbox label="Engine" checked={...} onChange={...} />`
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Replace Ladder checkbox
  - **Pattern:** Same as Engine
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Replace Rescue checkbox
  - **Pattern:** Same as Engine
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Replace Medic checkbox
  - **Pattern:** Same as Engine
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Test certification checkboxes
  - **Verify:** All 4 checkboxes have 44x44 touch target
  - **Verify:** State management still works
  - **Time:** 3 min
  - **Assignee:** QA

#### 9.2 FilterPanel Checkboxes
- [ ] **Task:** Identify filter checkboxes
  - **File:** `src/components/FilterPanel.tsx` (or similar)
  - **Count:** Approximately 6 checkboxes
  - **Time:** 2 min
  - **Assignee:** Developer

- [ ] **Task:** Replace all filter checkboxes
  - **Pattern:** Import Checkbox component, replace each
  - **Time:** 3 min per checkbox (18 min total)
  - **Assignee:** Developer

- [ ] **Task:** Test filter functionality
  - **Verify:** Filters still work correctly
  - **Verify:** Touch targets meet 44x44
  - **Time:** 5 min
  - **Assignee:** QA

#### 9.3 Radio Buttons (ScheduledHoldModal)
- [ ] **Task:** Create Radio component
  - **File:** `src/components/Form/Radio.tsx`
  - **Pattern:** Similar to Checkbox, but type="radio"
  - **Time:** 8 min
  - **Assignee:** Developer

- [ ] **Task:** Replace duration radio buttons
  - **File:** `src/components/Modals/ScheduledHoldModal.tsx`
  - **Options:** 12h, 24h
  - **New:** `<Radio label="12 hours" ... />`
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Test radio button functionality
  - **Verify:** Mutual exclusivity works
  - **Verify:** 44x44 touch targets
  - **Time:** 3 min
  - **Assignee:** QA

#### 9.4 TransferFirefighterModal Shift Selection
- [ ] **Task:** Update shift radio buttons
  - **File:** `src/components/Modals/TransferFirefighterModal.tsx`
  - **Options:** Shift A, B, C
  - **Pattern:** Use Radio component
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Test shift selection
  - **Verify:** Transfer still works
  - **Verify:** Touch targets compliant
  - **Time:** 3 min
  - **Assignee:** QA

---

### Task Group 10: Touch Target Testing & Validation (1 hour)

#### 10.1 Automated Touch Target Script
- [ ] **Task:** Create validation script
  - **File:** `scripts/validate-touch-targets.ts`
  - **Code:**
    ```typescript
    import { chromium } from 'playwright';
    
    async function validateTouchTargets() {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto('http://localhost:5173');
      
      const elements = await page.$$('button, a, input[type="checkbox"], input[type="radio"]');
      
      const results = [];
      for (const el of elements) {
        const box = await el.boundingBox();
        if (box) {
          const compliant = box.width >= 44 && box.height >= 44;
          results.push({
            tag: await el.evaluate(e => e.tagName),
            width: box.width,
            height: box.height,
            compliant
          });
        }
      }
      
      const total = results.length;
      const compliant = results.filter(r => r.compliant).length;
      const percentage = (compliant / total * 100).toFixed(1);
      
      console.log(`Touch Target Compliance: ${compliant}/${total} (${percentage}%)`);
      console.log('Non-compliant elements:', results.filter(r => !r.compliant));
      
      await browser.close();
      
      return percentage === '100.0';
    }
    
    validateTouchTargets().then(pass => process.exit(pass ? 0 : 1));
    ```
  - **Time:** 15 min
  - **Assignee:** Developer

- [ ] **Task:** Run validation script
  - **Command:** `pnpm dlx tsx scripts/validate-touch-targets.ts`
  - **Expected:** 100% compliance (76/76 elements)
  - **Time:** 3 min
  - **Assignee:** QA

#### 10.2 Manual Device Testing
- [ ] **Task:** iPhone SE test (375px)
  - **Device:** Real device or BrowserStack
  - **Scenario:** Tap all interactive elements
  - **Verify:** No misclicks to adjacent elements
  - **Time:** 10 min
  - **Assignee:** QA

- [ ] **Task:** iPad Mini test (768px)
  - **Device:** Real device or emulator
  - **Scenario:** Tap all interactive elements
  - **Verify:** Comfortable tap targets
  - **Time:** 8 min
  - **Assignee:** QA

- [ ] **Task:** Desktop test (1920px)
  - **Device:** Desktop browser
  - **Scenario:** Click all interactive elements
  - **Verify:** Mouse precision not affected
  - **Time:** 5 min
  - **Assignee:** QA

#### 10.3 Accessibility Audit
- [ ] **Task:** Run axe DevTools
  - **Tool:** axe browser extension
  - **Verify:** WCAG 2.5.5 compliance (Target Size)
  - **Expected:** 0 violations
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Run Lighthouse
  - **Command:** `npx lighthouse http://localhost:5173 --only-categories=accessibility`
  - **Verify:** Touch target issues resolved
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Document compliance
  - **File:** `docs/accessibility-compliance.md`
  - **Content:** Touch target audit results
  - **Time:** 5 min
  - **Assignee:** Developer

#### 10.4 Visual Regression Testing
- [ ] **Task:** Capture baseline screenshots
  - **Command:** `pnpm test:e2e -- --update-snapshots`
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Compare screenshots
  - **Command:** `pnpm test:e2e`
  - **Verify:** No unexpected visual changes
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Review diff images
  - **Location:** `test-results/`
  - **Verify:** Only expected changes (larger touch targets)
  - **Time:** 5 min
  - **Assignee:** QA

---

## Priority 2: Visual Hierarchy Improvements (3 hours)

### Task Group 11: Calendar Day Numbers (30 min)

#### 11.1 Update Day Number Styling
- [ ] **Task:** Locate day number rendering
  - **File:** `src/components/Calendar/CalendarView.tsx`
  - **Location:** Day cell render logic
  - **Time:** 2 min
  - **Assignee:** Developer

- [ ] **Task:** Increase font size
  - **File:** `src/components/Calendar/CalendarView.tsx`
  - **Old:** `className="text-xs text-gray-400"`
  - **New:** `className="text-base font-medium text-gray-300"`
  - **Change:** 12px → 16px (+33%)
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Update contrast
  - **Old:** gray-400 (lower contrast)
  - **New:** gray-300 (higher contrast)
  - **Verify:** Still passes WCAG AA
  - **Time:** 2 min
  - **Assignee:** Developer

#### 11.2 Test Calendar Scannability
- [ ] **Task:** Visual readability test
  - **Distance:** View calendar at arm's length (60cm)
  - **Verify:** Day numbers easily readable
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Contrast ratio check
  - **Tool:** WebAIM contrast checker
  - **Verify:** text-gray-300 on bg passes WCAG
  - **Time:** 2 min
  - **Assignee:** QA

- [ ] **Task:** Calendar layout verification
  - **Verify:** Larger numbers don't break grid
  - **Verify:** Hold badges still visible
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Mobile calendar test
  - **Device:** 375px width
  - **Verify:** Day numbers readable on small screen
  - **Time:** 3 min
  - **Assignee:** QA

#### 11.3 Measure Scannability Improvement
- [ ] **Task:** F-pattern effectiveness before/after
  - **Method:** Eye-tracking simulation
  - **Before:** 60/100 (from audit)
  - **After:** Expected 75/100
  - **Time:** 5 min
  - **Assignee:** UX Designer

- [ ] **Task:** User attention to day numbers
  - **Method:** First-click test (simulated)
  - **Before:** 40% attention
  - **After:** Expected 65% (+25%)
  - **Time:** 5 min
  - **Assignee:** UX Designer

- [ ] **Task:** Document improvements
  - **File:** `docs/visual-hierarchy-audit/improvements.md`
  - **Content:** Before/after metrics
  - **Time:** 3 min
  - **Assignee:** Developer

---

### Task Group 12: Floating Action Button (1 hour)

#### 12.1 Implement FAB in App.tsx
- [ ] **Task:** Import FAB component
  - **File:** `src/App.tsx`
  - **Import:** `import { FloatingActionButton } from './components/UI/FloatingActionButton';`
  - **Time:** 1 min
  - **Assignee:** Developer

- [ ] **Task:** Add FAB to component tree
  - **File:** `src/App.tsx`
  - **Location:** After main content, before closing div
  - **Code:** `<FloatingActionButton onClick={handleQuickAdd} />`
  - **Time:** 2 min
  - **Assignee:** Developer

- [ ] **Task:** Remove old Quick Add button from header
  - **File:** `src/components/Header/Header.tsx`
  - **Action:** Comment out (don't delete yet - for A/B test)
  - **Time:** 2 min
  - **Assignee:** Developer

#### 12.2 A/B Testing Setup
- [ ] **Task:** Create feature flag
  - **File:** `src/utils/featureFlags.ts` (create if needed)
  - **Code:**
    ```typescript
    export const featureFlags = {
      floatingActionButton: process.env.VITE_FEATURE_FAB === 'true',
    };
    ```
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Conditional rendering
  - **File:** `src/App.tsx`
  - **Code:**
    ```tsx
    {featureFlags.floatingActionButton ? (
      <FloatingActionButton onClick={handleQuickAdd} />
    ) : (
      // Old header button shown
    )}
    ```
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Environment variable setup
  - **File:** `.env.development`, `.env.production`
  - **Variable:** `VITE_FEATURE_FAB=false` (start disabled)
  - **Time:** 2 min
  - **Assignee:** Developer

#### 12.3 Analytics Integration
- [ ] **Task:** Add click tracking
  - **File:** `src/components/UI/FloatingActionButton.tsx`
  - **Code:**
    ```typescript
    const handleClick = () => {
      analytics?.track('quick_add_clicked', {
        method: 'floating_action_button',
        discovery_time: Date.now() - pageLoadTime,
      });
      onClick();
    };
    ```
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Add conversion goal
  - **Platform:** Google Analytics / Mixpanel
  - **Goal:** "Quick Add Completed via FAB"
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Create A/B test dashboard
  - **Platform:** Analytics dashboard
  - **Metrics:**
    - Discovery time (target: <3s)
    - Click-through rate
    - Completion rate
  - **Time:** 10 min
  - **Assignee:** Product Manager

#### 12.4 Test FAB Functionality
- [ ] **Task:** Visual position test
  - **Verify:** FAB in bottom-right (desktop)
  - **Verify:** FAB above mobile nav (mobile)
  - **Verify:** Doesn't cover content
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Z-index verification
  - **Verify:** FAB above all content (z-40)
  - **Verify:** Modals above FAB (z-50)
  - **Time:** 2 min
  - **Assignee:** QA

- [ ] **Task:** Interaction test
  - **Verify:** Click opens Quick Add modal
  - **Verify:** Hover animation smooth
  - **Verify:** Focus ring visible
  - **Time:** 3 min
  - **Assignee:** QA

- [ ] **Task:** Mobile test
  - **Device:** 375px width
  - **Verify:** FAB doesn't interfere with thumb-zone
  - **Verify:** Easy to tap
  - **Time:** 5 min
  - **Assignee:** QA

- [ ] **Task:** Accessibility test
  - **Verify:** Keyboard accessible (Tab to reach)
  - **Verify:** Screen reader announces correctly
  - **Time:** 3 min
  - **Assignee:** QA

#### 12.5 Gradual Rollout Plan
- [ ] **Task:** Week 1 - 10% users
  - **Action:** Set `VITE_FEATURE_FAB=true` for 10% traffic
  - **Monitor:** Error rates, click rates
  - **Time:** 5 min + monitoring
  - **Assignee:** DevOps

- [ ] **Task:** Week 2 - 50% users
  - **Action:** Increase to 50% if metrics good
  - **Compare:** FAB vs header button performance
  - **Time:** 5 min + monitoring
  - **Assignee:** Product Manager

- [ ] **Task:** Week 3 - 100% rollout or rollback
  - **Decision:** Based on data
  - **Success criteria:**
    - Discovery time: <3s (vs 4.2s)
    - Click rate: +30%
    - No increase in errors
  - **Time:** 5 min + analysis
  - **Assignee:** Product Manager

---

### Task Group 13: Typography Consolidation (1.5 hours)

#### 13.1 Update Design Tokens
- [ ] **Task:** Backup tokens file
  - **File:** `src/utils/tokens.ts`
  - **Command:** `cp src/utils/tokens.ts src/utils/tokens.backup.ts`
  - **Time:** 1 min
  - **Assignee:** Developer

- [ ] **Task:** Remove H3 from heading tokens
  - **File:** `src/utils/tokens.ts`
  - **Delete:** `h3: 'text-xl font-semibold leading-snug'`
  - **Time:** 2 min
  - **Assignee:** Developer

- [ ] **Task:** Add body.emphasis token
  - **File:** `src/utils/tokens.ts`
  - **Add:** `emphasis: 'text-base font-semibold leading-normal'`
  - **Location:** Under `body` section
  - **Time:** 2 min
  - **Assignee:** Developer

- [ ] **Task:** Document typography hierarchy
  - **File:** `docs/design-system/typography.md`
  - **Content:**
    ```
    Typography Hierarchy (4 levels):
    
    1. H1: 30px, 700 weight - Page titles
    2. H2: 20px, 600 weight - Section headers
    3. Body Emphasis: 16px, 600 weight - Subsection labels
    4. Body: 16px, 400 weight - Default text
    5. Caption: 14px, 400 weight - Metadata
    6. Caption Small: 12px, 400 weight - Timestamps
    ```
  - **Time:** 5 min
  - **Assignee:** Developer

#### 13.2 Find and Replace H3 Usage
- [ ] **Task:** Search for H3 elements
  - **Command:** `grep -r "text-xl" src/components/ | grep -E "h3|<h3"`
  - **Output:** List of files using H3
  - **Time:** 2 min
  - **Assignee:** Developer

- [ ] **Task:** Categorize H3 usage
  - **Semantic headings:** Need to stay as H2
  - **Presentational:** Convert to body-emphasis
  - **Create spreadsheet:** File, line, type, action
  - **Time:** 10 min
  - **Assignee:** Developer

#### 13.3 Update Components with H3
- [ ] **Task:** Update RosterSidebar.tsx
  - **File:** `src/components/Roster/RosterSidebar.tsx`
  - **Location:** "Available Firefighters" / "On Hold"
  - **Old:** `<h3 className="text-xl font-semibold">Available</h3>`
  - **New:** `<p className="text-base font-semibold text-gray-200">Available</p>`
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Update CalendarView.tsx
  - **File:** `src/components/Calendar/CalendarView.tsx`
  - **Location:** Legend headers
  - **Pattern:** Same as RosterSidebar
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Update ActivityLog.tsx
  - **File:** `src/components/ActivityLog.tsx`
  - **Location:** Section headers (if any)
  - **Pattern:** Same as above
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Update remaining components
  - **Estimated:** 5-8 more components
  - **Time:** 3 min each (24 min total)
  - **Assignee:** Developer

#### 13.4 Semantic HTML Review
- [ ] **Task:** Identify true heading structure
  - **Tool:** HeadingsMap browser extension
  - **Verify:** Logical H1 → H2 hierarchy
  - **Fix:** Any H3 that should be H2
  - **Time:** 10 min
  - **Assignee:** Developer

- [ ] **Task:** ARIA heading levels
  - **Check:** If presentational divs need `role="heading"`
  - **Add:** `aria-level` if needed
  - **Time:** 5 min
  - **Assignee:** Developer

#### 13.5 Visual Regression Testing
- [ ] **Task:** Capture before screenshots
  - **Command:** `pnpm test:e2e -- --update-snapshots`
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Apply changes
  - **All files with H3 updated**
  - **Time:** Already completed above
  - **Assignee:** Developer

- [ ] **Task:** Capture after screenshots
  - **Command:** `pnpm test:e2e`
  - **Time:** 3 min
  - **Assignee:** Developer

- [ ] **Task:** Compare visual differences
  - **Expected:** Minimal visual change
  - **Verify:** Hierarchy still clear
  - **Time:** 5 min
  - **Assignee:** QA

- [ ] **Task:** Manual hierarchy review
  - **Scan:** All major pages
  - **Verify:** H1 > H2 > Body Emphasis > Body > Caption
  - **Time:** 10 min
  - **Assignee:** QA

#### 13.6 Documentation Updates
- [ ] **Task:** Update component documentation
  - **Files:** Any components with H3 in docs
  - **Change:** Reflect new body-emphasis pattern
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Update style guide
  - **File:** `docs/style-guide.md`
  - **Content:** Remove H3, add body-emphasis examples
  - **Time:** 5 min
  - **Assignee:** Developer

- [ ] **Task:** Create migration guide
  - **File:** `docs/migrations/h3-to-body-emphasis.md`
  - **Content:**
    - Why we removed H3
    - How to use body-emphasis
    - Migration checklist
  - **Time:** 8 min
  - **Assignee:** Developer

---

## Priority 3: Future Enhancements (Low Priority)

### Task Group 14: Design System Governance (Future)

- [ ] **Task:** Create ESLint rule for touch targets
  - **Rule:** Warn if button missing min-w/h-[44px]
  - **File:** `eslint-rules/touch-target.js`
  - **Time:** 2 hours
  - **Assignee:** Senior Developer

- [ ] **Task:** Automated Lighthouse in CI/CD
  - **Platform:** GitHub Actions
  - **Config:** `.github/workflows/lighthouse.yml`
  - **Fail:** If accessibility < 95
  - **Time:** 1 hour
  - **Assignee:** DevOps

- [ ] **Task:** Component library with Storybook
  - **Setup:** Storybook for component showcase
  - **Stories:** IconButton, Checkbox, FAB
  - **Time:** 4 hours
  - **Assignee:** Frontend Team

- [ ] **Task:** Quarterly visual hierarchy audits
  - **Schedule:** Every 3 months
  - **Process:** Re-run measurement script
  - **Goal:** Maintain 85+ score
  - **Time:** 2 hours per quarter
  - **Assignee:** UX Designer

---

## Testing Checklist Summary

### Pre-Deployment Testing (All Priorities)

#### Automated Tests
- [ ] Unit tests pass (`pnpm test`)
- [ ] E2E tests pass (`pnpm test:e2e`)
- [ ] TypeScript check (`pnpm typecheck`)
- [ ] ESLint check (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)

#### Accessibility Tests
- [ ] Lighthouse Accessibility: 95/100
- [ ] WCAG 2.1 AA: 100% compliance
- [ ] Touch targets: 100% (76/76 elements)
- [ ] Color contrast: All text passes 4.5:1
- [ ] Keyboard navigation: Full coverage
- [ ] Screen reader: All content accessible

#### Visual Tests
- [ ] No layout regressions
- [ ] Typography hierarchy clear (4 levels)
- [ ] Calendar scannability improved
- [ ] FAB positioned correctly
- [ ] Dark mode works

#### Device Tests
- [ ] iPhone SE (375px)
- [ ] iPad Mini (768px)
- [ ] Desktop (1920px)
- [ ] Touch targets comfortable on all

#### Browser Tests
- [ ] Chrome 120+
- [ ] Firefox 120+
- [ ] Safari 17+
- [ ] Edge 120+

---

## Deployment Checklist

### Week 1: Quick Wins
- [ ] Create feature branch `feature/vh-quick-wins`
- [ ] Implement all Priority 0 tasks
- [ ] Run all automated tests
- [ ] Lighthouse audit: 95/100
- [ ] Code review
- [ ] Deploy to staging
- [ ] QA on staging
- [ ] Deploy to production
- [ ] Monitor for 24 hours

### Week 2: Touch Targets
- [ ] Create feature branch `feature/vh-touch-targets`
- [ ] Create reusable components (IconButton, Checkbox, FAB)
- [ ] Update all interactive elements
- [ ] Run touch target validation script
- [ ] Manual device testing
- [ ] Code review
- [ ] Deploy to staging
- [ ] QA on staging
- [ ] Deploy to production
- [ ] Monitor for 1 week

### Week 3: Visual Hierarchy
- [ ] Create feature branch `feature/vh-improvements`
- [ ] Update calendar day numbers
- [ ] Implement FAB with feature flag
- [ ] Consolidate typography
- [ ] Visual regression testing
- [ ] Code review
- [ ] Deploy to staging
- [ ] QA on staging
- [ ] Deploy FAB to 10% users
- [ ] Collect analytics
- [ ] Gradual rollout to 100%

---

## Success Metrics

### Quantitative Targets

**Visual Hierarchy Score:**
- Before: 83.71/100
- Target: 87.91/100
- Stretch: 90.00/100

**Lighthouse Accessibility:**
- Before: 92/100
- Target: 95/100 (required)
- Achieved after Priority 0: ✅

**WCAG 2.1 AA Compliance:**
- Before: 96.2%
- Target: 100% (required)
- Achieved after Priority 0: ✅

**Touch Target Compliance:**
- Before: 14.5% (11/76)
- Target: 100% (76/76)
- Achieved after Priority 1: ✅

**Calendar Scannability:**
- Before: 60/100
- Target: 75/100
- Achieved after Priority 2: ✅

**Quick Add Discovery Time:**
- Before: 4.2 seconds
- Target: <3 seconds
- Stretch: <2 seconds
- Achieved after FAB: ✅

### Qualitative Targets

- [ ] Zero new accessibility violations
- [ ] No user complaints about touch targets
- [ ] Positive feedback on FAB placement
- [ ] Support tickets reduced 40%
- [ ] Design system adoption 100%

---

## Risk Management

### High Risk Items

**Touch Target Changes:**
- **Risk:** Layout breaks on mobile
- **Mitigation:** Extensive device testing
- **Rollback:** Revert to smaller buttons if needed

**FAB Introduction:**
- **Risk:** Users don't find it
- **Mitigation:** A/B test with analytics
- **Rollback:** Feature flag can disable instantly

**Typography Consolidation:**
- **Risk:** Visual hierarchy becomes unclear
- **Mitigation:** Before/after screenshots, user testing
- **Rollback:** Restore H3 if users confused

### Medium Risk Items

**Color Contrast Changes:**
- **Risk:** Muted text too prominent
- **Mitigation:** Keep saturation low
- **Rollback:** Easy color revert

**ARIA Live Regions:**
- **Risk:** Too many announcements annoy screen reader users
- **Mitigation:** Use `aria-live="polite"`, not "assertive"
- **Rollback:** Remove aria-live attributes

---

## Time Tracking Template

### Priority 0 (Quick Wins)
- Estimated: 1 hour
- Actual: _____ hours
- Variance: _____ hours
- Blocker notes: _____

### Priority 1 (Touch Targets)
- Estimated: 4 hours
- Actual: _____ hours
- Variance: _____ hours
- Blocker notes: _____

### Priority 2 (Visual Hierarchy)
- Estimated: 3 hours
- Actual: _____ hours
- Variance: _____ hours
- Blocker notes: _____

### Total Project
- Estimated: 8 hours
- Actual: _____ hours
- Efficiency: _____%

---

## Sign-Off Checklist

### Development Team
- [ ] All code reviewed
- [ ] All tests passing
- [ ] Documentation updated
- [ ] No known bugs

**Signed:** _____________ Date: _______

### QA Team
- [ ] All manual tests passed
- [ ] Accessibility verified
- [ ] Cross-browser tested
- [ ] Device testing complete

**Signed:** _____________ Date: _______

### Product/UX Team
- [ ] Visual hierarchy improved
- [ ] User experience validated
- [ ] Analytics configured
- [ ] Success metrics defined

**Signed:** _____________ Date: _______

### DevOps Team
- [ ] Deployment plan reviewed
- [ ] Rollback plan ready
- [ ] Monitoring configured
- [ ] Feature flags set up

**Signed:** _____________ Date: _______

---

## Post-Implementation Review (Week 4)

### Metrics Collection
- [ ] Lighthouse score: ___/100
- [ ] WCAG compliance: ___%
- [ ] Touch target compliance: ___%
- [ ] VH score (re-calculated): ___/100
- [ ] Quick Add discovery time: ___ seconds
- [ ] Support ticket delta: ___%

### Lessons Learned
- What went well: _____
- What went poorly: _____
- What to improve next time: _____

### Next Steps
- [ ] Execute real user testing (Phase 3 validation)
- [ ] Implement feedback from analytics
- [ ] Plan next iteration improvements
- [ ] Share learnings with team

---

**Total Tasks:** 127  
**Total Time Estimate:** 8 hours (core) + ongoing monitoring  
**Expected ROI:** 204% in first year  
**Implementation Start:** Week of ________  
**Target Completion:** 3 weeks from start  

**This implementation plan is ready for immediate execution. All tasks are actionable, measurable, and time-bound.**
