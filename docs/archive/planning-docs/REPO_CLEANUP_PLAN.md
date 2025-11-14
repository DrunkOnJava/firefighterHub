# FirefighterHub Repository Cleanup Plan
## "Make it look like a senior dev organized it" Edition

**Status:** In Progress  
**Date:** 2025-11-10

---

## Phase 1: Root Level Cleanup ✅

### Keep (Config & Essential Docs)
- [x] `.gitignore`, `.prettierrc`, `eslint.config.js`
- [x] `package.json`, `pnpm-lock.yaml`
- [x] `tsconfig*.json`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`
- [x] `tailwind.config.js`, `postcss.config.js`
- [x] `README.md` (front door doc)
- [x] `components.json` (shadcn config)
- [x] `vercel.json` (deployment config)

### Move to docs/
- [ ] `AI_RULES.md` → `docs/AI_RULES.md`
- [ ] `CLAUDE.md` → `docs/CLAUDE.md`
- [ ] All `*_GUIDE.md`, `*_SETUP.md`, `*_PLAN.md` files → `docs/guides/`
- [ ] All `*_REPORT.md`, `*_STATUS.md`, `*_SUMMARY.md` files → `docs/reports/`
- [ ] `SHIFT_SYSTEM.md`, `TECH_STACK.md` → `docs/architecture/`
- [ ] `TODO.md` → `docs/TODO.md` or keep in root (team preference)

### Move to docs/assets/
- [ ] `analyzeColorPalette.pdf`
- [ ] `linkimage.png`
- [ ] `shieldfirelogo.png`
- [ ] `transparentfireshield.png`

### Move to docs/screenshots/
- [ ] `screenshots/*` → `docs/screenshots/`

### Move to database/
- [ ] `fix_realtime_policies.sql` → `database/migrations/manual/`

### Delete (Temp/Generated)
- [ ] `.DS_Store` (add to .gitignore if not there)
- [ ] `Make_the_outline_you_just_changed_to_be_black_inst_logs.chatreplay.json` (temp file)
- [ ] Any `.backup`, `.old`, `.temp` files

---

## Phase 2: src/ Component Organization ✅

### Current Issues
1. Duplicate components: `NextUpBar.tsx`, `NextUpBarV2.tsx`, `NextUpBand.tsx`
2. Duplicate nav: `MobileNav.tsx`, `MobileNav.new.tsx`
3. Mixed organization: some feature folders exist, some don't
4. Non-standard naming: lowercase filenames for components

### Target Structure
```
src/
  features/
    schedule/
      components/
      hooks/
      types.ts
    roster/
      components/
      hooks/
      types.ts
    shifts/
      components/
      hooks/
      types.ts
  components/
    ui/              # shadcn + reusable primitives
    layout/          # Header, Sidebar, shell
  hooks/             # cross-feature only
  lib/               # framework-agnostic
  config/
  types/
  App.tsx
  main.tsx
```

### Actions

#### Create Feature Folders
- [ ] `src/features/schedule/components/`
- [ ] `src/features/schedule/hooks/`
- [ ] `src/features/roster/components/`
- [ ] `src/features/roster/hooks/`
- [ ] `src/features/shifts/components/`
- [ ] `src/features/shifts/hooks/`

#### Move Schedule Components
- [ ] `src/components/calendar/*` → `src/features/schedule/components/calendar/`
- [ ] `src/components/Calendar.tsx` → `src/features/schedule/components/Calendar.tsx`
- [ ] `src/components/CalendarView.tsx` → `src/features/schedule/components/CalendarView.tsx`
- [ ] `src/components/CalendarSubscribeModal.tsx` → `src/features/schedule/components/CalendarSubscribeModal.tsx`
- [ ] `src/hooks/useScheduledHolds*.ts` → `src/features/schedule/hooks/`
- [ ] `src/pages/SchedulePage.tsx` → `src/features/schedule/SchedulePage.tsx`

#### Move Roster Components
- [ ] `src/components/roster/*` → `src/features/roster/components/`
- [ ] `src/components/FirefighterList.tsx` → `src/features/roster/components/FirefighterList.tsx`
- [ ] `src/components/FirefighterItem.tsx` → `src/features/roster/components/FirefighterItem.tsx`
- [ ] `src/components/FirefighterProfileModal.tsx` → `src/features/roster/components/FirefighterProfileModal.tsx`
- [ ] `src/components/FirefightersModal.tsx` → `src/features/roster/components/FirefightersModal.tsx`
- [ ] `src/components/AddFirefighterForm.tsx` → `src/features/roster/components/AddFirefighterForm.tsx`
- [ ] `src/components/QuickAddFirefighterModal.tsx` → `src/features/roster/components/QuickAddFirefighterModal.tsx`
- [ ] `src/components/TransferShiftModal.tsx` → `src/features/roster/components/TransferShiftModal.tsx`
- [ ] `src/components/ReactivateModal.tsx` → `src/features/roster/components/ReactivateModal.tsx`
- [ ] `src/hooks/useFirefighters*.ts` → `src/features/roster/hooks/`

#### Move Shift Components
- [ ] Choose one: `NextUpBar.tsx`, `NextUpBarV2.tsx`, `NextUpBand.tsx` (delete others)
- [ ] Winner → `src/features/shifts/components/NextUpBar.tsx`
- [ ] `src/components/NextUpCard.tsx` → `src/features/shifts/components/NextUpCard.tsx`
- [ ] `src/components/ShiftSelector.tsx` → `src/features/shifts/components/ShiftSelector.tsx`
- [ ] `src/components/ShiftBadge.tsx` → `src/features/shifts/components/ShiftBadge.tsx`
- [ ] `src/components/ShiftIndicator.tsx` → `src/features/shifts/components/ShiftIndicator.tsx`
- [ ] `src/components/StationSelector.tsx` → `src/features/shifts/components/StationSelector.tsx`
- [ ] `src/components/CompleteHoldModal.tsx` → `src/features/shifts/components/CompleteHoldModal.tsx`

#### Create Layout Folder
- [ ] `src/components/layout/`
- [ ] `src/components/Header.tsx` → `src/components/layout/Header.tsx`
- [ ] `src/components/Sidebar.tsx` → `src/components/layout/Sidebar.tsx`
- [ ] Choose one: `MobileNav.tsx` or `MobileNav.new.tsx` (delete other)
- [ ] Winner → `src/components/layout/MobileNav.tsx`
- [ ] `src/components/FilterPanel.tsx` → `src/components/layout/FilterPanel.tsx`

#### Keep in components/ui (already good)
- [x] All shadcn components
- [x] Generic primitives

#### Move Shared Components
- [ ] `src/components/ActivityLog*.tsx` → keep in components/ or move to features/reports/
- [ ] `src/components/Reports.tsx` → `src/features/reports/components/Reports.tsx`
- [ ] `src/components/MetricCard.tsx` → `src/components/ui/MetricCard.tsx` (if reusable)

#### Clean Up Component Subfolders
- [ ] `src/components/mobile/*` → Evaluate if still needed after MobileNav consolidation
- [ ] `src/components/tablet/*` → Evaluate necessity
- [ ] `src/components/celebrations/*` → `src/components/ui/celebrations/` (if reusable)
- [ ] `src/components/transitions/*` → `src/components/ui/transitions/` (if reusable)
- [ ] `src/components/Common/*` → Merge into `components/ui/`
- [ ] `src/components/Form/*` → Merge into `components/ui/` or delete if empty
- [ ] `src/components/dev/*` → `src/dev/` (development-only tools)
- [ ] `src/components/examples/*` → Delete or move to `docs/examples/`

---

## Phase 3: Hooks Organization ✅

### Move Feature-Specific Hooks
- [ ] `useFirefighters*.ts` → `src/features/roster/hooks/`
- [ ] `useScheduledHolds*.ts` → `src/features/schedule/hooks/`
- [ ] `useFilters.ts` → `src/features/roster/hooks/` (if roster-specific)

### Keep Generic Hooks (Already Correct)
- [x] `useMediaQuery.ts`
- [x] `useDarkMode.ts`
- [x] `useDevice.ts`
- [x] `useToast.ts`
- [x] `useKeyboardShortcuts.ts`
- [x] `useAnimation.ts`
- [x] `useAnnounce.ts`
- [x] All accessibility hooks

### Delete Backup Files
- [ ] `useFirefighters.ts.backup` → Delete

---

## Phase 4: Lib & Utils Cleanup ✅

### Current State
- `src/lib/` → Database types, Supabase client ✅
- `src/utils/` → Business logic, date handling, rotation ✅

### Actions
- [ ] Verify all utils are React-agnostic (no hooks)
- [ ] Consider renaming `utils` → `lib` and merging
- [ ] OR keep split: `lib/` = external clients, `utils/` = business logic

### Move Feature-Specific Utils
- [ ] `rotationLogic.ts` → `src/features/shifts/lib/rotation.ts`
- [ ] `shiftRotation.ts` → `src/features/shifts/lib/shiftRotation.ts`
- [ ] `holdManagement.*.ts` → `src/features/schedule/lib/holdManagement.ts`
- [ ] `metricsCalculations.ts` → `src/features/reports/lib/metrics.ts` (if reports exist)

### Keep Shared Utils
- [x] `dateUtils.ts`, `calendarUtils.ts`
- [x] `validation.ts`
- [x] `errorReporting.ts`
- [x] `exportUtils.ts`
- [x] `icalendarUtils.ts`

---

## Phase 5: Config & Constants ✅

### Consolidate
- [ ] Merge `src/config/constants.ts` and `src/constants/breakpoints.ts`
- [ ] Target: `src/config/constants.ts` (all app constants)

---

## Phase 6: Types Organization ✅

### Create Global Types
- [ ] `src/types/index.ts` - Export all shared types
- [ ] `src/types/database.ts` - Re-export from `lib/database.types.ts`
- [ ] `src/types/domain.ts` - Firefighter, Shift, Hold, etc. (if not auto-generated)

---

## Phase 7: Tests Alignment ✅

### Move Tests to Match Source
- [ ] `src/components/__tests__/*` → Move next to component files as `ComponentName.test.tsx`
- [ ] `src/hooks/__tests__/*` → Move next to hook files
- [ ] `src/utils/*.test.ts` → Already co-located ✅

---

## Phase 8: Import Path Updates ✅

### Update All Imports to Use @/* Alias
- [ ] Run find-replace for relative imports
- [ ] `import { X } from "../components/Y"` → `import { X } from "@/components/Y"`
- [ ] `import { X } from "../../lib/Y"` → `import { X } from "@/lib/Y"`

### Update After Feature Organization
- [ ] Schedule feature imports
- [ ] Roster feature imports
- [ ] Shifts feature imports

---

## Phase 9: .gitignore Verification ✅

### Ensure These Are Ignored
```
# Dependencies
node_modules/
.pnp/

# Build output
dist/
.next/
out/
build/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
*.log

# Testing
coverage/
.nyc_output/

# Misc
*.tsbuildinfo
.vercel/
.playwright/
```

---

## Phase 10: Documentation Consolidation ✅

### Create docs/ Structure
```
docs/
  architecture/
    TECH_STACK.md
    SHIFT_SYSTEM.md
    DATABASE_VIEWS_GUIDE.md
  guides/
    SETUP.md
    PWA_SETUP_GUIDE.md
    KEYBOARD_SHORTCUTS.md
  reports/
    deployment/
    audits/
  screenshots/
  assets/
```

### Move All .md Files from Root
- [ ] Archive old reports to `docs/reports/archive/`
- [ ] Keep living docs in appropriate folders
- [ ] Update README.md links

---

## Phase 11: Final Validation ✅

### Run Tests
- [ ] `pnpm typecheck` - No errors
- [ ] `pnpm lint` - Clean
- [ ] `pnpm test:run` - All pass
- [ ] `pnpm build` - Successful

### Manual Verification
- [ ] App runs: `pnpm dev`
- [ ] No console errors
- [ ] All features work
- [ ] Hot reload works

---

## Success Criteria

When complete, the repo should:
- ✅ Have a clean, scannable root directory
- ✅ Use feature-first organization in src/
- ✅ Have consistent PascalCase component names
- ✅ Use @/* import aliases throughout
- ✅ Have no duplicate/dead code
- ✅ Pass all linters and tests
- ✅ Have docs in docs/, not scattered in root

**Result:** A senior dev can clone, scan the structure, and immediately understand the architecture without confusion.
