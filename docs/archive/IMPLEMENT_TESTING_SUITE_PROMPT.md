# Implement Automated Testing Suite for FirefighterHub

## 🎯 Objective

Implement a comprehensive automated testing suite for FirefighterHub using Vitest, React Testing Library, and appropriate testing patterns. Currently, the project has **0% automated test coverage** but has TypeScript strict mode and ESLint configured.

## 📋 Context

**Project**: FirefighterHub - Shift rotation and availability management system for fire departments
**Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS + Supabase (PostgreSQL)
**Current State**: 
- ✅ TypeScript strict mode enabled (compile-time safety)
- ✅ ESLint configured (code quality)
- ❌ No unit tests
- ❌ No integration tests
- ❌ No E2E tests
- ❌ No test coverage reporting

**Key Architecture Patterns** (CRITICAL - read before implementing):
1. **Shift-based data isolation** - Every query MUST filter by `currentShift` (A/B/C)
2. **Rotation logic** - Position management via `moveToBottom()` and `recalculatePositions()`
3. **Real-time sync DISABLED** - WebSocket subscriptions commented out due to stability issues
4. **Activity logging required** - Every mutation must log to `activity_log` table
5. **Date handling** - Database returns ISO strings (UTC), not Date objects

**Reference Documentation**:
- `.github/copilot-instructions.md` - Complete architecture guide (395 lines)
- `VERIFICATION_TEST_CHECKLIST.md` - 15 manual test scenarios to automate
- `TESTING_QUICK_REFERENCE.md` - Testing workflow and priority areas
- `TODO.md` - Comprehensive task list (lines 1-100 show testing-related tasks)

## 🚀 Task Breakdown

### Phase 1: Testing Infrastructure Setup (2 hours)

#### 1.1 Install Dependencies
```bash
pnpm add -D vitest @vitest/ui @vitest/coverage-v8 \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  jsdom happy-dom
```

#### 1.2 Create Vitest Configuration
Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### 1.3 Create Test Setup File
Create `src/test/setup.ts`:
```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

#### 1.4 Add Test Scripts to package.json
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:run": "vitest run"
  }
}
```

#### 1.5 Update tsconfig.json
Add to `compilerOptions`:
```json
{
  "types": ["vitest/globals", "@testing-library/jest-dom"]
}
```

### Phase 2: Critical Utility Tests (3 hours)

**Priority: HIGHEST** - These utilities are the foundation of the entire app

#### 2.1 Test `src/utils/rotationLogic.ts`
Create `src/utils/rotationLogic.test.ts`:

**Test Coverage Required**:
- `sortFirefighters()`:
  - ✅ Available firefighters sorted by order_position (ascending)
  - ✅ Unavailable firefighters always come after available ones
  - ✅ Empty array handling
  
- `recalculatePositions()`:
  - ✅ Normalizes gaps (converts [0, 5, 10] to [0, 1, 2])
  - ✅ Available firefighters numbered 0, 1, 2...
  - ✅ Unavailable firefighters keep sequential numbering
  - ✅ Handles mixed available/unavailable correctly
  
- `moveToBottom()`:
  - ✅ Moves firefighter to max position + 1
  - ✅ Only moves available firefighters
  - ✅ Returns unchanged array if firefighter not found
  - ✅ Returns unchanged if firefighter is unavailable
  
- `assignPositions()`:
  - ✅ Assigns sequential positions 0, 1, 2, 3...
  - ✅ Preserves order of input array
  
- `formatHoldListMessage()`:
  - ✅ Formats available firefighters correctly
  - ✅ Handles empty list
  - ✅ Includes station numbers
  - ✅ Formats last hold dates correctly

**Mock Data** (create `src/test/mockData.ts`):
```typescript
import { Firefighter, Shift } from '../lib/supabase';

export const mockFirefighters: Firefighter[] = [
  {
    id: '1',
    name: 'John Doe',
    order_position: 0,
    is_available: true,
    is_active: true,
    shift: 'A',
    fire_station: '1',
    last_hold_date: '2025-10-20',
    certification_level: 'FF2',
    apparatus_ambulance: true,
    apparatus_brush_truck: false,
    apparatus_engine: true,
    apparatus_tanker: false,
    apparatus_truck: true,
    apparatus_boat: false,
    apparatus_utv: false,
    apparatus_rescue_squad: false,
    is_fto: true,
    is_bls: true,
    is_als: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  // Add 4-5 more with different positions, availability states
];
```

