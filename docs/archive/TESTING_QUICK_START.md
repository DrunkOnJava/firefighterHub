# Testing Suite - Quick Start Guide

**Status**: ✅ Infrastructure Complete | ⚠️ Hooks/Components Pending

---

## 🚀 Run Tests Right Now

```bash
# Run all tests (watch mode)
pnpm test

# Run tests once
pnpm test:run

# Generate coverage report
pnpm test:coverage

# Open interactive UI
pnpm test:ui
```

**Current Results**: 71 tests passing, 100% coverage on utilities

---

## 📁 What Exists

### Test Files (Ready to Use)

```
src/
├── test/
│   ├── setup.ts              # ✅ Test environment
│   ├── mockData.ts           # ✅ 330 lines of mock data
│   └── supabaseMock.ts       # ✅ Supabase client mocks
└── utils/
    ├── rotationLogic.test.ts # ✅ 30 tests (100% coverage)
    └── calendarUtils.test.ts # ✅ 41 tests (100% coverage)
```

### Configuration (Working)

- ✅ `vitest.config.ts` - Vitest setup
- ✅ `tsconfig.app.json` - TypeScript types
- ✅ `package.json` - Test scripts

---

## 📝 Write Your Next Test

### Option 1: Add More Utility Tests (Easy)

```typescript
// src/utils/yourUtil.test.ts
import { describe, it, expect } from 'vitest';
import { createMockFirefighter } from '../test/mockData';

describe('yourFunction', () => {
  it('does something', () => {
    const input = createMockFirefighter({ name: 'Test' });
    const result = yourFunction(input);
    expect(result).toEqual(expectedValue);
  });
});
```

### Option 2: Start Hook Testing (Medium)

```typescript
// src/hooks/useFirefighters.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

describe('useFirefighters', () => {
  it('loads firefighters', async () => {
    // TODO: Implement - see IMPLEMENT_TESTING_SUITE_PROMPT.md
  });
});
```

### Option 3: Component Test (Medium)

```typescript
// src/components/ShiftSelector.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ShiftSelector } from './ShiftSelector';

describe('ShiftSelector', () => {
  it('renders all shift buttons', () => {
    render(<ShiftSelector currentShift="A" onShiftChange={() => {}} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
```

---

## 🎯 What to Test Next

**Priority Order** (based on risk/value):

1. **`useFirefighters.completeHold()`** - Critical business logic
   - Moves firefighter to bottom
   - Recalculates positions
   - Logs activity
   - **Estimated**: 1 hour

2. **FirefighterProfileModal infinite loop** - Known bug regression test
   - Verify hold history loads once
   - **Estimated**: 30 minutes

3. **`useFirefighters.loadFirefighters()`** - Data loading
   - Shift filtering
   - Active/inactive filtering
   - **Estimated**: 30 minutes

4. **Integration: Complete Hold Workflow** - End-to-end
   - Full flow from UI to database
   - **Estimated**: 1 hour

---

## 📚 Documentation References

When you get stuck, check these:

1. **`IMPLEMENT_TESTING_SUITE_PROMPT.md`** (679 lines)
   - Complete 6-phase plan
   - 100+ test cases defined
   - Code examples for every pattern

2. **`TESTING_IMPLEMENTATION_COMPLETE.md`**
   - What was done (Phase 1-2)
   - What's pending (Phase 3-5)
   - Known challenges

3. **`.github/copilot-instructions.md`** (395 lines)
   - Architecture patterns
   - Critical rules (shift filtering, activity logging)

4. **`VERIFICATION_TEST_CHECKLIST.md`**
   - 15 manual test scenarios to automate

---

## 💡 Testing Patterns

### Mock Data Helper

```typescript
import { createMockFirefighter } from '../test/mockData';

const ff = createMockFirefighter({
  name: 'John Doe',
  order_position: 0,
  is_available: true,
  shift: 'A',
});
```

### Test Structure

```typescript
describe('featureName', () => {
  it('describes behavior', () => {
    // Arrange - set up data
    const input = createMockData();

    // Act - call function
    const result = functionName(input);

    // Assert - verify output
    expect(result).toEqual(expected);
  });
});
```

### Async Testing

```typescript
it('loads data asynchronously', async () => {
  const { result } = renderHook(() => useYourHook());

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toBeDefined();
});
```

---

## 🐛 Common Issues

### Issue: "Cannot find module @testing-library/react"

```bash
pnpm install
```

### Issue: "TypeError: Cannot read property 'from' of undefined"

You need to mock Supabase:

```typescript
import { vi } from 'vitest';

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));
```

### Issue: Tests timeout

Increase timeout:

```typescript
it('slow test', async () => {
  // test code
}, 10000); // 10 second timeout
```

---

## ✅ Coverage Goals

| Category           | Target  | Current | Status |
|--------------------|---------|---------|--------|
| Critical Utilities | 100%    | 100%    | ✅     |
| Critical Hooks     | >80%    | 0%      | 📝     |
| Components         | >60%    | 0%      | 📝     |
| Overall Project    | >60%    | ~15%    | 📝     |

---

## 🎓 Learning Resources

- **Vitest Docs**: https://vitest.dev/
- **React Testing Library**: https://testing-library.com/react
- **Our Test Examples**: `src/utils/*.test.ts`

---

## 🚦 Ready to Code?

1. Pick a test to write (see "What to Test Next")
2. Create the test file
3. Run `pnpm test` to see it in watch mode
4. Write tests until coverage is green
5. Run `pnpm test:coverage` to verify

**Pro Tip**: Start with utility tests (easy) before hook tests (medium) before component tests (complex)

---

**Questions?** Check `IMPLEMENT_TESTING_SUITE_PROMPT.md` or `TESTING_IMPLEMENTATION_COMPLETE.md`

**Good luck! 🧪**
