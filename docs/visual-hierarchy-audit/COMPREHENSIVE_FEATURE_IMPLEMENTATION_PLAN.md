# Comprehensive Feature Implementation Plan

## User Feedback Analysis

### Issues Identified:
1. **BC Mode - Manual Roster Reordering Disabled**: Users cannot manually drag/drop members in BC mode
2. **Calendar Day Selection - Missing Skip Option**: No option to skip the top person when scheduling a hold
3. **Calendar Day Selection - Missing Station Selection**: Cannot select which station for the hold
4. **New Policy - Voluntary Holds**: Members can volunteer for holds and move to bottom of rotation

### Database Schema Updates Required:
- ✅ `scheduled_holds.is_voluntary` column added (BOOLEAN DEFAULT FALSE)

---

## Implementation Plan - 4 Major Features

### **PHASE 1: Enable Manual Reordering in BC Mode** (Priority: HIGH)
**Status**: Not Started  
**Estimated Time**: 2-3 hours  
**Complexity**: Medium

#### Tasks:
1. **Review Current Implementation**
   - Check `FirefighterList.tsx` drag-drop logic (lines ~68-95)
   - Identify where `isAdminMode` blocks reordering
   - Review `onReorder` callback flow

2. **Enable Drag-Drop in BC Mode**
   - Remove or modify `isAdminMode` checks that disable dragging
   - Ensure drag handlers work with BC mode permissions
   - Test with both modes (BC and public)

3. **Testing**
   - Manual test: Login to BC mode → drag members in roster
   - Verify order persists after drag-drop
   - Verify real-time sync updates positions correctly

**Files to Modify**:
- `src/components/FirefighterList.tsx`
- `src/components/FirefighterItem.tsx` (if drag handlers are there)

---

### **PHASE 2: Calendar Day Modal - Add Skip & Station Selection** (Priority: HIGH)
**Status**: Not Started  
**Estimated Time**: 3-4 hours  
**Complexity**: High

#### Tasks:
1. **Review Current DayModal Implementation**
   - Examine `src/components/calendar/DayModal.tsx`
   - Check how firefighter selection works
   - Review hold scheduling flow