#### 2.2 Test `src/utils/calendarUtils.ts`
Create `src/utils/calendarUtils.test.ts`:

**Test Coverage Required**:
- `formatDateForDB()`:
  - ✅ Returns YYYY-MM-DD format
  - ✅ Handles timezone correctly (UTC)
  
- `parseDateStringLocal()`:
  - ✅ Parses ISO string to Date object
  - ✅ Handles timezone correctly
  
- `getMonthDays()`:
  - ✅ Returns correct number of days for month
  - ✅ Handles leap years
  - ✅ Includes padding days from previous/next month
  
- `attachScheduledHolds()`:
  - ✅ Attaches holds to correct calendar days
  - ✅ Handles multiple holds on same day
  - ✅ Handles days with no holds
  
- `getNextAvailableFirefighter()`:
  - ✅ Returns firefighter with lowest order_position
  - ✅ Returns null if no available firefighters
  - ✅ Skips unavailable firefighters

### Phase 3: Custom Hooks Tests (4 hours)

**Priority: HIGH** - These hooks contain complex business logic

#### 3.1 Mock Supabase Client
Create `src/test/supabaseMock.ts`:
```typescript
import { vi } from 'vitest';

export const createSupabaseMock = () => {
  const mockFrom = vi.fn();
  const mockSelect = vi.fn();
  const mockEq = vi.fn();
  const mockOrder = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();

  // Chain methods
  mockFrom.mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  });

  mockSelect.mockReturnValue({
    eq: mockEq,
    order: mockOrder,
  });

  mockEq.mockReturnValue({
    eq: mockEq,
    order: mockOrder,
    then: vi.fn().mockResolvedValue({ data: [], error: null }),
  });

  mockOrder.mockReturnValue({
    then: vi.fn().mockResolvedValue({ data: [], error: null }),
  });

  return {
    from: mockFrom,
    // Add channel mocking (currently disabled but structure needed)
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    }),
    removeChannel: vi.fn(),
  };
};
```

#### 3.2 Test `src/hooks/useFirefighters.ts`
Create `src/hooks/useFirefighters.test.ts`:

**Test Coverage Required**:
- `loadFirefighters()`:
  - ✅ Filters by currentShift
  - ✅ Only loads active firefighters (is_active=true)
  - ✅ Orders by order_position
  - ✅ Handles errors gracefully
  - ✅ Shows toast on error
  
- `addFirefighter()`:
  - ✅ Inserts firefighter with correct shift
  - ✅ Logs activity to activity_log table
  - ✅ Assigns position at end of rotation
  - ✅ Shows success toast
  - ✅ Handles duplicate names
  
- `completeHold()`:
  - ✅ Moves firefighter to bottom (calls moveToBottom)
  - ✅ Recalculates all positions
  - ✅ Updates last_hold_date
  - ✅ Logs activity
  - ✅ Shows success toast
  
- `deleteFirefighter()`:
  - ✅ Deletes firefighter from database
  - ✅ Recalculates positions for remaining firefighters
  - ✅ Logs activity
  - ✅ Shows success toast
  
- `transferShift()`:
  - ✅ Updates firefighter shift
  - ✅ Logs activity
  - ✅ Shows success toast
  - ✅ Handles errors

**CRITICAL**: Mock `supabase` import and test that:
1. Every mutation calls `logActivity()`
2. Shift filter is ALWAYS included in queries
3. Toast messages are shown appropriately

#### 3.3 Test `src/hooks/useScheduledHolds.ts`
Create `src/hooks/useScheduledHolds.test.ts`:

**Test Coverage Required**:
- `loadScheduledHolds()`:
  - ✅ Filters by currentShift
  - ✅ Filters by date range (past 1 month to future 3 months)
  - ✅ Orders by hold_date
  - ✅ Handles errors
  
- `scheduleHold()`:
  - ✅ Inserts hold with correct shift
  - ✅ Includes firefighter_name, fire_station from firefighter
  - ✅ Shows success toast
  
- `removeScheduledHold()`:
  - ✅ Deletes hold
  - ✅ Optimistic update (removes from state immediately)
  - ✅ Rolls back on error
  
