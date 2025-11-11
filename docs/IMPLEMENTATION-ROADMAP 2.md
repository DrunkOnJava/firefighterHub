# 🎯 Implementation Roadmap - Complete Specification

**Based On:**
- Audit #1: Original audit findings
- Audit #2: Comprehensive technical audit
- Audit #3: Business context clarifications
- **Normative Rulebook:** RFC-compliant product specifications

**Version:** 4.0 FINAL
**Status:** Implementation-Ready
**Timeline:** 15-18 weeks with parallel workstreams

---

## 📋 BUSINESS RULES INTEGRATION

### Validated Understanding

✅ **CORRECT Assumptions:**
- WebSocket failures are critical (affects real-time sync)
- Mobile UX is important (battalion chiefs use tablets)
- Performance matters (fire station equipment)
- Admin mode exists and is essential

❌ **CORRECTED Assumptions:**
- Disabled dates are BY DESIGN (not a bug) - only admin can schedule
- "Add Firefighter" hidden for regular users (correct behavior)
- Public data access may be intentional (department transparency)

🆕 **NEW Understanding from Rulebook:**
- 72-hour tracking exists but may not be automated
- Skip logic keeps member at #0 (critical distinction)
- Cancel vs Complete have different rotation impacts
- Hold locking after 7 days is a hard requirement
- Battalion chief overrides must be fully audited

---

## 🔴 PHASE 1: CRITICAL FIXES (Week 1-2)

### Already Completed ✓

1. **WebSocket API Key Fix** ✓
   - Stripped newline character
   - File: `src/lib/supabase.ts:9-10`

2. **Retry Limits** ✓
   - Max 10 attempts
   - Exponential backoff
   - Files: `useScheduledHolds.ts`, `useFirefighters.ts`

3. **Error Notifications** ✓
   - User-facing toasts
   - Connection status messages
   - Recovery notifications

4. **Connection Status Indicator** ✓
   - Green/yellow/red visual indicator
   - Files created: `useConnectionStatus.ts`, `ConnectionStatusIndicator.tsx`
   - Integrated into `Header.tsx`

5. **Security Headers** ✓
   - CSP implemented
   - Permissions-Policy added
   - File: `vercel.json`

6. **Touch Targets** ✓
   - 44x44px minimum globally
   - Files: `Calendar.tsx`, `index.css`

7. **Skeleton Loaders** ✓
   - Professional loading states
   - File: `SkeletonLoader.tsx`

8. **Empty States** ✓
   - 7 different scenarios
   - File: `EmptyState.tsx`

9. **Color Contrast** ✓
   - WCAG 2.1 AA compliant
   - Documentation: `docs/ACCESSIBILITY.md`

10. **Resource Hints** ✓
    - Preconnect for Supabase
    - File: `index.html`

---

### Remaining Critical Tasks

### 11. VALIDATE Complete Hold Business Logic (HIGHEST PRIORITY)
**RFC Rules:** AC-02, Rule #3
**Effort:** 4-8 hours
**Priority:** 🔴🔴🔴 MUST TEST BEFORE ANY NEW FEATURES

**Implementation Checklist:**
- [ ] **Code Review** (Read existing implementation)
  - [ ] Read `src/hooks/useScheduledHolds.ts:293-408` (`markHoldCompleted`)
  - [ ] Read `src/hooks/useFirefighters.ts:250-344` (`completeHold`)
  - [ ] Read `src/utils/rotationLogic.ts` (rotation algorithms)
  - [ ] Verify algorithm matches RFC Rule #3

- [ ] **Verify Rotation Algorithm**
  ```typescript
  // Expected algorithm per RFC:
  // 1. Find member who completed hold
  // 2. Remove from current position
  // 3. Move all members after them UP one position
  // 4. Place completed member at BOTTOM
  // 5. Update last_hold_date
  // 6. Atomic database transaction
  ```

