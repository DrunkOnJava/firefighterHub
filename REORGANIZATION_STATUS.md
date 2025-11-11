# Repository Reorganization Summary

**Date:** 2025-11-10  
**Status:** In Progress - Import Path Updates Needed

## ✅ Completed

### 1. Root-Level Cleanup
- ✅ Moved docs to `docs/` folder
- ✅ Moved architecture docs to `docs/architecture/`
- ✅ Moved assets (PDF, images) to `docs/assets/`
- ✅ Removed temporary files (`.chatreplay.json`, etc.)
- ✅ Moved SQL migrations to `database/migrations/manual/`
- ✅ Consolidated config: Merged `src/constants/breakpoints.ts` into `src/config/constants.ts`

### 2. Feature-Based src/ Organization
Created feature-first structure:

```
src/
  features/
    schedule/
      components/       ✅ calendar/, Calendar.tsx, CalendarView.tsx, CalendarSubscribeModal.tsx
      hooks/            ✅ useScheduledHolds*.ts (4 files)
      SchedulePage.tsx  ✅
    roster/
      components/       ✅ FirefighterList.tsx, FirefighterItem.tsx, Add*, Quick*, Transfer*, Reactivate*
      hooks/            ✅ useFirefighters*.ts (4 files), useFilters.ts
    shifts/
      components/       ✅ NextUp*, Shift*, Station*, CompleteHoldModal.tsx
    reports/
      components/       ✅ ActivityLog.tsx, ActivityLogModal.tsx, Reports.tsx
  components/
    layout/             ✅ Header.tsx, Sidebar.tsx, MobileNav.tsx, FilterPanel.tsx
    ui/                 ✅ All shadcn components, celebrations/, transitions/
    mobile/             ✅ BottomNav.tsx, BottomSheet.tsx, etc.
    tablet/             ✅ FirefighterGrid.tsx
  dev/                  ✅ SentryTestButton.tsx
  hooks/                ✅ Generic hooks only
  lib/                  ✅ supabase.ts, database.types.ts, utils.ts
  utils/                ✅ Business logic utils
  config/               ✅ Consolidated constants
```

### 3. Files Removed
- ❌ `NextUpBar.tsx`, `NextUpBarV2.tsx` (kept `NextUpBand.tsx`)
- ❌ `MobileNav.new.tsx` (kept `MobileNav.tsx`)
- ❌ `useFirefighters.ts.backup`
- ❌ `src/components/Common/` (merged into `ui/`)
- ❌ `src/components/examples/` (deleted)
- ❌ `src/constants/` (merged into config)

## 🔄 In Progress

### Import Path Updates
Many files still have broken imports. Need to update all imports in:

- `src/features/*/components/*.tsx` - Need to reference `@/lib`, `@/hooks`, `@/components/ui`
- `src/components/layout/*.tsx` - Need to reference feature components via `@/features/*`
- Test files in `src/components/__tests__/` - Need to update to new component locations

### Key Import Patterns Needed

```typescript
// ❌ OLD (broken after reorganization)
import { useFirefighters } from '../hooks/useFirefighters';
import { Header } from './components/Header';
import { Firefighter } from '../lib/supabase';

// ✅ NEW (using @ aliases)
import { useFirefighters } from '@/features/roster/hooks/useFirefighters';
import { Header } from '@/components/layout/Header';
import { Firefighter } from '@/lib/supabase';
```

## 📋 Remaining Tasks

### High Priority
1. **Fix all import paths** - Run comprehensive find/replace for all moved components
2. **Move test files** - Test files should live next to source files
3. **Update index.ts barrels** - Create feature exports for cleaner imports
4. **Run typecheck** - Verify all imports resolve correctly
5. **Run tests** - Ensure tests still pass after reorganization

### Medium Priority
6. **Create ARCHITECTURE.md** - Document the new structure
7. **Update README.md** - Reference new folder structure
8. **Git commit** - Commit the reorganization as one atomic change

### Nice to Have
9. **Create feature README files** - Document each feature's purpose
10. **Add index.ts exports** - For cleaner feature imports
11. **Consider utils/ → lib/ merge** - Simplify top-level folders

## 🎯 Goals Achieved So Far

- ✅ Clean, scannable root directory (just config + README)
- ✅ Feature-first organization (schedule, roster, shifts, reports)
- ✅ Consistent component grouping (features vs shared UI)
- ✅ No duplicate components
- ✅ Path aliases configured (@/*)

## 🚧 Remaining Import Issues (30 errors)

**Progress:** Reduced from 70+ errors to ~30 errors using Python script.

### Remaining Fixes Needed

1. **Test imports** (6 files in `components/__tests__/`) - Need to point to new feature locations
2. **Hook imports in features** - `useConfirm`, `useToast`, `useActivityLogger` need `@/hooks/` prefix
3. **Shift component references** - `ShiftSelector`, `ShiftBadge`, etc. need `@/features/shifts/components/`
4. **Component cross-references** - FilterPanel, MetricCard, EmptyState paths
5. **DashboardPage & SchedulePage** - Need to import from new feature locations

### Quick Fix Commands

```bash
# Fix test imports
sed -i '' "s|from '../AddFirefighterForm'|from '@/features/roster/components/AddFirefighterForm'|g" src/components/__tests__/AddFirefighterForm.test.tsx
# ... (repeat for other test files)

# Fix hook references in features
find src/features -name "*.ts" -exec sed -i '' \
  -e "s|from './useConfirm'|from '@/hooks/useConfirm'|g" \
  -e "s|from './useToast'|from '@/hooks/useToast'|g" \
  -e "s|from './useActivityLogger'|from '@/hooks/useActivityLogger'|g" \
  {} \;

# Fix Shift component references
find src -name "*.tsx" -exec sed -i '' \
  -e "s|from './ShiftSelector'|from '@/features/shifts/components/ShiftSelector'|g" \
  -e "s|from './ShiftBadge'|from '@/features/shifts/components/ShiftBadge'|g" \
  {} \;
```

## Next Steps

1. ✅ ~Run Python import fixer~ (83 files updated)
2. ⚠️ Manually fix remaining 30 import errors (listed above)
3. Run `pnpm typecheck` to verify
4. Run `pnpm test:run` to verify tests
5. Move SchedulePage to features/schedule/
6. Commit changes as: `refactor: reorganize src/ into feature-based structure`

## Scripts Created

- `scripts/reorganize-src.sh` - File movement (✅ executed successfully)
- `scripts/fix-imports.sh` - Partial import fixes (⚠️ incomplete)
- `scripts/update-imports.js` - Node-based updater (❌ not executed - file system issue)

## Senior Dev Approval Status

**Would this pass review?** 🟡 Almost

- ✅ Structure is excellent
- ✅ No junk in root
- ✅ Clear feature boundaries
- ❌ Build is broken (import errors)
- ❌ Tests not updated

**After fixing imports:** ✅ Ready for review

---

**Estimated time to complete:** 1-2 hours for comprehensive import path updates