- `markHoldCompleted()`:
  - ✅ Updates hold status to 'completed'
  - ✅ Sets completed_at timestamp
  - ✅ Calls completeHold() from useFirefighters
  - ✅ Shows success toast

### Phase 4: Component Tests (5 hours)

**Priority: MEDIUM** - Focus on critical user interactions

#### 4.1 Test `src/components/ShiftSelector.tsx`
Create `src/components/ShiftSelector.test.tsx`:

**Test Coverage**:
- ✅ Renders all 3 shift buttons (A, B, C)
- ✅ Highlights current shift
- ✅ Calls onShiftChange when clicked
- ✅ Keyboard navigation works (Tab, Enter)
- ✅ ARIA labels present for accessibility

#### 4.2 Test `src/components/CompleteHoldModal.tsx`
Create `src/components/CompleteHoldModal.test.tsx`:

**Test Coverage**:
- ✅ Shows firefighter name and current hold info
- ✅ Closes on Cancel button
- ✅ Calls onComplete with correct data
- ✅ Closes on Escape key
- ✅ Focus trap works (Tab cycles within modal)
- ✅ Returns focus to trigger element on close

#### 4.3 Test `src/components/FirefighterProfileModal.tsx`
Create `src/components/FirefighterProfileModal.test.tsx`:

**Test Coverage**:
- ✅ Loads hold history on open (no infinite loop!)
- ✅ Displays firefighter information correctly
- ✅ Shows apparatus certifications
- ✅ Edit mode toggles correctly (admin only)
- ✅ Save updates firefighter in database
- ✅ Hold history dates display correctly (UTC)
- ✅ Shows loading state while fetching holds
- ✅ Handles empty hold history

**CRITICAL TEST** (from VERIFICATION_TEST_CHECKLIST.md):
```typescript
it('loads hold history once without infinite loop', async () => {
  const mockLoadHolds = vi.fn().mockResolvedValue({ data: [], error: null });
  // Mock Supabase query
  
  render(<FirefighterProfileModal isOpen={true} firefighter={mockFirefighter} />);
  
  await waitFor(() => {
    expect(mockLoadHolds).toHaveBeenCalledTimes(1); // Only once!
  });
  
  // Wait 2 more seconds to ensure no re-fetching
  await new Promise(resolve => setTimeout(resolve, 2000));
  expect(mockLoadHolds).toHaveBeenCalledTimes(1); // Still only once
});
```

#### 4.4 Test `src/components/Calendar.tsx`
Create `src/components/Calendar.test.tsx`:

**Test Coverage**:
- ✅ Renders current month/year
- ✅ Navigates to previous/next month
- ✅ Shows holds on correct dates
- ✅ Clicking date opens modal
- ✅ Can click past dates (not disabled)
- ✅ Multiple holds on same date show count badge
- ✅ Completed holds show "DONE" badge

### Phase 5: Integration Tests (3 hours)

**Priority: MEDIUM** - Test complete workflows

#### 5.1 Test Complete Hold Workflow
Create `src/test/integration/completeHoldWorkflow.test.tsx`:

**Test Scenario**:
1. Render FirefighterList with 5 firefighters
2. Complete hold for firefighter at position 0
3. Verify firefighter moved to position 4
4. Verify positions recalculated (0,1,2,3,4)
5. Verify last_hold_date updated
6. Verify activity logged
7. Verify success toast shown

#### 5.2 Test Shift Switching Workflow
Create `src/test/integration/shiftSwitching.test.tsx`:

**Test Scenario**:
1. Load firefighters for Shift A
2. Switch to Shift B
3. Verify Shift A data cleared
4. Verify Shift B data loaded
5. Verify no data mixing between shifts
6. Verify scheduled holds filtered by shift

### Phase 6: E2E Tests (Future - Out of Scope)

**Note**: E2E tests with Playwright/Cypress are NOT included in this task. Focus on unit and integration tests first.

## 🎯 Success Criteria

