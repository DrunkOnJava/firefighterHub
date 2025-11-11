# Implementation Tasks - User Feedback Fixes

## Status Summary

### Already Implemented ✅:
1. **Calendar Skip Functionality** - HoldForm has "Skip to Next Person" button
2. **Calendar Station Selection** - StationSelector component in HoldForm
3. **Select Any Firefighter** - Can choose anyone from the list, not just top
4. **Database Column** - `is_voluntary` exists in scheduled_holds table

### Issues Found 🔍:
1. **BC Mode Drag-Drop** - Code shows `draggable={isAdminMode}` which SHOULD work
   - Need to test if it's actually broken or user misunderstanding
2. **Voluntary Holds** - Database ready, but NO UI to mark holds as voluntary

---

## Tasks to Complete

### ✅ TASK 1: Verify BC Mode Drag-Drop Works
**Status**: Testing Required  
**Action**: Manual test in browser

### 🔨 TASK 2: Add Voluntary Hold Checkbox to HoldForm
**Status**: In Progress  
**Files**: 
- `src/components/calendar/HoldForm.tsx` - Add checkbox
- `src/hooks/useScheduledHolds.ts` - Update scheduleHold to accept is_voluntary

**Changes needed**:
```typescript
// HoldForm.tsx - add state
const [isVoluntary, setIsVoluntary] = useState(false);

// HoldForm.tsx - add checkbox before "Add another"
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    checked={isVoluntary}
    onChange={(e) => setIsVoluntary(e.target.checked)}
    className="w-4 h-4 rounded border-gray-600"
  />
  <span>🙋 Mark as Voluntary Hold</span>
</label>

// HoldForm.tsx - pass to onSchedule
onSchedule(holdDate, selectedFirefighter, selectedStation, duration, startTime, isVoluntary);

// Update function signatures throughout
```

### 🔨 TASK 3: Update Hold Scheduling Logic
**Status**: Pending  
**Files**:
- `src/hooks/useScheduledHolds.ts` - scheduleHold function
- `src/components/CalendarView.tsx` - onScheduleHold signature
- `src/components/calendar/DayModal.tsx` - handleSchedule signature
- `src/App.tsx` - scheduleHold prop

### 🔨 TASK 4: Visual Indicators for Voluntary Holds
**Status**: Pending  
**Files**:
- `src/components/calendar/HoldList.tsx` - Add volunteer badge
- `src/components/calendar/DayCell.tsx` - Show volunteer icon
- `src/components/FirefighterProfileModal.tsx` - Mark voluntary holds

**Visual Design**:
- Badge: `🙋 VOLUNTARY` in green
- Icon in calendar: Green border or badge
- Activity log: "Volunteered for hold" vs "Scheduled for hold"

### 🔨 TASK 5: Activity Log Integration
**Status**: Pending  
**Files**:
- `src/hooks/useScheduledHolds.ts` - logActivity calls

**Changes**:
```typescript
await logActivity(
  firefighter.name,
  isVoluntary ? 'hold_volunteered' : 'hold_scheduled',
  `${isVoluntary ? 'Volunteered for' : 'Scheduled for'} hold at station ${station}`,
  firefighter.id
);
```

### 🔨 TASK 6: Rotation Logic for Voluntary Holds
**Status**: Pending  
**Question**: Should voluntary holds automatically move to bottom WHEN SCHEDULED or WHEN COMPLETED?

**Current behavior**: 
- Completing a hold moves member to bottom
- Scheduling doesn't change rotation

**Proposed behavior** (needs clarification):
- Voluntary hold SCHEDULED → Member stays in current position
- Voluntary hold COMPLETED → Member moves to bottom (same as regular)
- OR: Voluntary hold SCHEDULED → Member immediately moves to bottom

### 🔨 TASK 7: Testing & Validation
**Status**: Pending  
**Tests needed**:
- [ ] BC mode allows drag-drop
- [ ] Can mark hold as voluntary
- [ ] Voluntary flag saves to database
- [ ] Visual indicators show correctly
- [ ] Activity log differentiates
- [ ] Rotation logic works as expected

---

## Decision Points

### Decision 1: When does voluntary hold affect rotation?
**Options**:
A. On scheduling (immediate)
B. On completion (same as regular holds)
C. Not at all (voluntary is just a label)

**Recommendation**: Option A - Move to bottom immediately when volunteering
**Rationale**: Volunteering = taking one for the team, should be rewarded immediately

### Decision 2: Can you mark past holds as voluntary?
**Options**:
A. Yes (allow editing)
B. No (only on creation)

**Recommendation**: Option B - Only on creation
**Rationale**: Simpler implementation, prevents retroactive gaming of system

---

## Implementation Order

1. ✅ Test BC mode drag-drop (verify issue exists)
2. 🔨 Add voluntary checkbox to HoldForm
3. 🔨 Update all signatures to accept is_voluntary parameter
4. 🔨 Update scheduleHold to save is_voluntary to database
5. 🔨 Add visual indicators (badges, icons)
6. 🔨 Update activity logging
7. 🔨 Implement rotation logic (based on decision)
8. ✅ Test all features end-to-end
9. ✅ Take screenshots for validation
10. ✅ Commit and push

---

## Time Estimates

- Task 1: 10 minutes (testing)
- Task 2: 30 minutes (UI changes)
- Task 3: 45 minutes (signature updates)
- Task 4: 60 minutes (visual indicators)
- Task 5: 20 minutes (activity log)
- Task 6: 45 minutes (rotation logic)
- Task 7: 30 minutes (testing)

**Total**: ~4 hours

---

## Rollback Plan

Each task is a separate commit. If issues arise:
1. Git revert specific commits
2. Database column already exists (no migration needed)
3. UI changes are additive (won't break existing functionality)