2. **Add Station Selection UI**
   - Add dropdown/select for fire station (default to firefighter's station)
   - Support custom station override
   - Validate station input (allow numbers and null)

3. **Add "Skip Top Person" Feature**
   - Add UI option to skip the person at position 0
   - Show next available firefighter as default when skipped
   - Log skip action in activity log

4. **Update Hold Scheduling Logic**
   - Modify `onScheduleHold` to accept selected firefighter (not just top)
   - Pass selected station to database
   - Handle skip logic in rotation calculations

5. **Testing**
   - Test selecting non-top firefighter
   - Test custom station selection
   - Verify skip doesn't break rotation order
   - Check activity log entries

**Files to Modify**:
- `src/components/calendar/DayModal.tsx`
- `src/components/CalendarView.tsx` (onScheduleHold signature)
- `src/hooks/useScheduledHolds.ts` (scheduling logic)
- `src/utils/rotationLogic.ts` (if skip affects rotation)

**UI Components Needed**:
- Station input/select component
- Firefighter selector (radio/dropdown)
- "Skip top person" toggle/button

---

### **PHASE 3: Voluntary Holds Feature** (Priority: MEDIUM)
**Status**: Not Started  
**Estimated Time**: 4-5 hours  
**Complexity**: High

#### Tasks:
1. **Database Schema Validation**
   - ✅ Confirm `is_voluntary` column exists
   - Verify default value (FALSE)
   - Check indexes/constraints

2. **Add Voluntary Hold UI in DayModal**
   - Add checkbox: "Mark as Voluntary Hold"
   - Show in hold scheduling form
   - Default to unchecked (false)

3. **Update Rotation Logic for Voluntary Holds**
   - When `is_voluntary=true`, move firefighter to bottom
   - When `is_voluntary=false`, use normal rotation
   - Ensure position recalculation respects voluntary flag

4. **Update TypeScript Types**
   - Add `is_voluntary` to `ScheduledHold` interface
   - Update Supabase type generation

5. **Activity Log Integration**
   - Log voluntary holds differently
   - Show "Volunteered for hold" vs "Scheduled for hold"

6. **Visual Indicators**
   - Show badge/icon for voluntary holds in calendar
   - Display in hold lists and firefighter profiles

7. **Testing**
   - Test voluntary hold creation
   - Verify rotation moves volunteer to bottom
   - Test non-voluntary holds still work normally
   - Check activity log entries

**Files to Modify**:
- `src/lib/supabase.ts` (types)
- `src/components/calendar/DayModal.tsx` (UI)
- `src/hooks/useScheduledHolds.ts` (scheduling logic)
- `src/utils/rotationLogic.ts` (rotation calculations)
- `src/components/calendar/HoldList.tsx` (visual indicators)
- `src/components/FirefighterProfileModal.tsx` (show voluntary holds)

---

### **PHASE 4: Micro-Interactions Integration** (Priority: LOW)
**Status**: Partially Complete (Phase 1 done)  
**Estimated Time**: 12-16 hours  
**Complexity**: Medium

#### Remaining Work:
- Phase 2: Toggle, Input, Spinner components (4-6 hrs)
- Phase 3: Page transitions & stagger animations (3-4 hrs)
- Phase 4: Celebrations & confetti (3-4 hrs)
- Phase 5: Hover/focus polish (2-3 hrs)

**Decision**: DEFER until core features complete

---

## Execution Order

### Sprint 1 (Today): Core Feature Fixes
1. **PHASE 1**: Enable BC Mode Reordering (2-3 hrs)
2. **PHASE 2**: Calendar Skip & Station Selection (3-4 hrs)
3. **Test & Validate**: Screenshots, E2E tests (1 hr)

### Sprint 2 (Next Session): Voluntary Holds
4. **PHASE 3**: Voluntary Holds Feature (4-5 hrs)
5. **Integration Testing**: All features together (1-2 hrs)
6. **Documentation Updates** (30 min)

### Sprint 3 (Future): Polish
7. **PHASE 4**: Micro-Interactions (deferred)

---

## Testing Strategy

### For Each Phase:
1. **Unit Tests** (where applicable)
2. **Manual Testing via Browser**
   - Use Chrome DevTools MCP for screenshots
   - Test in both BC mode and public mode
3. **E2E Tests** (critical paths only)
4. **Real-time Sync Validation**

### Test Scenarios:
- ✅ BC mode manual reordering persists
- ✅ Calendar skip works without breaking rotation
- ✅ Station selection saves correctly
- ✅ Voluntary holds move member to bottom
- ✅ Activity log captures all actions
- ✅ Real-time updates propagate

---

## Success Criteria

### Phase 1 Success:
- [x] Can drag-drop roster in BC mode
- [x] Order persists in database
- [x] Real-time sync works

### Phase 2 Success:
- [x] Can skip top person in calendar
- [x] Can select custom station
- [x] Selected firefighter gets scheduled
- [x] Activity log shows actions

### Phase 3 Success:
- [x] Voluntary checkbox appears in modal
- [x] Voluntary holds move member to bottom
- [x] Visual indicators show voluntary status
- [x] Activity log differentiates voluntary holds

---

## Rollback Plan

If issues arise:
1. Each phase is independent (can rollback individually)
2. Database migrations are additive (column already added)
3. Git commits after each phase for easy revert

---

## Documentation Updates Needed

After completion:
- Update `BC_MODE_USER_GUIDE.md` with reordering instructions
- Update `CALENDAR_SUBSCRIPTION_GUIDE.md` with skip/station features
- Create `VOLUNTARY_HOLDS_GUIDE.md` for new policy
- Update `TODO.md` with completed tasks

---

## Notes

- Micro-interactions work is deferred (25% complete)
- Focus on user-requested features first
- All changes must respect shift-based data isolation
- Must log all actions to activity_log table
- No Docker needed (Supabase CLI uses local functions)