### Must Have (Minimum Viable Testing Suite)
- ✅ All utility functions in `rotationLogic.ts` tested (100% coverage)
- ✅ All utility functions in `calendarUtils.ts` tested (100% coverage)
- ✅ Critical hooks (`useFirefighters`, `useScheduledHolds`) tested (>80% coverage)
- ✅ Shift-based data isolation verified in tests
- ✅ Activity logging verified in all mutation tests
- ✅ Profile modal infinite loop regression test
- ✅ Timezone handling verified in date tests
- ✅ Test suite runs successfully: `pnpm test:run`
- ✅ Coverage report generates: `pnpm test:coverage`

### Should Have (Enhanced Coverage)
- ✅ Critical modal components tested
- ✅ Calendar component tested
- ✅ At least 2 integration tests (complete workflows)
- ✅ >60% overall code coverage
- ✅ All tests pass in CI/CD pipeline

### Nice to Have (Future Enhancements)
- ⬜ All components tested (>80% coverage)
- ⬜ E2E tests with Playwright
- ⬜ Visual regression tests
- ⬜ Performance tests
- ⬜ Accessibility tests with axe-core

## 🚨 Critical Testing Patterns

### Pattern 1: Always Mock Supabase
```typescript
import { vi } from 'vitest';
import * as supabaseModule from '../lib/supabase';

vi.mock('../lib/supabase', () => ({
  supabase: createSupabaseMock(),
  // Export types unmocked
}));
```

### Pattern 2: Verify Shift Filtering
```typescript
it('filters firefighters by current shift', async () => {
  const { result } = renderHook(() => useFirefighters(mockToast, 'B'));
  
  await waitFor(() => {
    expect(mockSupabase.from).toHaveBeenCalledWith('firefighters');
    expect(mockSupabase.select().eq).toHaveBeenCalledWith('shift', 'B');
  });
});
```

### Pattern 3: Verify Activity Logging
```typescript
it('logs activity when completing hold', async () => {
  // Setup
  const { result } = renderHook(() => useFirefighters(mockToast, 'A'));
  
  // Act
  await act(() => result.current.completeHold('firefighter-id', new Date()));
  
  // Assert
  expect(mockSupabase.from).toHaveBeenCalledWith('activity_log');
  expect(mockSupabase.insert).toHaveBeenCalledWith(
    expect.objectContaining({
      action_type: 'hold_completed',
      shift: 'A',
      firefighter_name: expect.any(String),
    })
  );
});
```

### Pattern 4: Test Rotation Logic Side Effects
```typescript
it('recalculates positions after deletion', async () => {
  const { result } = renderHook(() => useFirefighters(mockToast, 'A'));
  
  // Mock 3 firefighters at positions 0, 1, 2
  // Delete position 1
  await act(() => result.current.deleteFirefighter('middle-id'));
  
  // Verify positions are now 0, 1 (gap removed)
  expect(result.current.firefighters).toHaveLength(2);
  expect(result.current.firefighters[0].order_position).toBe(0);
  expect(result.current.firefighters[1].order_position).toBe(1);
});
```

### Pattern 5: Test Date Handling (Timezone)
```typescript
it('formats dates in UTC to prevent timezone bugs', () => {
  const date = new Date('2025-10-27T00:00:00Z');
  const formatted = formatDateForDB(date);
  
  expect(formatted).toBe('2025-10-27');
  
  // Verify it works across timezones
  const parsed = parseDateStringLocal(formatted);
  expect(parsed.toISOString().split('T')[0]).toBe('2025-10-27');
});
```

## 📦 Deliverables

### Required Files to Create
1. `vitest.config.ts` - Vitest configuration
2. `src/test/setup.ts` - Test environment setup
3. `src/test/mockData.ts` - Mock firefighter data
4. `src/test/supabaseMock.ts` - Supabase client mock
5. `src/utils/rotationLogic.test.ts` - Rotation logic tests
6. `src/utils/calendarUtils.test.ts` - Calendar utils tests
7. `src/hooks/useFirefighters.test.ts` - Firefighters hook tests
8. `src/hooks/useScheduledHolds.test.ts` - Scheduled holds hook tests
9. `src/components/ShiftSelector.test.tsx` - Shift selector tests
10. `src/components/CompleteHoldModal.test.tsx` - Modal tests
11. `src/components/FirefighterProfileModal.test.tsx` - Profile modal tests
12. `src/components/Calendar.test.tsx` - Calendar tests
13. `src/test/integration/completeHoldWorkflow.test.tsx` - Integration test
14. `src/test/integration/shiftSwitching.test.tsx` - Integration test