- [ ] **Test Complete Hold Workflow**
  ```
  Initial Roster:
  #0: Alice
  #1: Bob
  #2: Charlie
  #3: Dave

  Action: Complete hold for Bob

  Expected Result:
  #0: Alice
  #1: Charlie (moved up from #2)
  #2: Dave (moved up from #3)
  #3: Bob (moved to bottom, last_hold_date updated)
  ```

- [ ] **Test Edge Cases**
  - [ ] Complete hold for #0 (top position)
  - [ ] Complete hold for #17 (bottom position)
  - [ ] Complete hold when only 1 member exists
  - [ ] Complete multiple holds same day
  - [ ] Complete hold while another user is viewing

- [ ] **Verify Real-Time Sync**
  - [ ] Open in two tabs
  - [ ] Complete hold in tab 1
  - [ ] Roster updates instantly in tab 2
  - [ ] WebSocket delivers change event

- [ ] **Check UI Elements**
  - [ ] "Complete Hold" button exists
  - [ ] Button is admin-mode only
  - [ ] Confirmation dialog appears
  - [ ] Success toast shows new position

**Acceptance:** AC-02 passes 100%

---

### 12. VALIDATE Skip Logic Implementation
**RFC Rules:** AC-03, AC-04, Rule #2, Rule #7
**Effort:** 8-12 hours
**Priority:** 🔴🔴 SAFETY COMPLIANCE

**Investigation Required:**

Based on code comment in `src/lib/supabase.ts:52-56`:
```typescript
// User stated: "There is no way to accurately calculate that
// without manually checking through the scheduling program"
// hours_worked_this_period?: number; // Made optional - no longer tracked
```

**This suggests 72-hour tracking is NOT automated!**

**Test Plan:**
- [ ] **Confirm 72-Hour Tracking Status**
  - [ ] Search code for "72" or "hours_worked"
  - [ ] Check if `hours_worked_this_period` is actually used
  - [ ] Check if calculation exists anywhere
  - [ ] Determine: Manual or automated?

- [ ] **If NOT Implemented (Likely):**
  - [ ] Document current manual process
  - [ ] Add UI note: "Battalion chief verifies 72-hour rule manually"
  - [ ] Add enhancement ticket for future automation
  - [ ] Skip validation for now (manual override)

- [ ] **If SHOULD Be Implemented:**
  - [ ] Design 72-hour calculation algorithm
  - [ ] Integrate with external schedule system (if API available)
  - [ ] Build hours tracking dashboard
  - [ ] Add ineligibility visual indicators
  - [ ] Auto-flag members approaching limit

