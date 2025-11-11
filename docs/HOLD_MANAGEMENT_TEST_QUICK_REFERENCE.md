# Hold Management Tests - Quick Reference

## 🎯 Quick Start

```bash
# Run just the hold management tests
pnpm test:run src/utils/holdManagement.test.ts

# Run all tests
pnpm test:run

# Watch mode (re-run on changes)
pnpm test src/utils/holdManagement.test.ts
```

## 📊 Test Statistics

- **Total Tests:** 37
- **Status:** ✅ All Passing
- **Execution Time:** ~29ms
- **Categories:** 9

## 🗂️ Test Categories

### 1. Rotation Logic (5 tests)
Tests how firefighters move through the rotation:
- Next firefighter selection
- Unavailable filtering
- Move to bottom after hold
- Position sorting
- Gap normalization

### 2. Calendar Entries (5 tests)
Tests hold scheduling on calendar:
- Auto-schedule N days
- Rotation cycling
- Date attachment
- Multiple holds per day
- Past hold integration

### 3. Hold History (4 tests)
Tests historical data tracking:
- Completion tracking
- List formatting
- Availability filtering
- Empty list handling

### 4. Admin Operations (5 tests)
Tests administrative functions:
- Status tracking (completed, scheduled, skipped)
- Station assignment
- Shift lending

### 5. Date Handling (4 tests)
Tests timezone-safe date operations:
- YYYY-MM-DD formatting
- Parse consistency
- Zero-padding
- Round-trip conversion

### 6. Shift Isolation (3 tests)
Tests shift-based data separation:
- Firefighter shift assignment
- Hold shift tracking
- Cross-shift filtering

### 7. Edge Cases (5 tests)
Tests boundary conditions:
- Single firefighter
- Empty rotation
- All unavailable
- No available for auto-schedule
- Reactivation

### 8. Status Workflow (3 tests)
Tests hold status transitions:
- New hold (scheduled)
- Completion transition
- Skip transition

### 9. Integration (3 tests)
Tests complete workflows:
- Full hold lifecycle
- Auto-schedule rotation integrity
- Cancellation recovery

## 🔍 Finding Specific Tests

### By Requirement ID
All tests follow `R[Category].[Number]` naming:
- `R1.1` - Next available firefighter
- `R2.3` - Holds attach to correct days
- `R9.1` - Complete hold lifecycle

### By Functionality
Search test file for keywords:
- "rotation" - Rotation logic tests
- "schedule" - Scheduling tests
- "status" - Status tracking tests
- "date" - Date handling tests
- "workflow" - Integration tests

## 🐛 Common Test Scenarios

### Testing Hold Assignment
```typescript
// R1.1: Get next firefighter
const next = getNextAvailableFirefighter(firefighters);
expect(next?.order_position).toBe(0);
```

### Testing Rotation Update
```typescript
// R1.3: Move to bottom after hold
const reordered = moveToBottom(firefighters, firefighterId);
const normalized = recalculatePositions(reordered);
```

### Testing Auto-Schedule
```typescript
// R2.1: Schedule N days
const schedule = autoScheduleNextHolds(firefighters, startDate, 5);
expect(schedule).toHaveLength(5);
```

### Testing Hold Status
```typescript
// R4.1: Completed hold
const hold = { status: 'completed', completed_at: timestamp };
expect(hold.completed_at).not.toBeNull();
```

## 📚 Related Files

- **Tests:** `src/utils/holdManagement.test.ts`
- **Documentation:** `HOLD_MANAGEMENT_TEST_DOCUMENTATION.md`
- **Utils:** `src/utils/calendarUtils.ts`, `src/utils/rotationLogic.ts`
- **Mock Data:** `src/test/mockData.ts`

## ✅ Validation Checklist

Before committing changes to hold management:

- [ ] Run hold management tests: `pnpm test:run src/utils/holdManagement.test.ts`
- [ ] All 37 tests pass
- [ ] No new failing tests introduced
- [ ] Test execution time under 100ms
- [ ] Update documentation if behavior changes

## 🔧 Troubleshooting

### Tests failing after code changes?
1. Check what changed in rotation logic
2. Review date formatting changes
3. Verify hold status transitions
4. Run single test: `pnpm test:run -t "R1.1"`

### Need to add new tests?
1. Follow naming convention: `R[Category].[Number]: [Description]`
2. Use mock data from `src/test/mockData.ts`
3. Keep tests isolated (no external dependencies)
4. Update HOLD_MANAGEMENT_TEST_DOCUMENTATION.md

### Test execution slow?
- Should complete in ~30ms
- If slower, check for:
  - Unintentional async operations
  - Large data sets in loops
  - External API calls (should be mocked)

## 📖 Full Documentation

For complete requirements mapping, acceptance criteria, and detailed test descriptions, see:
**[HOLD_MANAGEMENT_TEST_DOCUMENTATION.md](./HOLD_MANAGEMENT_TEST_DOCUMENTATION.md)**

---

**Last Updated:** October 28, 2025  
**Test Suite Version:** 1.0  
**Status:** ✅ All Tests Passing