### Required Updates to Existing Files
1. `package.json` - Add test scripts
2. `tsconfig.json` - Add Vitest types
3. `.gitignore` - Add coverage/ directory

### Documentation to Update
1. `README.md` - Add "Testing" section with commands
2. `TODO.md` - Mark testing tasks as complete

## 🐛 Known Issues to Test Against

Based on `VERIFICATION_TEST_CHECKLIST.md`, ensure these bugs are covered:

1. **Profile Modal Infinite Loop** (FIXED - verify stays fixed)
   - Hold history should load exactly once
   - No continuous re-fetching

2. **Timezone Bug** (FIXED - verify stays fixed)
   - Dates should match across roster/calendar/modals
   - No off-by-one day errors

3. **Real-Time Sync** (DISABLED - skip testing)
   - WebSocket subscriptions are commented out
   - Don't test real-time functionality

4. **Activity Logging** (CRITICAL - must test)
   - Every mutation MUST log to activity_log
   - Missing logs = data audit trail failure

## 📚 Reference Implementation Examples

### Example Test Structure
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFirefighters } from '../useFirefighters';

describe('useFirefighters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadFirefighters', () => {
    it('filters by current shift', async () => {
      // Arrange
      const mockToast = vi.fn();
      
      // Act
      const { result } = renderHook(() => useFirefighters(mockToast, 'B'));
      
      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      // Verify Supabase query called with shift filter
    });
  });

  describe('completeHold', () => {
    it('moves firefighter to bottom and logs activity', async () => {
      // Test implementation
    });
  });
});
```

## ⚠️ Important Considerations

1. **Don't test disabled features**: Real-time sync is disabled, skip those tests
2. **Mock Supabase extensively**: Never hit real database in tests
3. **Test shift isolation religiously**: Most critical bug source
4. **Verify activity logging**: Required for audit compliance
5. **Test date timezone handling**: Major source of bugs
6. **Keep tests fast**: Target <100ms per test, <5s total suite
7. **Write maintainable tests**: Clear arrange/act/assert structure
8. **Focus on behavior, not implementation**: Test what, not how

## 🔧 Troubleshooting

### Common Issues

**Issue**: `Cannot find module '@testing-library/react'`
**Fix**: Run `pnpm install` to install all dev dependencies

**Issue**: Tests timeout
**Fix**: Increase timeout in test file: `it('test name', async () => {...}, 10000)`

**Issue**: Supabase mock not working
**Fix**: Ensure `vi.mock()` is called before imports, at top of file

**Issue**: Coverage report not generating
**Fix**: Run `pnpm test:coverage` not `pnpm test`

**Issue**: TypeScript errors in tests
**Fix**: Add `/// <reference types="vitest/globals" />` at top of test file

## ✅ Acceptance Checklist

Before considering this task complete:

- [ ] All dependencies installed successfully
- [ ] `pnpm test` runs without errors
- [ ] `pnpm test:coverage` generates coverage report
- [ ] Coverage for `rotationLogic.ts` is 100%
- [ ] Coverage for `calendarUtils.ts` is 100%
- [ ] Coverage for `useFirefighters.ts` is >80%
- [ ] Coverage for `useScheduledHolds.ts` is >80%
- [ ] Overall project coverage is >60%
- [ ] Profile modal infinite loop test passes
- [ ] Shift isolation test passes
- [ ] Activity logging test passes
- [ ] Timezone handling test passes
- [ ] All 15 scenarios from `VERIFICATION_TEST_CHECKLIST.md` have corresponding automated tests
- [ ] README.md updated with testing section
- [ ] CI/CD pipeline runs tests (if applicable)

## 📞 Questions?

Refer to:
- `.github/copilot-instructions.md` - Complete architecture guide
- `VERIFICATION_TEST_CHECKLIST.md` - Manual test scenarios
- `TESTING_QUICK_REFERENCE.md` - Testing workflow guide
- Vitest docs: https://vitest.dev/
- React Testing Library docs: https://testing-library.com/react

---

**Estimated Time**: 15-17 hours total
**Priority**: HIGH - Testing is critical for production readiness
**Difficulty**: MEDIUM - Requires understanding of React hooks, Supabase, and testing patterns

**Good luck! 🚀**