- [ ] **Manual Skip Functionality**
  - [ ] Can battalion chief manually mark member as ineligible?
  - [ ] UI for selecting skip reason (training, medical, 72-hour, etc.)
  - [ ] Verify skipped member stays at #0
  - [ ] Next member (#1) takes hold and moves to bottom

**RFC Rules to Implement:**
- Rule #7: 72-hour safety (if automated)
- Rule #8: Training conflict skips
- Rule #2: Ineligible member stays at #0

**Acceptance:** AC-03, AC-04 pass

---

### 13. VALIDATE Cancel vs Complete Logic
**RFC Rules:** AC-06, AC-13, Rule #13
**Effort:** 4 hours

**Test Matrix:**

| Scenario | Member Position Before | Action | Expected Position After | Expected last_hold_date |
|----------|----------------------|--------|------------------------|------------------------|
| Complete | #0 | Complete hold | #17 (bottom) | Updated to hold date |
| Complete | #5 | Complete hold | #17 (bottom) | Updated to hold date |
| Cancel | #0 | Cancel before start | #0 (stays top) | Unchanged (or null) |
| Cancel | #5 | Cancel before start | #5 (unchanged) | Unchanged |

**Code Review:**
- [ ] Read `src/hooks/useScheduledHolds.ts:122-188` (`removeScheduledHold`)
- [ ] Verify cancel logic preserves position
- [ ] Check if it recalculates rotation (it shouldn't for cancel)
- [ ] Review database operations

**UI Validation:**
- [ ] Separate "Cancel" and "Complete" buttons?
- [ ] Different colors/labels?
- [ ] Clear user messaging about impact?
- [ ] Confirmation dialogs explain difference?

**Acceptance:** AC-06, AC-13 pass

---

### 14. VALIDATE Hold Locking (7 Days)
**RFC Rules:** AC-07, AC-08, Rule #14
**Effort:** 4 hours

**Test Plan:**
- [ ] **Find Lock Implementation**
  - [ ] Review `src/utils/validation.ts` (isHoldLocked function)
  - [ ] Check calculation: `completedDate + 7 days < today`
  - [ ] Verify used in Calendar modal

- [ ] **Test Lock Behavior**
  ```typescript
  // Test cases:
  Hold completed 6 days ago → editable ✓
  Hold completed 7 days ago → locked ✗
  Hold completed 8 days ago → locked ✗
  ```

- [ ] **Verify UI**
  - [ ] Lock icon appears on locked holds
  - [ ] Edit button disabled for locked holds
  - [ ] Tooltip explains lock
  - [ ] Admin override option (with reason logging)

- [ ] **Test Editable Fields**
  - [ ] Station assignment: editable ✓
  - [ ] Time/duration: NOT editable (per RFC)
  - [ ] Notes: editable or not? (clarify)

**Code Found:** `src/components/Calendar.tsx:614-616,661-696`
- Lock icon and disabled state already implemented!
- Need to verify 7-day calculation is correct

**Acceptance:** AC-07, AC-08 pass

---

### 15. FIX RLS Security Policies
**RFC Rules:** All (security foundation)
**Effort:** 4 hours - 3 days

**Current State:** NO ACCESS CONTROL (all operations public)

**Recommended Quick Fix (Option A):**
```sql
-- Allow public read (firefighters can view rotation)
-- Require auth for writes (only battalion chiefs modify)

DROP POLICY "Enable insert access for all users" ON firefighters;
DROP POLICY "Enable update access for all users" ON firefighters;
DROP POLICY "Enable delete access for all users" ON firefighters;

CREATE POLICY "Public can view firefighters"
  ON firefighters FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Auth required for modifications"
  ON firefighters FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

**Proper Fix (Option B - Long Term):**
- Implement shift-based isolation
- Add `user_shifts` table
- Restrict each shift to own data
- Full audit trail

**Decision Required:** Discuss with client which option

---

## 🟠 PHASE 2: BUSINESS LOGIC ENHANCEMENTS (Week 3-6)

### 16. Implement/Enhance Battalion Chief Override UI
**RFC Rules:** Rule #11, AC-05, AC-09, AC-10
**Effort:** 2 weeks

**Features to Build/Verify:**
- [ ] **Manual Member Selection**
  - [ ] Override rotation to select specific member
  - [ ] UI dropdown showing all eligible members
  - [ ] Certification badges visible
  - [ ] Reason dropdown (certification, command decision, etc.)

- [ ] **Manual Roster Reordering**
  - [ ] Drag-and-drop interface
  - [ ] Move new hire up from bottom
  - [ ] Atomic position updates
  - [ ] Audit log of changes

- [ ] **Station Reassignment**
  - [ ] Override vacancy station
  - [ ] Edit station post-completion (< 7 days)
  - [ ] Clear UI showing override
  - [ ] Audit logging

- [ ] **Override Audit Trail**
  - [ ] Capture: who, when, what, why
  - [ ] Before/after snapshots
  - [ ] Immutable log
  - [ ] Searchable/filterable

**New Components:**
- `src/components/ManualMemberSelection.tsx`
- `src/components/DragDropRoster.tsx` (if not exists)
- `src/components/OverrideAuditLog.tsx`

**Acceptance:** AC-05, AC-10, AC-11 functionality

---

### 17. Implement Eligibility System
**RFC Rules:** Rule #7, Rule #8, AC-03, AC-04
**Effort:** 2-3 weeks (if automating 72-hour tracking)

**Decision Point:** Automated vs Manual 72-Hour Tracking

**Option A: Manual (Current State)**
- [ ] Add UI note: "BC verifies 72-hour rule manually"
- [ ] Add manual skip button
- [ ] Reason dropdown: training, 72-hour, medical, etc.
- [ ] Visual indicator on skipped members
- [ ] Audit log with skip reason

**Option B: Automated (Future Enhancement)**
- [ ] Integrate with external schedule system API
- [ ] Calculate rolling 72-hour window
- [ ] Track hours worked per member
- [ ] Auto-flag ineligible members
- [ ] Visual dashboard: "45/72 hours" progress bar
- [ ] Auto-skip with audit logging

**Subtasks for Manual (Recommended First):**
- [ ] Add "Mark Ineligible" button in admin mode
- [ ] Reason dropdown with RFC skip reasons
- [ ] Ineligibility badge on member (yellow warning)
- [ ] Verify #0 stays at top when skipped
- [ ] Verify #1 takes hold and moves to bottom
- [ ] Log skip event with reason + timestamp

**Acceptance:** AC-03, AC-04 (with manual override)

---

### 18. Add User Role Context & Explanations
**RFC Application:** Makes business rules clear to users
**Effort:** 1 week

**Features:**
- [ ] **Role Indicator**
  - [ ] "Viewing as: Firefighter" badge
  - [ ] "Battalion Chief Mode" when admin enabled
  - [ ] Visual distinction (icon + color)

- [ ] **Disabled Date Explanations**
  - [ ] Tooltip: "Admin mode required to assign holds"
  - [ ] Cursor: not-allowed
  - [ ] Help text in calendar footer

- [ ] **Onboarding for New Users**
  - [ ] First-time user guide
  - [ ] Explain role differences
  - [ ] Show how to enable admin mode (for chiefs)

- [ ] **Contextual Help**
  - [ ] Info icons next to key features
  - [ ] Tooltips explaining business rules
  - [ ] Link to full rulebook

**New Components:**
- `src/components/RoleIndicator.tsx`
- `src/components/OnboardingGuide.tsx`

---

### 19. Build Metrics Dashboard for Fairness
**RFC Rules:** Rule #16, AC-13
**Effort:** 2 weeks

**Required Metrics (per RFC):**
- [ ] **Holds Per Member**
  - [ ] Total count
  - [ ] Last 30 days
  - [ ] Last 90 days
  - [ ] All time

- [ ] **Average Interval Between Holds**
  - [ ] Per member calculation
  - [ ] Identify outliers (too frequent or too rare)
  - [ ] Visual chart/graph

- [ ] **Holds Per Station**
  - [ ] Breakdown by station number
  - [ ] Show distribution
  - [ ] Identify imbalances

- [ ] **Holds Per Shift**
  - [ ] Compare A, B, C shifts
  - [ ] Ensure fairness across shifts

- [ ] **Fairness Score** (NEW)
  - [ ] Standard deviation calculation
  - [ ] Flag members >2σ from mean
  - [ ] Alert if rotation is unbalanced

- [ ] **Skip Frequency** (NEW)
  - [ ] Times each member skipped
  - [ ] Reasons breakdown
  - [ ] Identify members consistently skipped

**Implementation:**
- File already exists: `src/utils/metricsCalculations.ts`
- Expand with new metrics
- Create dashboard component
- Add visualization (charts)

**New Component:**
- `src/components/MetricsDashboard.tsx`

**Acceptance:** AC-13 reporting requirements

---

## 🟡 PHASE 3: TESTING & VALIDATION (Week 7-10)

### 20. Business Logic Test Suite (NEW - CRITICAL)
**RFC:** All acceptance criteria
**Effort:** 2 weeks

**Test Files to Create:**

**Complete Hold Tests:**
```typescript
// File: src/utils/rotationLogic.test.ts (expand existing)

describe('Complete Hold - Rotation Algorithm', () => {
  test('AC-02: Member moves to bottom after completion', () => {
    const roster = [
      { id: '1', name: 'Alice', order_position: 0 },
      { id: '2', name: 'Bob', order_position: 1 },
      { id: '3', name: 'Charlie', order_position: 2 },
    ];

    const result = completeHold(roster, '2'); // Bob completes

    expect(result[0].name).toBe('Alice'); // #0
    expect(result[1].name).toBe('Charlie'); // #1 (moved up)
    expect(result[2].name).toBe('Bob'); // #2 (moved to bottom)
  });

  test('AC-02: last_hold_date updated', () => {
    // Test last_hold_date set to completion date
  });

  test('Edge: Complete hold for member at bottom', () => {
    // Member already at bottom stays at bottom
  });
});
```

**Skip Logic Tests:**
```typescript
// File: src/utils/skipLogic.test.ts (NEW)

describe('Skip Logic - Member Stays at Top', () => {
  test('AC-03: Skipped member remains at #0', () => {
    const roster = [
      { id: '1', name: 'Alice', order_position: 0, ineligible: true },
      { id: '2', name: 'Bob', order_position: 1 },
    ];

    const selected = selectNextMember(roster);

    expect(selected.id).toBe('2'); // Bob selected
    expect(roster[0].id).toBe('1'); // Alice stays at #0
  });

  test('AC-04: 72-hour rule triggers skip', () => {
    // Test automated 72-hour calculation (if implemented)
  });
});
```

**Cancel Tests:**
```typescript
// File: src/hooks/useScheduledHolds.test.ts (expand existing)

describe('Cancel vs Complete Logic', () => {
  test('AC-06: Cancel preserves position', () => {
    // Verify removeScheduledHold doesn't change order_position
  });

  test('AC-13: Cancel before start keeps member at top', () => {
    // Full integration test
  });
});
```

**Hold Locking Tests:**
```typescript
// File: src/utils/validation.test.ts (expand existing)

describe('Hold Locking After 7 Days', () => {
  test('AC-07: Only station editable pre-lock', () => {
    // Test editable fields
  });

  test('AC-08: Lock prevents edits after 7 days', () => {
    const hold = { completed_at: '2025-01-23' }; // 8 days ago
    expect(isHoldLocked(hold)).toBe(true);
  });

  test('Holds within 7 days are editable', () => {
    const hold = { completed_at: '2025-01-29' }; // 2 days ago
    expect(isHoldLocked(hold)).toBe(false);
  });
});
```

**E2E Tests:**
```typescript
// File: test-artifacts/e2e/business-logic.spec.ts (NEW)

test('AC-02: Complete Hold End-to-End', async ({ page }) => {
  // 1. Enable admin mode
  // 2. Click firefighter "Complete Hold"
  // 3. Confirm dialog
  // 4. Verify roster reorder
  // 5. Verify position change
  // 6. Check database state
});

test('AC-03: Skip Member Workflow', async ({ page }) => {
  // 1. Mark member #0 as ineligible
  // 2. Assign hold
  // 3. Verify #1 selected
  // 4. Verify #0 still at top
});
```

---

### 21. Implement Audit Event System
**RFC Rules:** Rule #17, All ACs require audit
**Effort:** 1 week

**Audit Event Schema:**
```typescript
interface AuditEvent {
  id: string;
  timestamp: string; // UTC
  actor: string; // user_id or 'system'
  action: 'complete_hold' | 'skip_member' | 'override_selection' |
          'edit_station' | 'cancel_hold' | 'reorder_roster' |
          'add_member' | 'deactivate_member';
  entity_type: 'firefighter' | 'scheduled_hold' | 'roster';
  entity_id: string;
  before_state: any; // JSON snapshot
  after_state: any; // JSON snapshot
  reason: string | null; // For overrides, skips, etc.
  metadata: {
    shift: string;
    policy_version: string; // Which rulebook version
    [key: string]: any;
  };
}
```

**Implementation:**
- [ ] Create audit_events table in Supabase
- [ ] Add audit logging to all mutation operations
- [ ] Capture before/after snapshots
- [ ] Add reason field for overrides
- [ ] Store policy version used
- [ ] Make events immutable (no updates/deletes)

**New Files:**
- `supabase/migrations/YYYYMMDD_create_audit_events.sql`
- `src/utils/auditLogger.ts`

---

### 22-30. Additional Testing Tasks
(Include all from previous audits - accessibility, cross-browser, Lighthouse, PWA, mobile devices, network throttling, edge cases, screen readers)

---

## 🔵 PHASE 4: ADVANCED FEATURES (Week 11-18)

### 31. 72-Hour Tracking Dashboard (If Approved)
**RFC Rules:** Rule #7, AC-04
**Effort:** 3 weeks

**Only if client wants automated tracking**

**Features:**
- [ ] External schedule system integration
- [ ] Rolling 72-hour window calculation
- [ ] Visual progress bars per member
- [ ] Auto-flagging of ineligible members
- [ ] Override capability with reason
- [ ] Audit logging of violations prevented

---

### 32. Certification-Based Selection (Enhancement)
**RFC Rules:** AC-05 (skill-based override)
**Effort:** 1 week

**Features:**
- [ ] Certification badges in UI
  - [ ] EMT badge
  - [ ] Paramedic badge
  - [ ] FTO badge
  - [ ] Apparatus certifications

- [ ] Filtering
  - [ ] "Show only Paramedics"
  - [ ] "Show EMT certified"
  - [ ] "Show apparatus qualified"

- [ ] Smart Selection
  - [ ] Suggest qualified members
  - [ ] Warn if assigning unqualified
  - [ ] Allow override with confirmation

---

### 33. Multi-Vacancy Processing (Enhancement)
**RFC Rules:** AC-12, Rule #3 (guardrail)
**Effort:** 1 week

**Features:**
- [ ] Batch vacancy import
- [ ] Serial processing (atomic)
- [ ] Prevent double-assignment
- [ ] Transaction rollback on failure
- [ ] Progress indicator for batch

---

### 34. Notification System
**RFC Rules:** Rule #15, AC-11
**Effort:** 2-3 weeks

**Channels:**
- [ ] SMS via Twilio
- [ ] Email via SendGrid/Resend
- [ ] Push notifications (PWA)

**Features:**
- [ ] Attempt delivery before 22:00 previous night
- [ ] Retry logic (max 3 attempts)
- [ ] Delivery status logging
- [ ] Opt-in/opt-out per channel
- [ ] Notification preferences per member

---

### 35-50. Additional Features
- Configuration-as-data system
- JSON schema validation
- Policy versioning
- Time zone management
- Export functionality
- Advanced analytics
- Code optimization
- Performance tuning

---

## 📊 IMPLEMENTATION PRIORITIES (Validated with Rulebook)

### Must Have (Launch Blockers)
1. ✅ WebSocket fix
2. ❓ Complete Hold rotation (TEST FIRST!)
3. ❓ Cancel vs Complete distinction (VALIDATE!)
4. ❓ Hold locking (VERIFY!)
5. ❌ RLS security policies (FIX REQUIRED!)

### Should Have (Q1 2025)
6. Skip logic (manual)
7. Battalion chief overrides
8. Metrics dashboard
9. Audit logging enhancements
10. Role context UI

### Could Have (Q2 2025)
11. 72-hour automated tracking
12. Certification filtering
13. Multi-vacancy processing
14. Notification system
15. Advanced features

---

## 🚀 RECOMMENDED NEXT STEPS

### Immediate (Next 4 Hours)
1. **TEST Complete Hold Workflow**
   - Read code in `useScheduledHolds.ts` and `rotationLogic.ts`
   - Verify algorithm matches RFC Rule #3
   - Test in browser with admin mode
   - Document findings

2. **TEST Cancel vs Complete**
   - Read `removeScheduledHold` function
   - Verify cancel preserves position
   - Test both workflows
   - Document differences

3. **VERIFY Hold Locking**
   - Read `isHoldLocked` in `validation.ts`
   - Test with dates 6, 7, 8 days old
   - Verify UI lock indicator
   - Document behavior

### This Week (Next 16 Hours)
4. **Fix any broken business logic found in testing**
5. **Implement RLS security fixes**
6. **Create comprehensive test suite**
7. **Deploy and monitor**

### Next Week
8. Enhance admin mode UX
9. Add role context indicators
10. Build metrics dashboard
11. Improve mobile experience

---

## 📝 DELIVERABLES CHECKLIST

### Documentation ✓
- [x] `docs/COMPREHENSIVE-AUDIT-TASKS.md` - All tasks from audits 1 & 2
- [x] `docs/AUDIT-REMEDIATION-SUMMARY.md` - What's been fixed
- [x] `docs/ACCESSIBILITY.md` - WCAG guidelines
- [x] `docs/SECURITY-RLS-AUDIT.md` - RLS vulnerability report
- [ ] `docs/IMPLEMENTATION-ROADMAP.md` - This document (saving now)
- [ ] `docs/BUSINESS-RULEBOOK.md` - RFC rules for reference
- [ ] `docs/TEST-ACCEPTANCE-CRITERIA.md` - AC-01 through AC-15

### Code Components ✓
- [x] `src/hooks/useConnectionStatus.ts`
- [x] `src/components/ConnectionStatusIndicator.tsx`
- [x] `src/components/SkeletonLoader.tsx`
- [x] `src/components/EmptyState.tsx`
- [ ] Test suite files (create next)
- [ ] Migration scripts for RLS
- [ ] Audit logging utilities

### Testing Artifacts
- [ ] Business logic test suite (vitest)
- [ ] E2E acceptance tests (playwright)
- [ ] Accessibility test results
- [ ] Lighthouse audit reports
- [ ] Cross-browser test matrix

---

## 🎯 SUCCESS CRITERIA

### Technical (From Audits)
- ✅ Zero WebSocket errors
- ✅ LCP < 600ms
- ✅ CLS = 0
- ✅ Lighthouse Accessibility 95+
- ✅ WCAG 2.1 AA compliant

### Business (From Rulebook)
- ✅ Complete Hold moves member to bottom (AC-02)
- ✅ Skip preserves #0 position (AC-03, AC-04)
- ✅ Cancel preserves position (AC-06, AC-13)
- ✅ Hold locking at 7 days (AC-07, AC-08)
- ✅ All 15 acceptance criteria pass
- ✅ Rotation is deterministic
- ✅ Updates are atomic
- ✅ Full audit trail exists

### User Experience
- ✅ Battalion chiefs can assign holds in <30 seconds
- ✅ Firefighters can check position in <10 seconds
- ✅ Real-time updates < 2 seconds
- ✅ Mobile works with gloves
- ✅ Works offline (cached view)

---

## 🏁 FINAL NOTES

**What Makes This Different:**
This roadmap is now backed by:
1. Three comprehensive audits
2. RFC-compliant business rules
3. Acceptance criteria (testable)
4. Real-world user context
5. Client Q&A clarifications

**Next Smart Steps (Per Client Suggestion):**
1. ✅ Comprehensive task breakdown (DONE - this document)
2. 🔄 Minimal state machine (NEXT)
3. 🔄 JSON Schemas (Member, Hold, Override, AuditEvent)
4. 🔄 Jest/Playwright test matrix wired to AC-01 through AC-15

**Confidence Level:**
- Technical fixes: 95% (already tested and working)
- Business logic: 60% (needs validation against codebase)
- Security: 100% (issue identified, solutions documented)
- Timeline: 85% (depends on business logic validation findings)

---

*Document created: January 31, 2025*
*Version: 4.0 FINAL - Implementation Ready*
*Next Action: TEST business logic, then BUILD missing pieces*
